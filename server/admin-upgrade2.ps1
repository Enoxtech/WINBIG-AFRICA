try {
    $r = Invoke-WebRequest -Uri "https://backend-production-9aa6.up.railway.app/health" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "Health OK: $($r.StatusCode)"
} catch {
    Write-Host "Health failed"
    Write-Host $_.Exception.GetType().FullName
    if ($_.Exception.Response) {
        Write-Host "Status: $([int]$_.Exception.Response.StatusCode)"
    }
}

Start-Sleep 1

$body = @{ email = "admin@winbig.africa" } | ConvertTo-Json
try {
    $r = Invoke-WebRequest -Uri "https://backend-production-9aa6.up.railway.app/api/admin/upgrade" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10 -ErrorAction Stop
    Write-Host "Upgrade OK: $($r.StatusCode) - $($r.Content)"
} catch {
    Write-Host "Upgrade failed"
    Write-Host $_.Exception.GetType().FullName
    if ($_.Exception.Response) {
        Write-Host "Status: $([int]$_.Exception.Response.StatusCode)"
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
    }
}
