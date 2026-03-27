$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8))
$start = 7173
# Show 400 bytes from prize_amount line
for ($i = $start; $i -lt $start + 400; $i++) {
    Write-Host ([char]$bytes[$i]) -NoNewline
}
Write-Host ''
Write-Host "Total file bytes: $($bytes.Length)"
