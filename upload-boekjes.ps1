# Upload alle boekjes naar R2, sla bestaande bestanden over
# Gebruik: .\upload-boekjes.ps1

$bucket = "az-matchday-programms"
$bronMap = "public\boekjes"

$bestanden = Get-ChildItem -Path $bronMap -File | Where-Object {
    $_.Extension -in '.webp', '.jpg', '.jpeg', '.png'
}

$totaal = $bestanden.Count
$teller = 0
$geupload = 0
$overgeslagen = 0
$mislukt = 0

Write-Host "Start upload van $totaal bestanden naar R2 bucket '$bucket'..." -ForegroundColor Cyan
Write-Host ""

foreach ($bestand in $bestanden) {
    $teller++
    $relPad = $bestand.Name
    $progressie = "[$teller/$totaal]"

    $output = wrangler r2 object put "$bucket/$relPad" `
        --file="$($bestand.FullName)" `
        --if-none-match="*" `
        --remote 2>&1 | Out-String

    if ($LASTEXITCODE -eq 0) {
        $geupload++
        Write-Host "$progressie OK  $relPad" -ForegroundColor Green
    }
    elseif ($output -match "PreconditionFailed|already exists|412") {
        $overgeslagen++
        Write-Host "$progressie --  $relPad (bestaat al)" -ForegroundColor DarkGray
    }
    else {
        $mislukt++
        Write-Host "$progressie ERR $relPad" -ForegroundColor Red
        Write-Host "    $output" -ForegroundColor DarkRed
    }
}

Write-Host ""
Write-Host "=== Klaar ===" -ForegroundColor Cyan
Write-Host "Geupload:     $geupload" -ForegroundColor Green
Write-Host "Overgeslagen: $overgeslagen" -ForegroundColor DarkGray

if ($mislukt -gt 0) {
    Write-Host "Mislukt:      $mislukt" -ForegroundColor Red
}
else {
    Write-Host "Mislukt:      $mislukt" -ForegroundColor DarkGray
}