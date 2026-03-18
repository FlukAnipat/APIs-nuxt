export const API_BASE    = 'https://api-gateway.gistda.or.th/api/2.0/resources/features'
export const API_KEY     = 'OrXGljzmxFt9OJbyr5s7ZaTw8F0fRuvwTQ3VNuyEsnpMh98tzTrJzbjsd5z9nqkf'
export const API_HEADERS = { 'accept': 'application/json', 'API-Key': API_KEY }

// เพิ่ม API หรือ RSS ใหม่แค่ตรงนี้ที่เดียว
// type: 'api' = REST API ข้อมูล GeoJSON
// type: 'rss' = RSS feed ข่าว

export const MENU_LIST = [
  {
    type:     'rss',
    key:      'thaipbs-region',
    label:    'ข่าวภูมิภาค',
    icon:     '📰',
    color:    'blue',
    desc:     'ข่าวภูมิภาคจาก Thai PBS',
    backend:  'http://localhost:3001/news/thaipbs-region',
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

]

// แยก list ตาม type เพื่อใช้ใน sidebar
export const API_LIST = MENU_LIST.filter(function (m) { return m.type === 'api' })
export const RSS_LIST = MENU_LIST.filter(function (m) { return m.type === 'rss' })