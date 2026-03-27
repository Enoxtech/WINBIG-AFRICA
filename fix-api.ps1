$content = Get-Content -Path "C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\api.ts" -Raw -Encoding UTF8
$content = $content.Remove(0, 1)
$newLine = "const ADMIN_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YmFxZ2xwZWFzZWxhbGRpankiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTAwMDAwMDAwLCJleHAiOjIwNjU0NzYwMDB9.5YV5am7y0RlCfqTkR-MN-H7hQTXjyvM-8YcPwGUh0gk';" + [Environment]::NewLine
$content = $newLine + $content
[System.IO.File]::WriteAllText("C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\api.ts", $content, [System.Text.UTF8Encoding]::new($false))
Write-Output "Done"
