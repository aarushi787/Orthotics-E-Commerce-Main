# Rename image folders and files by SKU
# Matches folder names to product names, renames folder to SKU, renames files to SKU-1.jpg etc

$root = Get-Location
$imagesDir = Join-Path $root 'images'

# Load products from products.json
$productFile = Join-Path $root 'products.json'
$products = @()
if (Test-Path $productFile) {
    $json = Get-Content -Raw $productFile | ConvertFrom-Json
    $products = @($json)
}

# Build name->sku mapping
$map = @{}
foreach ($p in $products) {
    if ($null -ne $p.name -and $null -ne $p.sku) {
        $normalized = $p.name.ToLower() -replace '[^a-z0-9]', ' ' -replace '\s+', ' ' -replace '^\s+|\s+$'
        if (-not $map.ContainsKey($normalized)) {
            $map[$normalized] = $p.sku
        }
    }
}

Write-Host "Loaded $($map.Count) products"

# Process each folder in images/
if (-not (Test-Path $imagesDir)) {
    Write-Host "images directory not found"
    exit 1
}

Get-ChildItem -Path $imagesDir -Directory | ForEach-Object {
    $folderName = $_.Name
    $normalized = $folderName.ToLower() -replace '[^a-z0-9]', ' ' -replace '\s+', ' ' -replace '^\s+|\s+$'
    
    if ($map.ContainsKey($normalized)) {
        $sku = $map[$normalized]
        Write-Host "Folder: $folderName -> SKU: $sku"
        
        # Rename folder if needed
        $folderPath = $_.FullName
        if ($folderName -ne $sku) {
            $newFolderPath = Join-Path $imagesDir $sku
            if (Test-Path $newFolderPath) {
                Write-Host "  WARNING: $sku folder already exists, skipping rename"
            } else {
                Rename-Item -LiteralPath $folderPath -NewName $sku
                Write-Host "  Renamed folder to: $sku"
                $folderPath = $newFolderPath
            }
        }
        
        # Rename files inside
        $files = Get-ChildItem -Path $folderPath -File | Sort-Object Name
        $fileNum = 1
        foreach ($file in $files) {
            $newName = "$sku-$fileNum$($file.Extension)"
            if ($file.Name -ne $newName) {
                Rename-Item -LiteralPath $file.FullName -NewName $newName
                Write-Host "  Renamed file: $($file.Name) -> $newName"
            }
            $fileNum++
        }
    } else {
        Write-Host "No match for folder: $folderName"
    }
}

Write-Host "Done!"
