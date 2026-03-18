<template>
  <v-container fluid class="pa-0" style="max-width:100%">

    <!-- Hero -->
    <div class="oil-hero">
      <div class="oil-hero-glow" />
      <v-container style="max-width:1200px; position:relative; z-index:1" class="py-8 px-6">
        <div class="d-flex align-center justify-space-between flex-wrap" style="gap:16px">
          <div class="d-flex align-center" style="gap:14px">
            <div class="hero-icon-wrap">
              <v-icon size="28" color="#f59e0b">mdi-gas-station</v-icon>
            </div>
            <div>
              <h1 class="text-h5 font-weight-bold white--text">Oil Price - ราคาน้ำมันวันนี้</h1>
              <div class="caption mt-1" style="color:#9ca3af">ราคาขายปลีก กรุงเทพฯ และปริมณฑล — หน่วย : บาท/ลิตร</div>
            </div>
          </div>
          <div class="d-flex align-center" style="gap:10px">
            <v-chip small color="#1f2937" style="border:1px solid #374151" v-if="date">
              <v-icon left x-small color="#f59e0b">mdi-calendar-today</v-icon>
              <span class="caption" style="color:#d1d5db">{{ date }}</span>
            </v-chip>
            <v-btn small depressed color="#1f2937" :loading="loading" @click="fetchData" style="border:1px solid #374151">
              <v-icon left small color="#6b7280">mdi-refresh</v-icon>
              <span class="caption" style="color:#9ca3af">รีเฟรช</span>
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container style="max-width:1200px" class="px-6 pb-10">

      <!-- Loading -->
      <v-row v-if="loading" class="mt-6">
        <v-col v-for="i in 8" :key="i" cols="6" sm="4" md="3">
          <v-skeleton-loader type="card" dark />
        </v-col>
      </v-row>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" outlined dense class="mt-6">
        {{ error }}
        <v-btn x-small text color="error" class="ml-2" @click="fetchData">ลองใหม่</v-btn>
      </v-alert>

      <template v-else-if="stations">

        <!-- Station Tabs -->
        <div class="mt-6 mb-2">
          <div class="caption font-weight-bold text-uppercase mb-3" style="color:#4b5563;letter-spacing:1px">
            เลือกปั๊มน้ำมัน
          </div>
          <div class="station-grid">
            <div
              v-for="s in availableStations" :key="s.key"
              class="station-btn"
              :class="{ 'station-btn--active': activeStation === s.key }"
              :style="activeStation === s.key ? '--sc:' + s.hex : ''"
              @click="activeStation = s.key"
            >
              <img
                :src="'/img/stations/' + s.key + '.png'"
                :alt="s.label"
                class="station-logo"
                @error="onStationImgError($event, s.key)"
                />
              <div class="station-name">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- ไม่มีข้อมูล -->
        <v-card v-if="!hasData(activeStation)" color="#111827" outlined class="pa-10 text-center mt-4" style="border-color:#1f2937">
          <v-icon size="48" color="#374151">mdi-gas-station-off</v-icon>
          <p class="mt-3 mb-0 caption" style="color:#6b7280">ไม่มีข้อมูลราคาของปั๊มนี้</p>
        </v-card>

        <!-- Fuel Cards -->
        <v-row v-else class="mt-4">
          <v-col
            v-for="(fuel, key) in getFuels(activeStation)"
            :key="key"
            cols="6" sm="4" md="3" lg="2"
          >
            <div class="fuel-card">
              <!-- Color top bar -->
              <div class="fuel-top" :style="'background:' + getFuelGradient(key)">
                <div class="fuel-icon-circle">
                  <v-icon size="22" color="white">{{ getMdiIcon(key) }}</v-icon>
                </div>
                <div class="fuel-short-name">{{ getFuelShortName(key) }}</div>
                <div class="fuel-grade" v-if="getFuelGrade(key)">{{ getFuelGrade(key) }}</div>
              </div>

              <!-- Price area -->
              <div class="fuel-bottom">
                <div class="fuel-full-name clamp-2">{{ fuel.name || formatFuelName(key) }}</div>
                <div class="fuel-price" :style="'color:' + getFuelColor(key)">
                  {{ fuel.price }}
                </div>
                <div class="fuel-unit">บาท/ลิตร</div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- หมายเหตุ -->
        <div class="d-flex align-center mt-8 caption" style="color:#374151; gap:6px">
          <v-icon x-small color="#374151">mdi-information-outline</v-icon>
          ราคาขายปลีก กรุงเทพฯ และปริมณฑล
          <v-spacer />
        </div>

      </template>
    </v-container>
  </v-container>
</template>

