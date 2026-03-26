$headers = @{
    "Authorization" = "Bearer Z7LQmWXpMHVYCFIblxJouy9D"
    "Content-Type" = "application/json"
}
$body = @{
    key = "NEXT_PUBLIC_API_URL"
    value = "https://backend-production-9aa6.up.railway.app"
    type = "encrypted"
    target = @("production")
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/WinBig-AFRICA/env" -Method Post -Headers $headers -Body $body | ConvertTo-Json
