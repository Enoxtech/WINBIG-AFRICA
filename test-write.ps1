@'
const CAMPAIGN_CATEGORIES = [
  { id: 'cars', label: 'Cars and Vehicles', emoji: '🚗', desc: 'Win your dream car - Toyota, Honda, SUVs and more!' },
  { id: 'tech', label: 'Tech and Electronics', emoji: '📱', desc: 'iPhones, MacBooks, gaming consoles, and gadgets!' },
  { id: 'cash', label: 'Cash Rewards', emoji: '💰', desc: 'Instant cash prizes - millions to be won every day!' },
  { id: 'travel', label: 'Travel and Vacation', emoji: '✈️', desc: 'Dubai, London, Miami - luxury holidays await!' },
  { id: 'property', label: 'Property and Homes', emoji: '🏠', desc: 'Win a house, land, or apartment in Nigeria!' },
  { id: 'general', label: 'General / Other', emoji: '🎯', desc: 'All other exciting prizes and giveaways!' },
];
'@ | Out-File -FilePath 'C:\Users\SkyBond\.openclaw\workspace\WINBIG AFRICA\cats.txt' -Encoding UTF8
Write-Host "Written"
