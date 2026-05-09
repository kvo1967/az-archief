# Upload alleen de bestanden die nog ontbreken in R2
# Leest ontbrekende-boekjes.txt (gegenereerd door check-boekjes.ps1)

$bucket = "az-matchday-programms"
$bronMap = "public\boekjes"
$ontbrekendeBestand = "ontbrekende-boekjes.txt"

if (-not (Test-Path $ontbrekendeBestand)) {
    Write-Host "Geen ontbrekende-boekjes.txt gevonden." -ForegroundColor Red
    Write-Host "Run eerst .\check-boekjes.ps1 om de lijst te genereren." -ForegroundColor Yellow
    exit 1
}

$ontbrekend = Get-Content $ontbrekendeBestand | Where-Object { $_.Trim() -ne "" }
$totaal = $ontbrekend.Count

if ($totaal -eq 0) {
    Write-Host "Lijst is leeg, niets te uploaden." -ForegroundColor Green
    exit 0
}

Write-Host "Te uploaden: $totaal bestanden" -ForegroundColor Cyan
Write-Host ""

$teller = 0
$geupload = 0
$mislukt = 0
$mislukteBestand = "mislukte-uploads.txt"
$mislukteLijst = New-Object System.Collections.ArrayList

foreach ($naam in $ontbrekend) {
    $teller++
    $progressie = "[$teller/$totaal]"
    $volPad = Join-Path $bronMap $naam

    if (-not (Test-Path $volPad)) {
        $mislukt++
        Write-Host "$progressie SKIP $naam (bestand niet gevonden lokaal)" -ForegroundColor Yellow
        [void]$mislukteLijst.Add($naam)
        continue
    }

    $output = wrangler r2 object put "$bucket/$naam" `
        --file=$volPad `
        --remote 2>&1 | Out-String

    if ($LASTEXITCODE -eq 0) {
        $geupload++
        Write-Host "$progressie OK  $naam" -ForegroundColor Green
    }
    else {
        $mislukt++
        [void]$mislukteLijst.Add($naam)
        Write-Host "$progressie ERR $naam" -ForegroundColor Red
        Write-Host "    $output" -ForegroundColor DarkRed
    }
}

# Schrijf mislukten weg voor eventuele retry
if ($mislukteLijst.Count -gt 0) {
    $mislukteLijst | Out-File -FilePath $mislukteBestand -Encoding utf8
}

Write-Host ""
Write-Host "=== Klaar ===" -ForegroundColor Cyan
Write-Host "Geupload: $geupload" -ForegroundColor Green

if ($mislukt -gt 0) {
    Write-Host "Mislukt:  $mislukt" -ForegroundColor Red
    Write-Host ""
    Write-Host "Mislukte bestanden gelogd in: $mislukteBestand" -ForegroundColor Yellow
    Write-Host "Tip: run .\check-boekjes.ps1 om de actuele status te zien." -ForegroundColor Yellow
}
else {
    Write-Host "Mislukt:  $mislukt"
    Write-Host ""
    Write-Host "Alle ontbrekende bestanden zijn nu geupload." -ForegroundColor Green
}