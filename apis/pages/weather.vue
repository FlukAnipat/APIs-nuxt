<template>
  <div class="wx-page">

    <!-- Hero -->
    <div class="wx-hero">
      <div class="hero-content">
        <div class="hero-left">
          <div class="hero-icon">🌤️</div>
          <div>
            <h1 class="hero-title">Weather - สภาพอากาศประเทศไทย</h1>
            <p class="hero-sub">ข้อมูลสภาพอากาศปัจจุบัน 77 จังหวัดทั่วไทย</p>
          </div>
        </div>
        <div class="hero-right">
          <div v-if="loaded > 0" class="progress-chip">
            <span class="dot-live" />
            {{ loaded }}/77 จังหวัด
          </div>
          <button class="refresh-btn" :disabled="loading" @click="fetchAll">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            {{ loading ? 'กำลังโหลด...' : 'รีเฟรช' }}
          </button>
        </div>
      </div>
      <div v-if="loading" class="hero-progress">
        <div class="progress-bar" :style="'width:' + progress + '%'" />
      </div>
    </div>

    <div class="wx-body">

      <!-- Summary -->
      <div v-if="results.length" class="summary-row">
        <div class="sum-card">
          <div class="sum-icon">🌡️</div>
          <div class="sum-val" :style="'color:' + getTempColor(summary.avgTemp)">{{ summary.avgTemp }}°C</div>
          <div class="sum-label">เฉลี่ยทั่วไทย</div>
        </div>
        <div class="sum-card" style="cursor:pointer" @click="flyTo(summary.hottest.name)">
          <div class="sum-icon">🔥</div>
          <div class="sum-val" style="color:#ef4444">{{ summary.hottest.temp }}°C</div>
          <div class="sum-label">ร้อนที่สุด · {{ summary.hottest.name }}</div>
        </div>
        <div class="sum-card" style="cursor:pointer" @click="flyTo(summary.coldest.name)">
          <div class="sum-icon">❄️</div>
          <div class="sum-val" style="color:#60a5fa">{{ summary.coldest.temp }}°C</div>
          <div class="sum-label">เย็นที่สุด · {{ summary.coldest.name }}</div>
        </div>
        <div class="sum-card">
          <div class="sum-icon">🌧️</div>
          <div class="sum-val" style="color:#60a5fa">{{ summary.rainy }}</div>
          <div class="sum-label">จังหวัดที่มีฝน</div>
        </div>
      </div>

      <!-- Map + Panel -->
        <div class="map-layout">

      <!-- Leaflet Map -->
      <div class="map-col">
        <div class="map-wrap">
          <div id="leaflet-map" class="leaflet-map" />
        </div>
        <!-- Legend ย้ายมาอยู่ใต้แผนที่ -->
        <div class="map-legend">
          <div v-for="l in legend" :key="l.label" class="legend-item">
            <div class="legend-dot" :style="'background:' + l.color" />
            <span>{{ l.label }}</span>
          </div>
        </div>
      </div>

        <!-- Detail Panel -->
        <div class="detail-panel">
          <div v-if="!selected" class="panel-empty">
            <div style="font-size:48px; margin-bottom:12px">🗺️</div>
            <p style="color:#6b7280; font-size:14px; margin:0; text-align:center">
              คลิกที่จังหวัดบนแผนที่<br>เพื่อดูรายละเอียดสภาพอากาศ
            </p>
          </div>

          <div v-else class="panel-detail">
            <div class="panel-header" :style="'border-color:' + getTempColor(selected.temp) + '40'">
              <div class="panel-weather-icon">{{ getWeatherIcon(selected.code) }}</div>
              <div class="panel-header-info">
                <div class="panel-province-name">{{ selected.province }}</div>
                <div class="panel-region">{{ selected.region }}</div>
              </div>
              <div class="panel-temp-big" :style="'color:' + getTempColor(selected.temp)">
                {{ selected.temp }}°C
              </div>
            </div>

            <div class="panel-badge" :style="'background:' + getTempColor(selected.temp) + '20; color:' + getTempColor(selected.temp)">
              {{ getTempDesc(selected.temp) }}
            </div>

            <div class="panel-stats">
              <div class="stat-item">
                <div class="stat-icon">☁️</div>
                <div class="stat-label">สภาพอากาศ</div>
                <div class="stat-val">{{ getWeatherDesc(selected.code) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">💨</div>
                <div class="stat-label">ความเร็วลม</div>
                <div class="stat-val">{{ selected.wind }} km/h</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🌧️</div>
                <div class="stat-label">ฝน</div>
                <div class="stat-val" :style="selected.code >= 51 ? 'color:#60a5fa' : 'color:#6b7280'">
                  {{ selected.code >= 51 ? 'มีฝน' : 'ไม่มีฝน' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🧭</div>
                <div class="stat-label">ทิศลม</div>
                <div class="stat-val">{{ getWindDir(selected.winddir) }}</div>
              </div>
            </div>

            <div class="compare-section">
              <div class="compare-label">เปรียบเทียบอุณหภูมิทั้งประเทศ</div>
              <div class="compare-bar-wrap">
                <span style="color:#60a5fa; font-size:12px">{{ summary.coldest.temp }}°</span>
                <div class="compare-bar">
                  <div class="compare-fill" :style="'width:' + getTempPercent(selected.temp) + '%; background:' + getTempColor(selected.temp)" />
                </div>
                <span style="color:#ef4444; font-size:12px">{{ summary.hottest.temp }}°</span>
              </div>
            </div>

            <div class="nearby-section">
              <div class="compare-label">จังหวัดใกล้เคียง</div>
              <div class="nearby-list">
                <div
                  v-for="nb in getNearby(selected)" :key="nb.province"
                  class="nearby-item"
                  @click="selectProvince(nb)"
                >
                  <span>{{ getWeatherIcon(nb.code) }}</span>
                  <span class="nearby-name">{{ nb.province }}</span>
                  <span :style="'color:' + getTempColor(nb.temp)">{{ nb.temp }}°C</span>
                </div>
              </div>
            </div>

            <button class="close-btn" @click="selected = null; clearHighlight()">✕ ปิด</button>
          </div>
        </div>
      </div>

      <!-- Province list -->
      <div class="list-section">
        <div class="list-header">
          <div class="search-box">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="search" type="text" placeholder="ค้นหาจังหวัด..." class="search-input" />
            <button v-if="search" @click="search=''" class="clear-btn">✕</button>
          </div>
          <div class="filter-tabs">
            <button v-for="r in regions" :key="r.key" class="filter-tab" :class="{ active: activeRegion === r.key }" @click="activeRegion = activeRegion === r.key ? null : r.key">
              {{ r.label }}
            </button>
          </div>
          <div class="sort-btns">
            <button class="sort-btn" :class="{ active: sortBy === 'temp-desc' }" @click="sortBy = 'temp-desc'">🔥 ร้อน</button>
            <button class="sort-btn" :class="{ active: sortBy === 'temp-asc' }" @click="sortBy = 'temp-asc'">❄️ เย็น</button>
            <button class="sort-btn" :class="{ active: sortBy === 'name' }" @click="sortBy = 'name'">ก-ฮ</button>
          </div>
          <span class="result-count">{{ filteredSorted.length }} จังหวัด</span>
        </div>

        <div v-if="loading && results.length === 0" class="prov-grid">
          <div v-for="i in 20" :key="i" class="prov-skeleton" />
        </div>

        <div v-else class="prov-grid">
          <div
            v-for="item in filteredSorted" :key="item.province"
            class="prov-card"
            :class="{ 'prov-card--active': selected && selected.province === item.province }"
            :style="'--pc:' + getTempColor(item.temp)"
            @click="selectProvince(item)"
          >
            <div class="prov-top">
              <span class="prov-icon">{{ getWeatherIcon(item.code) }}</span>
              <span class="prov-temp" :style="'color:' + getTempColor(item.temp)">{{ item.temp }}°</span>
            </div>
            <div class="prov-name">{{ item.province }}</div>
            <div class="prov-wind">💨 {{ item.wind }} km/h</div>
          </div>
        </div>
      </div>

      <div class="wx-footer">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        ข้อมูลจาก Open-Meteo — แผนที่จาก OpenStreetMap / Leaflet
        <a href="https://open-meteo.com" target="_blank" style="color:#4b5563; margin-left:8px">open-meteo.com</a>
      </div>

    </div>
  </div>
</template>

<script>
var PROVINCES = [
  { name: 'กรุงเทพมหานคร', region: 'ภาคกลาง',      lat: 13.75, lng: 100.52 },
  { name: 'กระบี่',        region: 'ภาคใต้',        lat: 8.09,  lng: 98.91  },
  { name: 'กาญจนบุรี',     region: 'ภาคกลาง',      lat: 14.00, lng: 99.55  },
  { name: 'กาฬสินธุ์',     region: 'ภาคอีสาน',     lat: 16.43, lng: 103.51 },
  { name: 'กำแพงเพชร',     region: 'ภาคเหนือ',     lat: 16.48, lng: 99.52  },
  { name: 'ขอนแก่น',       region: 'ภาคอีสาน',     lat: 16.44, lng: 102.83 },
  { name: 'จันทบุรี',      region: 'ภาคตะวันออก',  lat: 12.61, lng: 102.10 },
  { name: 'ฉะเชิงเทรา',    region: 'ภาคตะวันออก',  lat: 13.69, lng: 101.08 },
  { name: 'ชลบุรี',        region: 'ภาคตะวันออก',  lat: 13.36, lng: 100.99 },
  { name: 'ชัยนาท',        region: 'ภาคกลาง',      lat: 15.18, lng: 100.13 },
  { name: 'ชัยภูมิ',       region: 'ภาคอีสาน',     lat: 15.81, lng: 102.03 },
  { name: 'ชุมพร',         region: 'ภาคใต้',        lat: 10.49, lng: 99.18  },
  { name: 'เชียงราย',      region: 'ภาคเหนือ',     lat: 19.91, lng: 99.83  },
  { name: 'เชียงใหม่',     region: 'ภาคเหนือ',     lat: 18.79, lng: 98.98  },
  { name: 'ตรัง',          region: 'ภาคใต้',        lat: 7.56,  lng: 99.61  },
  { name: 'ตราด',          region: 'ภาคตะวันออก',  lat: 12.24, lng: 102.51 },
  { name: 'ตาก',           region: 'ภาคเหนือ',     lat: 16.88, lng: 99.13  },
  { name: 'นครนายก',       region: 'ภาคกลาง',      lat: 14.20, lng: 101.21 },
  { name: 'นครปฐม',        region: 'ภาคกลาง',      lat: 13.82, lng: 100.04 },
  { name: 'นครพนม',        region: 'ภาคอีสาน',     lat: 17.39, lng: 104.78 },
  { name: 'นครราชสีมา',    region: 'ภาคอีสาน',     lat: 14.97, lng: 102.10 },
  { name: 'นครศรีธรรมราช', region: 'ภาคใต้',        lat: 8.43,  lng: 99.96  },
  { name: 'นครสวรรค์',     region: 'ภาคกลาง',      lat: 15.70, lng: 100.14 },
  { name: 'นนทบุรี',       region: 'ภาคกลาง',      lat: 13.86, lng: 100.51 },
  { name: 'นราธิวาส',      region: 'ภาคใต้',        lat: 6.43,  lng: 101.82 },
  { name: 'น่าน',          region: 'ภาคเหนือ',     lat: 18.78, lng: 100.78 },
  { name: 'บึงกาฬ',        region: 'ภาคอีสาน',     lat: 18.36, lng: 103.65 },
  { name: 'บุรีรัมย์',     region: 'ภาคอีสาน',     lat: 14.99, lng: 103.11 },
  { name: 'ปทุมธานี',      region: 'ภาคกลาง',      lat: 14.02, lng: 100.52 },
  { name: 'ประจวบคีรีขันธ์', region: 'ภาคกลาง',   lat: 11.81, lng: 99.80  },
  { name: 'ปราจีนบุรี',    region: 'ภาคตะวันออก',  lat: 14.05, lng: 101.37 },
  { name: 'ปัตตานี',       region: 'ภาคใต้',        lat: 6.87,  lng: 101.25 },
  { name: 'พระนครศรีอยุธยา', region: 'ภาคกลาง',  lat: 14.35, lng: 100.56 },
  { name: 'พะเยา',         region: 'ภาคเหนือ',     lat: 19.16, lng: 99.90  },
  { name: 'พังงา',         region: 'ภาคใต้',        lat: 8.45,  lng: 98.53  },
  { name: 'พัทลุง',        region: 'ภาคใต้',        lat: 7.62,  lng: 100.07 },
  { name: 'พิจิตร',        region: 'ภาคเหนือ',     lat: 16.44, lng: 100.35 },
  { name: 'พิษณุโลก',      region: 'ภาคเหนือ',     lat: 16.82, lng: 100.27 },
  { name: 'เพชรบุรี',      region: 'ภาคกลาง',      lat: 13.11, lng: 99.94  },
  { name: 'เพชรบูรณ์',     region: 'ภาคเหนือ',     lat: 16.42, lng: 101.16 },
  { name: 'แพร่',          region: 'ภาคเหนือ',     lat: 18.14, lng: 100.14 },
  { name: 'ภูเก็ต',        region: 'ภาคใต้',        lat: 7.88,  lng: 98.39  },
  { name: 'มหาสารคาม',     region: 'ภาคอีสาน',     lat: 16.18, lng: 103.30 },
  { name: 'มุกดาหาร',      region: 'ภาคอีสาน',     lat: 16.54, lng: 104.72 },
  { name: 'แม่ฮ่องสอน',    region: 'ภาคเหนือ',     lat: 19.30, lng: 97.97  },
  { name: 'ยโสธร',         region: 'ภาคอีสาน',     lat: 15.79, lng: 104.14 },
  { name: 'ยะลา',          region: 'ภาคใต้',        lat: 6.54,  lng: 101.28 },
  { name: 'ร้อยเอ็ด',      region: 'ภาคอีสาน',     lat: 16.05, lng: 103.65 },
  { name: 'ระนอง',         region: 'ภาคใต้',        lat: 9.96,  lng: 98.63  },
  { name: 'ระยอง',         region: 'ภาคตะวันออก',  lat: 12.68, lng: 101.28 },
  { name: 'ราชบุรี',       region: 'ภาคกลาง',      lat: 13.54, lng: 99.82  },
  { name: 'ลพบุรี',        region: 'ภาคกลาง',      lat: 14.80, lng: 100.65 },
  { name: 'ลำปาง',         region: 'ภาคเหนือ',     lat: 18.29, lng: 99.49  },
  { name: 'ลำพูน',         region: 'ภาคเหนือ',     lat: 18.57, lng: 99.01  },
  { name: 'เลย',           region: 'ภาคอีสาน',     lat: 17.49, lng: 101.72 },
  { name: 'ศรีสะเกษ',      region: 'ภาคอีสาน',     lat: 15.12, lng: 104.33 },
  { name: 'สกลนคร',        region: 'ภาคอีสาน',     lat: 17.16, lng: 104.15 },
  { name: 'สงขลา',         region: 'ภาคใต้',        lat: 7.19,  lng: 100.60 },
  { name: 'สตูล',          region: 'ภาคใต้',        lat: 6.62,  lng: 100.07 },
  { name: 'สมุทรปราการ',   region: 'ภาคกลาง',      lat: 13.60, lng: 100.60 },
  { name: 'สมุทรสงคราม',   region: 'ภาคกลาง',      lat: 13.41, lng: 100.00 },
  { name: 'สมุทรสาคร',     region: 'ภาคกลาง',      lat: 13.55, lng: 100.27 },
  { name: 'สระแก้ว',       region: 'ภาคตะวันออก',  lat: 13.82, lng: 102.06 },
  { name: 'สระบุรี',       region: 'ภาคกลาง',      lat: 14.53, lng: 100.91 },
  { name: 'สิงห์บุรี',     region: 'ภาคกลาง',      lat: 14.89, lng: 100.40 },
  { name: 'สุโขทัย',       region: 'ภาคเหนือ',     lat: 17.01, lng: 99.82  },
  { name: 'สุพรรณบุรี',    region: 'ภาคกลาง',      lat: 14.47, lng: 100.12 },
  { name: 'สุราษฎร์ธานี',  region: 'ภาคใต้',        lat: 9.14,  lng: 99.33  },
  { name: 'สุรินทร์',      region: 'ภาคอีสาน',     lat: 14.88, lng: 103.49 },
  { name: 'หนองคาย',       region: 'ภาคอีสาน',     lat: 17.88, lng: 102.74 },
  { name: 'หนองบัวลำภู',   region: 'ภาคอีสาน',     lat: 17.20, lng: 102.44 },
  { name: 'อ่างทอง',       region: 'ภาคกลาง',      lat: 14.59, lng: 100.46 },
  { name: 'อำนาจเจริญ',    region: 'ภาคอีสาน',     lat: 15.86, lng: 104.63 },
  { name: 'อุดรธานี',      region: 'ภาคอีสาน',     lat: 17.41, lng: 102.79 },
  { name: 'อุตรดิตถ์',     region: 'ภาคเหนือ',     lat: 17.63, lng: 100.10 },
  { name: 'อุทัยธานี',     region: 'ภาคเหนือ',     lat: 15.38, lng: 100.02 },
  { name: 'อุบลราชธานี',   region: 'ภาคอีสาน',     lat: 15.24, lng: 104.85 },
]

var WEATHER_ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',
  45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',
  61:'🌧️',63:'🌧️',65:'🌧️',
  80:'🌦️',81:'🌧️',82:'⛈️',
  95:'⛈️',96:'⛈️',99:'⛈️',
}
var WEATHER_DESC = {
  0:'ท้องฟ้าแจ่มใส',1:'ฟ้าใสเป็นส่วนใหญ่',2:'มีเมฆบางส่วน',3:'มีเมฆมาก',
  45:'หมอกลง',48:'หมอกหนาแน่น',
  51:'ฝนปรอยเบา',53:'ฝนปรอย',55:'ฝนปรอยหนัก',
  61:'ฝนเบา',63:'ฝนปานกลาง',65:'ฝนหนัก',
  80:'ฝนตกเป็นพักๆ',81:'ฝนตกปานกลาง',82:'ฝนตกหนัก',
  95:'พายุฝนฟ้าคะนอง',96:'พายุลูกเห็บ',99:'พายุรุนแรง',
}
var WIND_DIR = ['เหนือ','NNE','NE','ENE','ตะวันออก','ESE','SE','SSE','ใต้','SSW','SW','WSW','ตะวันตก','WNW','NW','NNW']

export default {
  name: 'WeatherPage',
    data: function () {
    return {
      results:      [],
      loading:      false,
      loaded:       0,
      selected:     null,
      search:       '',
      activeRegion: null,
      sortBy:       'name',
      provinces:    PROVINCES,
      leafletMap:   null,
      markers:      {},
      regions: [
        { key: 'ภาคเหนือ',     label: '🏔️ เหนือ' },
        { key: 'ภาคอีสาน',    label: '🌾 อีสาน' },
        { key: 'ภาคกลาง',     label: '🏙️ กลาง' },
        { key: 'ภาคตะวันออก', label: '🌊 ตะวันออก' },
        { key: 'ภาคใต้',      label: '🏝️ ใต้' },
      ],
      legend: [
        { label: '≤25° เย็น',      color: '#60a5fa' },
        { label: '26-30° อบอุ่น',  color: '#22c55e' },
        { label: '31-35° ร้อน',    color: '#f59e0b' },
        { label: '36-38° ร้อนมาก', color: '#f97316' },
        { label: '≥38° ร้อนจัด',   color: '#ef4444' },
      ],
    }
  },

  // ← เพิ่ม computed กลับมา
  computed: {
    progress: function () { return Math.round(this.loaded / 77 * 100) },
    summary: function () {
      if (!this.results.length) return { avgTemp:0, hottest:{name:'',temp:0}, coldest:{name:'',temp:0}, rainy:0 }
      var temps = this.results.map(function (r) { return r.temp })
      var avg   = temps.reduce(function (a,b) { return a+b }, 0) / temps.length
      var maxT  = Math.max.apply(null, temps)
      var minT  = Math.min.apply(null, temps)
      var hot   = this.results.find(function (r) { return r.temp === maxT })
      var cold  = this.results.find(function (r) { return r.temp === minT })
      return {
        avgTemp: Math.round(avg * 10) / 10,
        hottest: { name: hot  ? hot.province  : '', temp: maxT },
        coldest: { name: cold ? cold.province : '', temp: minT },
        rainy:   this.results.filter(function (r) { return r.code >= 51 }).length,
      }
    },
    filteredSorted: function () {
      var self = this
      var list = self.results.filter(function (r) {
        return (!self.search || r.province.includes(self.search)) &&
               (!self.activeRegion || r.region === self.activeRegion)
      })
      if (self.sortBy === 'temp-desc') return list.slice().sort(function (a,b) { return b.temp-a.temp })
      if (self.sortBy === 'temp-asc')  return list.slice().sort(function (a,b) { return a.temp-b.temp })
      return list.slice().sort(function (a,b) { return a.province.localeCompare(b.province,'th') })
    },
  },

  mounted: function () {
    this.initMap()
    this.fetchAll()
  },

  beforeDestroy: function () {
    if (this.leafletMap) { this.leafletMap.remove(); this.leafletMap = null }
  },

  methods: {
    initMap: function () {
      var self = this
      if (!document.getElementById('leaflet-css')) {
        var link  = document.createElement('link')
        link.id   = 'leaflet-css'
        link.rel  = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      if (typeof window.L !== 'undefined') { self.createMap(); return }
      var script    = document.createElement('script')
      script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = function () { self.createMap() }
      document.head.appendChild(script)
    },

    createMap: function () {
    var self = this
    var L    = window.L

    self.leafletMap = L.map('leaflet-map', {
      center: [13.0, 101.5],
      zoom:   6,
      zoomControl:      true,
      attributionControl: true,
    })

    // Google Maps tile (satellite + labels)
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps',
      maxZoom: 20,
      subdomains: ['mt0','mt1','mt2','mt3'],
    }).addTo(self.leafletMap)

    self.leafletMap.setMaxBounds(
      L.latLngBounds(L.latLng(5.5, 97.5), L.latLng(20.5, 105.7))
    )
  },

    addMarker: function (item) {
      var self  = this
      var L     = window.L
      if (!self.leafletMap || !L) return
      var color = self.getTempColor(item.temp)
      var icon  = self.getWeatherIcon(item.code)
      var markerHtml =
        '<div class="wx-dot" style="background:' + color + ';box-shadow:0 0 6px ' + color + ',0 0 2px rgba(0,0,0,.8)">' +
          '<span class="wx-dot-icon">' + icon + '</span>' +
          '<span class="wx-dot-temp">' + item.temp + '°</span>' +
        '</div>'
      var customIcon = L.divIcon({
        html: markerHtml, className: '',
        iconSize: [30,30], iconAnchor: [15,15], popupAnchor: [0,-18],
      })
      var marker = L.marker([item.lat, item.lng], { icon: customIcon })
        .addTo(self.leafletMap)
        .on('click', function () { self.selectProvince(item) })
      marker.bindTooltip(
        '<b>' + item.province + '</b><br>' + icon + ' ' + item.temp + '°C · ' + self.getWeatherDesc(item.code),
        { permanent:false, direction:'top', offset:[0,-18], className:'wx-tooltip' }
      )
      self.markers[item.province] = marker
    },

    selectProvince: function (item) {
      this.selected = item
      if (this.leafletMap) this.leafletMap.flyTo([item.lat, item.lng], 9, { duration: 1 })
      this.updateMarkerHighlight(item.province)
    },

    updateMarkerHighlight: function (name) {
      Object.keys(this.markers).forEach(function (pname) {
        var el  = this.markers[pname].getElement()
        if (!el) return
        var dot = el.querySelector('.wx-dot')
        if (!dot) return
        if (pname === name) {
          dot.style.width = '42px'; dot.style.height = '42px'
          dot.style.border = '2.5px solid #fff'
          dot.style.marginLeft = '-6px'; dot.style.marginTop = '-6px'
          el.style.zIndex = '9999'
        } else {
          dot.style.width = '30px'; dot.style.height = '30px'
          dot.style.border = 'none'
          dot.style.marginLeft = '0'; dot.style.marginTop = '0'
          el.style.zIndex = ''
        }
      }.bind(this))
    },

    clearHighlight: function () {
      Object.keys(this.markers).forEach(function (pname) {
        var el  = this.markers[pname].getElement()
        if (!el) return
        var dot = el.querySelector('.wx-dot')
        if (!dot) return
        dot.style.width = '30px'; dot.style.height = '30px'
        dot.style.border = 'none'
        dot.style.marginLeft = '0'; dot.style.marginTop = '0'
        el.style.zIndex = ''
      }.bind(this))
      if (this.leafletMap) this.leafletMap.flyTo([13.0,101.5], 6, { duration:1 })
    },

    flyTo: function (name) {
      var found = this.results.find(function (r) { return r.province === name })
      if (found) this.selectProvince(found)
    },

    fetchAll: function () {
      var self      = this
      self.loading  = true
      self.results  = []
      self.loaded   = 0
      self.selected = null
      self.markers  = {}
      if (self.leafletMap) {
        self.leafletMap.eachLayer(function (layer) {
          if (layer instanceof window.L.Marker) self.leafletMap.removeLayer(layer)
        })
      }
      var batches = []
      for (var i = 0; i < PROVINCES.length; i += 8) batches.push(PROVINCES.slice(i, i+8))
      var run = function (idx) {
        if (idx >= batches.length) { self.loading = false; return }
        Promise.all(batches[idx].map(function (p) {
          return fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.lat+'&longitude='+p.lng+'&current_weather=true')
            .then(function (r) { return r.json() })
            .then(function (data) {
              var w = data.current_weather || {}
              var item = {
                province: p.name, region: p.region, lat: p.lat, lng: p.lng,
                temp:    w.temperature   || 0,
                wind:    Math.round(w.windspeed || 0),
                winddir: w.winddirection || 0,
                code:    w.weathercode   || 0,
              }
              self.results.push(item)
              self.loaded++
              self.$nextTick(function () { self.addMarker(item) })
            })
            .catch(function () { self.loaded++ })
        })).then(function () { setTimeout(function () { run(idx+1) }, 150) })
      }
      run(0)
    },

    getTempColor: function (t) {
      if (t >= 38) return '#ef4444'
      if (t >= 35) return '#f97316'
      if (t >= 30) return '#f59e0b'
      if (t >= 25) return '#22c55e'
      return '#60a5fa'
    },
    getTempDesc: function (t) {
      if (t >= 38) return '🔥 ร้อนจัด'
      if (t >= 35) return '🌡️ ร้อนมาก'
      if (t >= 30) return '☀️ ร้อน'
      if (t >= 25) return '😊 อบอุ่น'
      return '❄️ เย็นสบาย'
    },
    getTempPercent: function (t) {
      var min = this.summary.coldest.temp
      var max = this.summary.hottest.temp
      if (max === min) return 50
      return Math.round((t-min)/(max-min)*100)
    },
    getWeatherIcon: function (c) { return WEATHER_ICONS[c] || '🌡️' },
    getWeatherDesc: function (c) { return WEATHER_DESC[c]  || 'ไม่ทราบ' },
    getWindDir:     function (d) { return WIND_DIR[Math.round(d/22.5)%16] || '—' },
    getNearby: function (item) {
      return this.results.filter(function (r) {
        if (r.province === item.province) return false
        var dx = r.lng-item.lng, dy = r.lat-item.lat
        return Math.sqrt(dx*dx+dy*dy) < 1.5
      }).slice(0,4)
    },
  },

  head: function () { return { title: 'สภาพอากาศ 77 จังหวัด' } }
}
</script>

<style>
/* import CSS ที่แยกไว้ */
@import '~/assets/weather.css';

/* Marker styles (global เพราะ Leaflet inject นอก Vue scope) */
.wx-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .15s;
  line-height: 1;
  position: relative;
}
.wx-dot:hover {
  transform: scale(1.2);
  z-index: 999 !important;
}
.wx-dot-icon { font-size: 10px; }
.wx-dot-temp { font-size: 8px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.8); }

/* Tooltip สวยขึ้น */
.wx-tooltip {
  background: #0f172a !important;
  border: 1px solid #334155 !important;
  color: #f1f5f9 !important;
  font-family: 'Sarabun', sans-serif !important;
  font-size: 12px !important;
  padding: 6px 12px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,.6) !important;
  line-height: 1.6 !important;
}
.wx-tooltip::before { display: none !important; }
.wx-tooltip b { color: #38bdf8; font-size: 13px; }
.leaflet-control-attribution { background: rgba(15,23,42,.85) !important; color: #475569 !important; font-size: 10px !important; }
.leaflet-control-attribution a { color: #64748b !important; }
.leaflet-control-zoom a { background: #0f172a !important; color: #94a3b8 !important; border-color: #334155 !important; }
.leaflet-control-zoom a:hover { background: #1e293b !important; color: #f1f5f9 !important; }
</style>