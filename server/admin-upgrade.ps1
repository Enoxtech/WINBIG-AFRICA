$upBody = @{ email = "admin@winbig.africa" } | ConvertTo-Json

try {
    $r2 = Invoke-WebRequest -Uri "https://backend-production-9aa6.up.railway.app/api/admin/upgrade" -Method POST -ContentType "application/json" -Body $upBody -ErrorAction Stop
    Write-Host "Upgrade status: $($r2.StatusCode)"
    Write-Host "Upgrade response: $($r2.Content)"
} catch {
    $status = [int]$_.Exception.Response.StatusCode
    Write-Host "Upgrade HTTP status: $status"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "Body: $body"
    } else {
        Write-Host "No response body"
    }
}
