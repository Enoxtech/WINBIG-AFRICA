$content = Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8

# Fix 1: Add category to form state fields
$old1 = "    title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '',"
$new1 = "    title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '', category: 'general',"
if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "Fix 1 applied: form state"
} else {
    Write-Host "FAIL: Fix 1 not found"
}

# Fix 2: Fix handleCreate - max_tickets -> total_tickets + add category
$old2 = "        max_tickets: parseInt(form.total_tickets),"
$new2 = "        total_tickets: parseInt(form.total_tickets),"
if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "Fix 2 applied: max_tickets -> total_tickets"
} else {
    Write-Host "FAIL: Fix 2 not found"
}

# Fix 3: Add category to createCampaign call
$old3 = "        prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
      });
      setMsg('Campaign created successfully!');"
$new3 = "        prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
        category: form.category,
      });
      setMsg('Campaign created successfully!');"
if ($content.Contains($old3)) {
    $content = $content.Replace($old3, $new3)
    Write-Host "Fix 3 applied: category param"
} else {
    Write-Host "FAIL: Fix 3 not found"
}

# Fix 4: Reset form includes category
$old4 = "setForm({ title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '' });"
$new4 = "setForm({ title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '', category: 'general' });"
if ($content.Contains($old4)) {
    $content = $content.Replace($old4, $new4)
    Write-Host "Fix 4 applied: form reset"
} else {
    Write-Host "FAIL: Fix 4 not found"
}

[System.IO.File]::WriteAllText('C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "File written"
