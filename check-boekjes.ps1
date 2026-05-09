# Check welke lokale boekjes nog niet in R2 staan
# Gebruikt HEAD requests naar de publieke R2 URL

$bronMap = "public\boekjes"
$publicUrl = "https://pub-02a6c42dcd6c41228aa01ec8867770be.r2.dev"
$ontbrekendeBestand = "ontbrekende-boekjes.txt"

$bestanden = Get-ChildItem -Path $bronMap -File | Where-Object {
    $_.Extension -in '.webp', '.jpg', '.jpeg', '.png'
} | Sort-Object Name

$totaal = $bestanden.Count
Write-Host "Lokaal: $totaal bestanden in $bronMap" -ForegroundColor Cyan
Write-Host "Check tegen: $publicUrl" -ForegroundColor Cyan
Write-Host ""

# Parallel checks; verzamel resultaten in een array
$resultaten = $bestanden | ForEach-Object -ThrottleLimit 10 -Parallel {
    $bestandsnaam = $_.Name
    $encoded = [System.Uri]::EscapeDataString($bestandsnaam)
    $url = "$using:publicUrl/$encoded"

    try {
        $null = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
        [PSCustomObject]@{
            Naam = $bestandsnaam
            Aanwezig = $true
        }
    }
    catch {
        [PSCustomObject]@{
            Naam = $bestandsnaam
            Aanwezig = $false
        }
    }
}

$aanwezig = ($resultaten | Where-Object Aanwezig).Count
$ontbrekend = $resultaten | Where-Object { -not $_.Aanwezig } | Select-Object -ExpandProperty Naam | Sort-Object
$ontbreektCount = $ontbrekend.Count

# Schrijf lijst weg
if ($ontbreektCount -gt 0) {
    $ontbrekend | Out-File -FilePath $ontbrekendeBestand -Encoding utf8
}
elseif (Test-Path $ontbrekendeBestand) {
    Remove-Item $ontbrekendeBestand
}

Write-Host ""
Write-Host "=== Resultaat ===" -ForegroundColor Cyan
Write-Host "Lokaal totaal:  $totaal"
Write-Host "Aanwezig in R2: $aanwezig" -ForegroundColor Green

if ($ontbreektCount -eq 0) {
    Write-Host "Ontbreekt:      0" -ForegroundColor Green
    Write-Host ""
    Write-Host "Alle bestanden staan in R2." -ForegroundColor Green
}
else {
    Write-Host "Ontbreekt:      $ontbreektCount" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Lijst geschreven naar: $ontbrekendeBestand" -ForegroundColor Yellow
    Write-Host "Eerste 10 ontbrekende:" -ForegroundColor Yellow

    $ontbrekend | Select-Object -First 10 | ForEach-Object {
        $regel = "  - " + $_
        Write-Host $regel -ForegroundColor DarkYellow
    }
}