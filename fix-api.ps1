$content = Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\api.ts' -Encoding UTF8

$old = @'
export async function createCampaign(data: {
  title: string;
  description: string;
  prize_amount: number;
  ticket_price: number;
  max_tickets: number;
  end_date: string;
  image_url?: string;
  status?: string;
}) {
  const token = await getToken();
  if (!token) return { error: 'Unauthorized' };
  const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
'@

$new = @'
export async function createCampaign(data: {
  title: string;
  description: string;
  prize_amount: number;
  ticket_price: number;
  total_tickets: number;
  end_date: string;
  image_url?: string;
  status?: string;
  category?: string;
}) {
  const token = await getToken();
  if (!token) return { error: 'Unauthorized' };
  const payload = {
    title: data.title,
    description: data.description,
    image_url: data.image_url || '',
    ticket_price: data.ticket_price,
    total_tickets: data.total_tickets,
    end_date: data.end_date,
    prize_amount: data.prize_amount,
    status: 'active',
    category: data.category || 'general',
  };
  const res = await fetch(`${API_BASE}/api/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create campaign');
  }
  return res.json();
}
'@

if ($content.Contains($old)) {
    Write-Host "Found match, replacing..."
    $content = $content.Replace($old, $new)
    [System.IO.File]::WriteAllText('C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\api.ts', $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done"
} else {
    Write-Host "NOT FOUND - checking with lines..."
    $lines = $content -split "`n"
    for ($i = 308; $i -lt 330; $i++) {
        Write-Host "Line $i : $($lines[$i])"
    }
}
