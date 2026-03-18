# APIs Explorer

ระบบรวม API และ RSS Feed สำหรับแสดงข้อมูลภูมิสารสนเทศและข่าวสาร
พัฒนาด้วย Nuxt 2 + Vuetify 2 (Frontend) และ NestJS (Backend)

---

## Tech Stack

| ส่วน | Technology |
|---|---|
| Frontend | Nuxt 2, Vue 2, Vuetify 2 |
| Backend | NestJS |
| Font | Sarabun (Google Fonts) |

---

## โครงสร้างโปรเจค
```
apis/                          ← Nuxt (Frontend) port 3000
├── assets/
│   ├── global.css             ← Global styles ทั้งหมด
│   └── variables.scss         ← Vuetify SCSS variables
│
├── layouts/
│   └── default.vue            ← Layout หลัก (Sidebar + v-main)
│
├── pages/
│   ├── index.vue              ← หน้าแรก Dashboard
│   ├── flood-news.vue         ← หน้าข่าวทั่วไป (Thai PBS RSS)
│   └── data/
│       └── _key.vue           ← หน้าแสดงข้อมูล REST API (dynamic route)
│
├── utils/
│   └── apiConfig.js           ← ⭐ Config กลาง — เพิ่ม API/RSS ที่นี่ที่เดียว
│
├── nuxt.config.js
└── package.json

nestjs-backend/                ← NestJS (Backend) port 3001
└── src/
    └── news/
        ├── news.controller.ts
        ├── news.service.ts
        └── news.module.ts
```

---

## วิธีรันโปรเจค
```bash
# Frontend (Nuxt)
cd apis
npm install
npm run dev
# → http://localhost:3000

# Backend (NestJS)
cd nestjs-backend
npm install
npm run start:dev
# → http://localhost:3001
```

---

## ⭐ วิธีเพิ่ม API หรือ RSS ใหม่

### ไฟล์หลักที่ต้องแก้: `utils/apiConfig.js`

แก้ไขไฟล์นี้ที่เดียว — Sidebar, หน้าแรก, และหน้าข้อมูล จะอัปเดตอัตโนมัติ

---

### เพิ่ม REST API ใหม่

เพิ่ม object ใน `API_LIST`:
```js
// utils/apiConfig.js
export const API_LIST = [
  {
    type:        'api',          // ← ต้องเป็น 'api'
    key:         'drought',      // ← unique key, ใช้เป็น route: /data/drought
    resource:    'drought',      // ← path หลัง /features/ ของ GISTDA
    label:       'ภัยแล้ง',      // ← ชื่อที่แสดงใน sidebar และ card
    icon:        '☀️',           // ← emoji icon
    color:       'orange',       // ← Vuetify color
    desc:        'ข้อมูลพื้นที่ภัยแล้งทั่วประเทศ',
    params:      {},             // ← query params เพิ่มเติม เช่น { sort: 'asc' }
  },
]
```

จากนั้นเข้าที่ `http://localhost:3000/data/drought` ได้เลย ไม่ต้องสร้างไฟล์เพิ่ม

**Endpoint ที่เรียก:**
```
GET https://api-gateway.gistda.or.th/api/2.0/resources/features/{resource}?limit=10&offset=0
Headers: API-Key: {API_KEY}
```

---

### เพิ่ม RSS Feed ใหม่

**ขั้นตอนที่ 1 — เพิ่ม config ใน `utils/apiConfig.js`:**
```js
export const RSS_LIST = [
  {
    type:     'rss',                                    // ← ต้องเป็น 'rss'
    key:      'matichon',                               // ← unique key
    label:    'มติชน',                                  // ← ชื่อที่แสดง
    icon:     '🗞️',
    color:    'purple',
    desc:     'ข่าวสดจากมติชนออนไลน์',
    backend:  'http://localhost:3001/news/matichon',    // ← NestJS endpoint
    filters: [                                          // ← ปุ่ม filter (ใส่ [] ถ้าไม่ต้องการ)
      {
        key:      'politics',
        label:    'การเมือง',
        icon:     '🏛️',
        color:    'blue',
        keywords: ['การเมือง','รัฐบาล','นายกฯ','รัฐสภา'],
      },
    ],
  },
]
```

**ขั้นตอนที่ 2 — เพิ่ม endpoint ใน NestJS `news.controller.ts`:**
```typescript
@Get('matichon')
async getMatichonNews() {
  return this.newsService.fetchRSSAndReturn('https://www.matichon.co.th/feed');
}
```

**ขั้นตอนที่ 3 — เพิ่ม method ใน NestJS `news.service.ts`:**
```typescript
async fetchRSSAndReturn(rssUrl: string) {
  const res  = await fetch(rssUrl);
  const xml  = await res.text();
  const items = this.parseRSS(xml);
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return { total: items.length, items };
}
```

จากนั้นเข้าที่ `http://localhost:3000/news/matichon` ได้เลย

---

## API Headers
```
Authorization: Bearer {API_KEY}
API-Key: {API_KEY}
accept: application/json
```

## Response Format (GISTDA)
```json
{
  "features": [
    {
      "id": "...",
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      },
      "properties": {
        "name": "...",
        "province": "...",
        ...
      }
    }
  ]
}
```

---

## รายการ API/RSS ปัจจุบัน

| ชื่อ | ประเภท | Source | Route |
|---|---|---|---|
| ข่าวทั่วไป | RSS | Thai PBS | `/flood-news` |

---

## ทีมพัฒนา

โปรเจคนี้พัฒนาโดยทีม 2 คน
อยากเพิ่ม API ใหม่ → แก้แค่ `utils/apiConfig.js` และ NestJS controller