<script>
var OIL_API_URL = 'https://api.chnwt.dev/thai-oil-api/latest'

var STATIONS = [
  { key: 'ptt',    label: 'PTT',      color: 'amber',        hex: '#f59e0b' },
  { key: 'shell',  label: 'Shell',    color: 'red',          hex: '#ef4444' },
  { key: 'bcp',    label: 'Bangchak', color: 'blue',         hex: '#3b82f6' },
  { key: 'caltex', label: 'Caltex',   color: 'red darken-2', hex: '#dc2626' },
  { key: 'irpc',   label: 'IRPC',     color: 'purple',       hex: '#8b5cf6' },
  { key: 'pt',     label: 'PT',       color: 'green',        hex: '#22c55e' },
  { key: 'susco',  label: 'Susco',    color: 'deep-purple',  hex: '#7c3aed' },
  { key: 'pure',   label: 'Pure',     color: 'cyan',         hex: '#06b6d4' },
]

var FUEL_COLORS = {
  gasoline_95:           '#f59e0b',
  gasohol_95:            '#3b82f6',
  gasohol_91:            '#22c55e',
  gasohol_e20:           '#06b6d4',
  gasohol_e85:           '#8b5cf6',
  diesel_b7:             '#ef4444',
  premium_diesel:        '#f97316',
  premium_gasohol_95:    '#6366f1',
  premium_gasohol_97:    '#ec4899',
  vpower_gasohol_95:     '#6366f1',
  vpower_diesel:         '#f97316',
  fuelsave_diesel:       '#ef4444',
  superpower_gasohol_95: '#6366f1',
  ngv:                   '#14b8a6',
}

var FUEL_GRADIENTS = {
  gasoline_95:           ['#92400e', '#f59e0b'],
  gasohol_95:            ['#1e3a8a', '#3b82f6'],
  gasohol_91:            ['#14532d', '#22c55e'],
  gasohol_e20:           ['#164e63', '#06b6d4'],
  gasohol_e85:           ['#4c1d95', '#8b5cf6'],
  diesel_b7:             ['#7f1d1d', '#ef4444'],
  premium_diesel:        ['#7c2d12', '#f97316'],
  premium_gasohol_95:    ['#312e81', '#6366f1'],
  premium_gasohol_97:    ['#831843', '#ec4899'],
  vpower_gasohol_95:     ['#312e81', '#6366f1'],
  vpower_diesel:         ['#7c2d12', '#f97316'],
  fuelsave_diesel:       ['#7f1d1d', '#ef4444'],
  superpower_gasohol_95: ['#1e3a8a', '#6366f1'],
  ngv:                   ['#134e4a', '#14b8a6'],
}

var FUEL_SHORT = {
  gasoline_95:           'เบนซิน',
  gasohol_95:            'แก๊สโซฮอล์',
  gasohol_91:            'แก๊สโซฮอล์',
  gasohol_e20:           'แก๊สโซฮอล์',
  gasohol_e85:           'แก๊สโซฮอล์',
  diesel_b7:             'ดีเซล',
  premium_diesel:        'ดีเซล',
  premium_gasohol_95:    'พรีเมียม',
  premium_gasohol_97:    'พรีเมียม',
  vpower_gasohol_95:     'V-Power',
  vpower_diesel:         'V-Power',
  fuelsave_diesel:       'FuelSave',
  superpower_gasohol_95: 'Super',
  ngv:                   'NGV',
}

var FUEL_GRADE = {
  gasoline_95:        '95',
  gasohol_95:         '95',
  gasohol_91:         '91',
  gasohol_e20:        'E20',
  gasohol_e85:        'E85',
  diesel_b7:          'B7',
  premium_diesel:     'Hi',
  premium_gasohol_95: '95',
  premium_gasohol_97: '97',
  ngv:                'NGV',
}

var MDI_ICONS = {
  gasoline_95:           'mdi-fire',
  gasohol_95:            'mdi-lightning-bolt',
  gasohol_91:            'mdi-leaf',
  gasohol_e20:           'mdi-leaf-circle',
  gasohol_e85:           'mdi-sprout',
  diesel_b7:             'mdi-truck',
  premium_diesel:        'mdi-star-circle',
  premium_gasohol_95:    'mdi-star',
  premium_gasohol_97:    'mdi-star-shooting',
  vpower_gasohol_95:     'mdi-rocket-launch',
  vpower_diesel:         'mdi-rocket',
  fuelsave_diesel:       'mdi-shield-check',
  superpower_gasohol_95: 'mdi-flash-circle',
  ngv:                   'mdi-molecule-co2',
}

