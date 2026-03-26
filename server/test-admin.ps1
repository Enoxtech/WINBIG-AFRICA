$body = '{"email":"admin@winbigafrica.com","password":"Admin@2026"}'
$resp = Invoke-WebRequest -Uri 'https://backend-production-9aa6.up.railway.app/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 15 -UseBasicParsing
$resp.Content
