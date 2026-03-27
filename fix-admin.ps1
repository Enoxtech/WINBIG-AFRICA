$content = Get-Content -Raw 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx' -Encoding UTF8

# Fix 1: Add category to form state
$old1 = "const [form, setForm] = useState({"
$new1 = "// Campaign categories
const CAMPAIGN_CATEGORIES = [
  { id: 'cars', label: 'Cars & Vehicles', emoji: '🚗', desc: 'Win your dream car — Toyota, Honda, SUVs and more!' },
  { id: 'tech', label: 'Tech & Electronics', emoji: '📱', desc: 'iPhones, MacBooks, gaming consoles, and gadgets!' },
  { id: 'cash', label: 'Cash Rewards', emoji: '💰', desc: 'Instant cash prizes — millions to be won every day!' },
  { id: 'travel', label: 'Travel & Vacation', emoji: '✈️', desc: 'Dubai, London, Miami — luxury holidays await!' },
  { id: 'property', label: 'Property & Homes', emoji: '🏠', desc: 'Win a house, land, or apartment anywhere in Nigeria!' },
  { id: 'general', label: 'General / Other', emoji: '🎯', desc: 'All other exciting prizes and giveaways!' },
];
"
$content = $content.Replace($old1, $new1 + $old1)

# Fix 2: Add category to form state fields
$old2 = "const [form, setForm] = useState({
    title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '',
  });"
$new2 = "const [form, setForm] = useState({
    title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '', category: 'general',
  });"
$content = $content.Replace($old2, $new2)

# Fix 3: Fix handleCreate to include category and use total_tickets
$old3 = "await createCampaign({
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        ticket_price: parseFloat(form.ticket_price),
        max_tickets: parseInt(form.total_tickets),
        end_date: form.end_date,
        prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
      });"
$new3 = "await createCampaign({
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        ticket_price: parseFloat(form.ticket_price),
        total_tickets: parseInt(form.total_tickets),
        end_date: form.end_date,
        prize_amount: parseFloat(form.prize_amount) || parseFloat(form.ticket_price) * parseInt(form.total_tickets),
        category: form.category,
      });"
$content = $content.Replace($old3, $new3)

# Fix 4: Fix setForm reset to include category
$old4 = "setForm({ title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '' });"
$new4 = "setForm({ title: '', description: '', image_url: '', ticket_price: '', total_tickets: '', end_date: '', prize_amount: '', category: 'general' });"
$content = $content.Replace($old4, $new4)

[System.IO.File]::WriteAllText('C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\app\admin\page.tsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "Done - admin/page.tsx patched"
