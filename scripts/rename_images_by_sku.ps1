# rename_images_by_sku.ps1

$scriptDir = Split-Path $MyInvocation.MyCommand.Definition -Parent
$root = Split-Path $scriptDir -Parent
Set-Location $root

Write-Host "Project Root: $root"

$productFiles = @(
    Join-Path $root 'products.json'
    Join-Path $root 'public/products.json'
    Join-Path $root 'server/products.json'
    Join-Path $root 'products-updated.json'
    Join-Path $root 'products-updated.json.bak'
) | Where-Object { Test-Path $_ }

Write-Host "Product files:"
$productFiles | ForEach-Object { Write-Host " - $_" }

$allProducts = @()

foreach ($pf in $productFiles) {
    try {
        $txt = Get-Content -Raw $pf
        try {
            $json = $txt | ConvertFrom-Json
        } catch {
            Write-Host "Warning: Invalid JSON in $pf"
            continue
        }
        if ($json -is [System.Collections.IEnumerable]) {
            $allProducts += $json
        }
    } catch {}
}

function Normalize([string]$s) {
    if ([string]::IsNullOrWhiteSpace($s)) { return "" }
    $s = $s.ToLowerInvariant()
    $s = ($s -replace "[^a-z0-9]", " ")
    $s = ($s -replace "\s+", " ").Trim()
    return $s
}

$map = @{}
foreach ($p in $allProducts) {
    if ($p.name -and $p.sku) {
        $key = Normalize $p.name
        if (-not $map.ContainsKey($key)) {
            $map[$key] = $p.sku
        }
    }
}

$imagesDir = Join-Path $root 'images'

if (-not (Test-Path $imagesDir)) {
    Write-Host "ERROR: images directory not found: $imagesDir"
    exit 1
}

Write-Host "Images Directory: $imagesDir"

Get-ChildItem -Path $imagesDir -Directory | ForEach-Object {

    $folder = $_
    $folderName = $_.Name
    $norm = Normalize $folderName

    if (-not $map.ContainsKey($norm)) {
        Write-Host "No SKU mapping found for: $folderName"
        return
    }

    $sku = $map[$norm]
    $newDirPath = Join-Path $imagesDir $sku

    if ($folderName -ne $sku) {
        Write-Host "Renaming folder '$folderName' → '$sku'"
        Rename-Item -LiteralPath $folder.FullName -NewName $sku
    }

    $dirPath = $newDirPath

    $files = Get-ChildItem -Path $dirPath -File | Sort-Object Name
    $i = 1

    foreach ($f in $files) {
        $ext = $f.Extension
        $newName = "$sku-$i$ext"

        if ($f.Name -ne $newName) {
            Write-Host "  Renaming '$($f.Name)' → '$newName'"
            Rename-Item -LiteralPath $f.FullName -NewName $newName
        }

        $i++
    }

    $firstImage = Get-ChildItem -Path $dirPath -File | Sort-Object Name | Select-Object -First 1
    $imgExt = $firstImage.Extension

    foreach ($pf in $productFiles) {

        $text = Get-Content -Raw $pf
        $json = $null

        try {
            $json = $text | ConvertFrom-Json
        } catch {
            Write-Host "  Skipping invalid JSON in $pf"
        }

        $modified = $false

        if ($json -ne $null) {

            foreach ($prod in $json) {

                if ($prod.sku -and ($prod.sku.ToUpper() -eq $sku.ToUpper())) {

                    # FIX: Add imageUrls property if missing
                    if (-not $prod.PSObject.Properties.Match("imageUrls")) {
                        $prod | Add-Member -MemberType NoteProperty -Name "imageUrls" -Value @()
                    }

                    $prod.imageUrls = @("images/$sku/$sku-1$imgExt")
                    $modified = $true
                }
            }

            if ($modified) {
                $out = $json | ConvertTo-Json -Depth 10
                Set-Content -Path $pf -Value $out
                Write-Host "  Updated JSON in $pf"
                continue
            }
        }

        # Fallback regex replacement
        $escapedSku = [regex]::Escape($sku)
        $pattern = '(?i)images/[^"' + "'" + ']*' + $escapedSku + '[^"' + "'" + ']*'
        $replacement = "images/$sku/$sku-1$imgExt"

        $newText = [regex]::Replace($text, $pattern, $replacement)

        if ($newText -ne $text) {
            Write-Host "  Updated raw references in $pf"
            Set-Content -Path $pf -Value $newText
        }
    }
}

Write-Host "Done."