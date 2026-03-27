$bytes = [System.IO.File]::ReadAllBytes('C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx')
# The goal: after "total_tickets)," insert "        category: form.category,\n"
# Pattern to find: the close of prize_amount call, ending with "total_tickets),\n      });\n      setMsg"

# Find the bytes: total_tickets followed by "),\n      });\n      setMsg"
$pattern = [byte[]](
    0x74, 0x6f, 0x74, 0x61, 0x6c, 0x5f, 0x74, 0x69, 0x63, 0x6b, 0x65, 0x74, 0x73, 0x2c, 0x29, 0x2c,
    0x0a, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x7d, 0x29, 0x3b, 0x0a, 0x20, 0x20, 0x20,
    0x20, 0x20, 0x20, 0x20, 0x20, 0x73, 0x65, 0x74, 0x4d, 0x73, 0x67
)
# That's "total_tickets,_\n      });\n      setMsg"

$foundPos = -1
for ($i = 0; $i -lt $bytes.Length - $pattern.Length; $i++) {
    $match = $true
    for ($j = 0; $j -lt $pattern.Length; $j++) {
        if ($bytes[$i+$j] -ne $pattern[$j]) { $match = $false; break }
    }
    if ($match) { $foundPos = $i; break }
}
if ($foundPos -ge 0) {
    Write-Host "Found pattern at byte $foundPos"
    # Show 30 bytes from found position
    for ($k = $foundPos; $k -lt $foundPos + 30; $k++) {
        Write-Host ("{0:x2}" -f $bytes[$k]) -NoNewline; Write-Host " " -NoNewline
    }
    Write-Host ''
} else {
    Write-Host "Pattern not found"
}
