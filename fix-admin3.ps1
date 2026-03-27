$content = Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8

$old3 = "prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
      });
      setMsg('`u{1F680} Campaign created successfully!');"
$new3 = "prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
        category: form.category,
      });
      setMsg('`u{1F680} Campaign created successfully!');"

if ($content.Contains($old3)) {
    $content = $content.Replace($old3, $new3)
    Write-Host "Fix 3 applied"
} else {
    Write-Host "FAIL: Fix 3 not found"
}

[System.IO.File]::WriteAllText('C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx', $content, [System.Text.Encoding]::UTF8)
