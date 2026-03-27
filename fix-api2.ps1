$path = "C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\api.ts"
$content = Get-Content $path -Raw -Encoding UTF8
$content = $content.Replace("onst API_BASE", "const API_BASE")
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "Fixed"
