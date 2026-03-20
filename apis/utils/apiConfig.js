export const API_BASE    = 'https://api-gateway.gistda.or.th/api/2.0/resources/features'
export const API_KEY     = 'OrXGljzmxFt9OJbyr5s7ZaTw8F0fRuvwTQ3VNuyEsnpMh98tzTrJzbjsd5z9nqkf'
export const API_HEADERS = { 'accept': 'application/json', 'API-Key': API_KEY }

export const MENU_LIST = [

  // ── RSS Feed ──────────────────────────────────────────
  {
    type:     'rss',
    key:      'thaipbs-region',
    label:    'News',
    icon:     '📰',
    color:    'blue',
    desc:     'ข่าวสดจาก Thai PBS',
    backend:  'http://localhost:3001/news/flood',
    page:     '/flood-news',
    filters: [
      { key: 'flood',    label: 'น้ำท่วม',    icon: '🌊', color: 'blue',
        keywords: ['น้ำท่วม','อุทกภัย','น้ำป่า','flood','น้ำหลาก','น้ำล้น'] },
      { key: 'accident', label: 'อุบัติเหตุ', icon: '🚗', color: 'amber',
        keywords: ['อุบัติเหตุ','ชน','รถคว่ำ','ไฟไหม้'] },
      { key: 'security', label: 'ความมั่นคง', icon: '🛡️', color: 'red',
        keywords: ['ยิง','ปะทะ','ระเบิด','ก่อเหตุ','จับกุม','วิสามัญ'] },
      { key: 'economy',  label: 'เศรษฐกิจ',  icon: '💰', color: 'green',
        keywords: ['ราคา','น้ำมัน','เศรษฐกิจ','ตลาด','ค่าครองชีพ'] },
    ],
  },

  // ── External API ──────────────────────────────────────
  // น้ำมัน
  {
    type:    'external',
    key:     'oil-price',
    label:   'Oil Price',
    icon:    '⛽',
    color:   'amber',
    desc:    'ราคาน้ำมันขายปลีก กรุงเทพฯ และปริมณฑล',
    url:     'https://api.chnwt.dev/thai-oil-api/latest',
    page:    '/oil-price',
  },
// ทองคำ
  {
  type:    'external',
  key:     'gold-price',
  label:   'Gold Price',
  icon:    '💰',
  color:   'amber',
  desc:    'ราคาทองคำรูปพรรณและทองแท่งประจำวัน',
  url:     'https://api.chnwt.dev/thai-gold-api/latest',
  page:    '/gold-price',
},
//สภาพอากาศ
{
  type:    'external',
  key:     'weather',
  label:   'Weather',
  icon:    '🌤️',
  color:   'blue',
  desc:    'สรุปสภาพอากาศภาพรวมประเทศไทยตอนนี้',
  url:     'https://api.open-meteo.com/v1/forecast',
  page:    '/weather',
},



]

// ── แยกตาม type ───────────────────────────────────────────
export const API_LIST      = MENU_LIST.filter(function (m) { return m.type === 'api' })
export const RSS_LIST      = MENU_LIST.filter(function (m) { return m.type === 'rss' })
export const EXTERNAL_LIST = MENU_LIST.filter(function (m) { return m.type === 'external' })