export default {
  name: 'OilPricePage',
  data: function () {
    return {
      stations:      null,
      date:          '',
      loading:       false,
      error:         null,
      activeStation: 'ptt',
      stationList:   STATIONS,
    }
  },
  computed: {
    availableStations: function () {
      var self = this
      return self.stationList.filter(function (s) { return self.hasData(s.key) })
    },
    currentStation: function () {
      var self = this
      return STATIONS.find(function (s) { return s.key === self.activeStation }) || null
    },
  },
  mounted: function () { this.fetchData() },
  methods: {
    fetchData: function () {
      var self = this
      self.loading = true
      self.error   = null
      fetch(OIL_API_URL)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.json()
        })
        .then(function (data) {
          self.stations = data.response.stations
          self.date     = data.response.date || ''
        })
        .catch(function (e) { self.error = e.message })
        .finally(function () { self.loading = false })
    },
    hasData: function (key) {
      if (!this.stations || !this.stations[key]) return false
      return Object.values(this.stations[key]).some(function (f) {
        return f.price && f.price !== ''
      })
    },
    getFuels: function (key) {
      if (!this.stations || !this.stations[key]) return {}
      var result = {}
      var fuels  = this.stations[key]
      Object.keys(fuels).forEach(function (k) {
        if (fuels[k].price && fuels[k].price !== '') result[k] = fuels[k]
      })
      return result
    },
    getFuelColor:    function (k) { return FUEL_COLORS[k]    || '#6b7280' },
    getFuelShortName: function (k) { return FUEL_SHORT[k]    || k },
    getFuelGrade:    function (k) { return FUEL_GRADE[k]     || null },
    getMdiIcon:      function (k) { return MDI_ICONS[k]      || 'mdi-gas-station' },
    getFuelGradient: function (k) {
      var g = FUEL_GRADIENTS[k] || ['#1f2937', '#374151']
      return 'linear-gradient(145deg, ' + g[0] + ', ' + g[1] + ')'
    },
    formatFuelName: function (k) { return k.replace(/_/g, ' ').toUpperCase() },
     onStationImgError: function (e, key) {
      if (!e.target.src.includes('.jpg')) {
        e.target.src = '/img/stations/' + key + '.jpg'
      } else {
        e.target.style.display = 'none'
      }
    },
  },
  head: function () { return { title: 'ราคาน้ำมัน' } }
}
</script>

<style scoped>
/* Hero */
.oil-hero {
  position: relative; background: #111827;
  border-bottom: 1px solid #1f2937; overflow: hidden;
}
.oil-hero-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 80% 50%, rgba(245,158,11,.1) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 50%, rgba(59,130,246,.06) 0%, transparent 60%);
  pointer-events: none;
}
.hero-icon-wrap {
  width: 52px; height: 52px;
  background: rgba(245,158,11,.12);
  border: 1px solid rgba(245,158,11,.25);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Station */
.station-grid {
  display: flex; flex-wrap: wrap; gap: 10px;
}
.station-btn {
  background: #111827; border: 1px solid #1f2937;
  border-radius: 12px; padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; min-width: 110px;
  transition: border-color .15s, transform .15s;
}
.station-btn:hover { border-color: #374151; transform: translateY(-1px); }
.station-btn--active { border-color: var(--sc, #f59e0b) !important; background: #1a2332 !important; }
.station-logo { height: 28px; max-width: 60px; object-fit: contain; }
.station-name { font-size: 13px; font-weight: 600; color: #9ca3af; }
.station-btn--active .station-name { color: #e5e7eb; }

/* Fuel Card */
.fuel-card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 14px;
  overflow: hidden;
  transition: transform .2s, box-shadow .2s;
  height: 100%;
}
.fuel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.4);
}

/* Top color section */
.fuel-top {
  padding: 16px 14px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  min-height: 120px;
  justify-content: center;
}
.fuel-icon-circle {
  width: 44px; height: 44px;
  background: rgba(255,255,255,.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
  margin-bottom: 4px;
}
.fuel-short-name {
  font-size: 13px;
  font-weight: 800;
  color: rgba(255,255,255,.95);
  text-align: center;
  text-shadow: 0 1px 4px rgba(0,0,0,.3);
  font-family: 'Sarabun', sans-serif;
  line-height: 1.2;
}
.fuel-grade {
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,.4);
  letter-spacing: -1px;
}

/* Bottom price section */
.fuel-bottom {
  padding: 12px 14px;
  border-top: 1px solid #1f2937;
  text-align: center;
}
.fuel-full-name {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 6px;
  line-height: 1.4;
  min-height: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fuel-price {
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}
.fuel-unit {
  font-size: 11px;
  color: #4b5563;
  margin-top: 4px;
}
</style>