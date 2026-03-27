$bytes = [System.Text.Encoding]::UTF8.GetBytes((Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8))

# The exact bytes we need to find and replace
# old: ends with "prize_amount...total_tickets),\n      });\n      setMsg('..emoji.. Campaign created successfully!');\n      setForm"
# new: insert "category: form.category," after the closing paren of prize_amount, before the ); line

$old_end = [System.Text.Encoding]::UTF8.GetBytes("prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
      });
      setMsg('")

# Find this sequence
$found = $false
for ($i = 0; $i -lt $bytes.Length - $old_end.Length - 50; $i++) {
    $match = $true
    for ($j = 0; $j -lt $old_end.Length; $j++) {
        if ($bytes[$i+$j] -ne $old_end[$j]) { $match = $false; break }
    }
    if ($match) {
        Write-Host "Found at byte $i"
        # Show 20 bytes after the match
        for ($k = $i; $k -lt $i + 20; $k++) {
            Write-Host ("{0:x2}" -f $bytes[$k]) -NoNewline
            Write-Host " " -NoNewline
        }
        Write-Host ''
        break
    }
}
