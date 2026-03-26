# Register admin user
$regBody = @{
    email = "admin@winbig.africa"
    password = "Admin@WinBig2026"
    name = "Admin"
    phone = "+2348000000000"
} | ConvertTo-Json

try {
    $r = Invoke-WebRequest -Uri "https://backend-production-9aa6.up.railway.app/api/auth/register" -Method POST -ContentType "application/json" -Body $regBody -ErrorAction Stop
    Write-Host "Register status: $($r.StatusCode)"
    Write-Host "Register response: $($r.Content)"
} catch {
    $status = [int]$_.Exception.Response.StatusCode
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "Register failed: $status"
    Write-Host "Body: $body"
}

Start-Sleep 1

# Upgrade to admin
$upBody = @{ email = "admin@winbig.africa" } | ConvertTo-Json

try {
    $r2 = Invoke-WebRequest -Uri "https://backend-production-9aa6.up.railway.app/api/admin/upgrade" -Method POST -ContentType "application/json" -Body $upBody -ErrorAction Stop
    Write-Host "Upgrade status: $($r2.StatusCode)"
    Write-Host "Upgrade response: $($r2.Content)"
} catch {
    $status = [int]$_.Exception.Response.StatusCode
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host "Upgrade failed: $status"
    Write-Host "Body: $body"
}
