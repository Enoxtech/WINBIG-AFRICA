$c = Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8
$idx = $c.IndexOf("const [form, setForm]")
if ($idx -eq -1) { Write-Host "NOT FOUND: const [form, setForm]"; exit 1 }
Write-Host "Found at index $idx"
Write-Host $c.Substring($idx, 300)
