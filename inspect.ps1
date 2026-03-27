$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8))
$start = 5460
for ($i = $start; $i -lt $start + 300; $i++) {
    Write-Host ([char]$bytes[$i]) -NoNewline
}
Write-Host ''
