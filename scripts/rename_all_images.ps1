# Complete rename: folders by SKU (if needed) and files to SKU-1, SKU-2, etc
# Then update product JSON files to reference images/SKU/SKU-1.jpg

$root = Get-Location
$imagesDir = Join-Path $root 'images'

# Load products from products.json
$productFile = Join-Path $root 'products.json'
$products = @()
if (Test-Path $productFile) {
    $json = Get-Content -Raw $productFile | ConvertFrom-Json
    $products = @($json)
}

# Build name->sku and sku->name mappings
$nameToSku = @{}
$skuToName = @{}
foreach ($p in $products) {
    if ($null -ne $p.name -and $null -ne $p.sku) {
        $normalized = $p.name.ToLower() -replace '[^a-z0-9]', ' ' -replace '\s+', ' ' -replace '^\s+|\s+$'
        if (-not $nameToSku.ContainsKey($normalized)) {
            $nameToSku[$normalized] = $p.sku
            $skuToName[$p.sku] = $p.name
        }
    }
}

Write-Host "Loaded $($products.Count) products, $($skuToName.Count) unique SKUs"

# Process folders
if (-not (Test-Path $imagesDir)) {
    Write-Host "images directory not found"; exit 1
}

$processedSkus = @()

Get-ChildItem -Path $imagesDir -Directory | ForEach-Object {
    $folderName = $_.Name
    $folderPath = $_.FullName
    $matchedSku = $null
    
    # Check if folder name matches a product name
    $normalized = $folderName.ToLower() -replace '[^a-z0-9]', ' ' -replace '\s+', ' ' -replace '^\s+|\s+$'
    if ($nameToSku.ContainsKey($normalized)) {
        $matchedSku = $nameToSku[$normalized]
    }
    # Check if folder name IS a SKU
    elseif ($skuToName.ContainsKey($folderName)) {
        $matchedSku = $folderName
    }
    
    if ($null -ne $matchedSku) {
        Write-Host "Processing: $folderName -> $matchedSku"
        
        # Rename folder if needed
        if ($folderName -ne $matchedSku) {
            $newFolderPath = Join-Path $imagesDir $matchedSku
            if (Test-Path $newFolderPath) {
                Write-Host "  WARNING: $matchedSku folder exists, merging files"
            } else {
                Rename-Item -LiteralPath $folderPath -NewName $matchedSku
                $folderPath = $newFolderPath
                Write-Host "  Renamed folder to: $matchedSku"
            }
        }
        
        # Rename files inside
        $files = Get-ChildItem -Path $folderPath -File | Sort-Object Name
        $fileNum = 1
        foreach ($file in $files) {
            $newName = "$matchedSku-$fileNum$($file.Extension)"
            if ($file.Name -ne $newName) {
                Rename-Item -LiteralPath $file.FullName -NewName $newName
                Write-Host "    Renamed: $($file.Name) -> $newName"
            }
            $fileNum++
        }
        
        $processedSkus += $matchedSku
    } else {
        Write-Host "Skipped: $folderName (no matching product)"
    }
}

Write-Host "`nProcessed $($processedSkus.Count) folders"

# Update product JSON files
$jsonFiles = @(
    (Join-Path $root 'products.json'),
    (Join-Path $root 'public\products.json'),
    (Join-Path $root 'server\products.json'),
    (Join-Path $root 'products-updated.json')
) | Where-Object { Test-Path $_ }

foreach ($jsonFile in $jsonFiles) {
    Write-Host "Updating $jsonFile"
    try {
        $txt = Get-Content -Raw $jsonFile
        $json = $txt | ConvertFrom-Json
        $modified = $false
        
        foreach ($prod in $json) {
            if ($null -ne $prod.sku -and $processedSkus -contains $prod.sku) {
                $prod.imageUrls = @("images/$($prod.sku)/$($prod.sku)-1.jpg")
                $modified = $true
            }
        }
        
        if ($modified) {
            $json | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonFile
            Write-Host "  Updated!"
        }
    } catch {
        Write-Host "  Error: $_"
    }
}

Write-Host "Done!"
