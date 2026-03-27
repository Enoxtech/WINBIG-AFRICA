$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8))
# Search for "prize_amount: parseFloat" in bytes
$search = [System.Text.Encoding]::UTF8.GetBytes("prize_amount: parseFloat")
$found = $false
for ($i = 0; $i -lt $bytes.Length - $search.Length; $i++) {
    $match = $true
    for ($j = 0; $j -lt $search.Length; $j++) {
        if ($bytes[$i+$j] -ne $search[$j]) { $match = $false; break }
    }
    if ($match) {
        Write-Host "Found at byte $i"
        for ($k = $i; $k -lt $i + 200; $k++) {
            Write-Host ([char]$bytes[$k]) -NoNewline
        }
        Write-Host ''
        break
    }
}
