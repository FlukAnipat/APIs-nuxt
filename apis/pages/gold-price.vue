<template>
  <v-container fluid class="pa-0" style="max-width:100%">

    <!-- Hero -->
    <div class="gold-hero">
      <div class="gold-hero-glow" />
      <v-container style="max-width:1000px; position:relative; z-index:1" class="py-8 px-6">
        <div class="d-flex align-center justify-space-between flex-wrap" style="gap:16px">
          <div class="d-flex align-center" style="gap:14px">
            <div class="hero-icon-wrap">
              <span style="font-size:26px">💰</span>
            </div>
            <div>
              <h1 class="text-h5 font-weight-bold white--text">Gold Price - ราคาทองคำวันนี้</h1>
              <div class="caption mt-1" style="color:#9ca3af">
                ราคาซื้อ-ขาย ทองรูปพรรณ และทองแท่ง — หน่วย : บาท
              </div>
            </div>
          </div>
          <div class="d-flex align-center" style="gap:10px">
            <v-chip small color="#1f2937" style="border:1px solid #374151" v-if="updateDate">
              <v-icon left x-small color="#f59e0b">mdi-calendar-today</v-icon>
              <span class="caption" style="color:#d1d5db">{{ updateDate }}</span>
            </v-chip>
            <v-chip small color="#1f2937" style="border:1px solid #374151" v-if="updateTime">
              <v-icon left x-small color="#f59e0b">mdi-clock-outline</v-icon>
              <span class="caption" style="color:#d1d5db">{{ updateTime }}</span>
            </v-chip>
            <v-btn small depressed color="#1f2937" :loading="loading" @click="fetchData" style="border:1px solid #374151">
              <v-icon left small color="#6b7280">mdi-refresh</v-icon>
              <span class="caption" style="color:#9ca3af">รีเฟรช</span>
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container style="max-width:1000px" class="px-6 pb-10">

      <!-- Loading -->
      <v-row v-if="loading" class="mt-6">
        <v-col v-for="i in 2" :key="i" cols="12" sm="6">
          <v-skeleton-loader type="card" dark />
        </v-col>
      </v-row>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" outlined dense class="mt-6">
        {{ error }}
        <v-btn x-small text color="error" class="ml-2" @click="fetchData">ลองใหม่</v-btn>
      </v-alert>

      <template v-else-if="price">

        <!-- Gold Cards -->
        <v-row class="mt-6">

          <!-- ทองรูปพรรณ -->
          <v-col cols="12" sm="6">
            <div class="gold-card gold-card--jewelry">
              <div class="gold-card-header">
                <div class="gold-type-icon">💍</div>
                <div>
                  <div class="gold-type-title">ทองรูปพรรณ</div>
                  <div class="caption" style="color:rgba(255,255,255,.6)">Gold Jewelry 96.5%</div>
                </div>
              </div>
              <v-divider style="border-color:rgba(255,255,255,.1)" class="my-4" />
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="price-label">ราคารับซื้อ</div>
                  <div class="price-buy">{{ price.gold.buy }}</div>
                  <div class="price-unit">บาท/บาท</div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="price-label">ราคาขายออก</div>
                  <div class="price-sell">{{ price.gold.sell }}</div>
                  <div class="price-unit">บาท/บาท</div>
                </v-col>
              </v-row>
              <div class="spread-row mt-3">
                <span class="caption" style="color:rgba(255,255,255,.5)">ส่วนต่าง</span>
                <span class="spread-val">{{ getSpread(price.gold.buy, price.gold.sell) }} บาท</span>
              </div>
            </div>
          </v-col>

          <!-- ทองแท่ง -->
          <v-col cols="12" sm="6">
            <div class="gold-card gold-card--bar">
              <div class="gold-card-header">
                <div class="gold-type-icon">💰</div>
                <div>
                  <div class="gold-type-title">ทองแท่ง</div>
                  <div class="caption" style="color:rgba(255,255,255,.6)">Gold Bar 99.99%</div>
                </div>
              </div>
              <v-divider style="border-color:rgba(255,255,255,.1)" class="my-4" />
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="price-label">ราคารับซื้อ</div>
                  <div class="price-buy">{{ price.gold_bar.buy }}</div>
                  <div class="price-unit">บาท/บาท</div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="price-label">ราคาขายออก</div>
                  <div class="price-sell">{{ price.gold_bar.sell }}</div>
                  <div class="price-unit">บาท/บาท</div>
                </v-col>
              </v-row>
              <div class="spread-row mt-3">
                <span class="caption" style="color:rgba(255,255,255,.5)">ส่วนต่าง</span>
                <span class="spread-val">{{ getSpread(price.gold_bar.buy, price.gold_bar.sell) }} บาท</span>
              </div>
            </div>
          </v-col>

        </v-row>

        <!-- TradingView Chart -->
        <div class="mt-8">
          <div class="d-flex align-center mb-3" style="gap:8px">
            <span class="caption font-weight-bold text-uppercase" style="color:#4b5563;letter-spacing:1px">
              กราฟราคาทองคำโลก (XAU/USD)
            </span>
            <v-divider style="border-color:#1f2937" />
            <v-chip x-small outlined color="amber">TradingView</v-chip>
          </div>
          <div class="chart-wrap">
            <div class="tradingview-widget-container" style="width:100%;height:100%">
              <div id="tv_chart" style="width:100%;height:500px" />
            </div>
          </div>
        </div>

        <!-- หมายเหตุ -->
        <div class="d-flex align-center mt-6 caption" style="color:#374151; gap:6px">
          <v-icon x-small color="#374151">mdi-information-outline</v-icon>
          ราคาทองคำสมาคมค้าทองคำ
          <v-spacer />
          <span>ข้อมูลจาก
            <a href="https://api.chnwt.dev" target="_blank" style="color:#4b5563;text-decoration:none">api.chnwt.dev</a>
          </span>
        </div>

      </template>
    </v-container>
  </v-container>
</template>

<script>
var API_URL = 'https://api.chnwt.dev/thai-gold-api/latest'

export default {
  name: 'GoldPricePage',
  data: function () {
    return {
      price:      null,
      updateDate: '',
      updateTime: '',
      loading:    false,
      error:      null,
    }
  },
  mounted: function () {
    this.fetchData()
  },
  beforeDestroy: function () {
    var old = document.getElementById('tv-script')
    if (old) old.remove()
  },
  methods: {
    fetchData: function () {
      var self = this
      self.loading = true
      self.error   = null
      fetch(API_URL)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.json()
        })
        .then(function (data) {
          self.price      = data.response.price
          self.updateDate = data.response.update_date || ''
          self.updateTime = data.response.update_time || ''
          // โหลด chart หลังได้ price แล้ว
          self.$nextTick(function () {
            self.loadChart()
          })
        })
        .catch(function (e) { self.error = e.message })
        .finally(function () { self.loading = false })
    },

    loadChart: function () {
      var old = document.getElementById('tv-script')
      if (old) old.remove()

      var script = document.createElement('script')
      script.id  = 'tv-script'
      script.src = 'https://s3.tradingview.com/tv.js'
      script.onload = function () {
        if (typeof TradingView !== 'undefined') {
          new TradingView.widget({
            container_id:     'tv_chart',
            symbol:           'OANDA:XAUUSD',
            interval:         'D',
            timezone:         'Asia/Bangkok',
            theme:            'dark',
            style:            '1',
            locale:           'th',
            width:            '100%',
            height:           500,
            hide_top_toolbar: false,
            hide_legend:      false,
            save_image:       false,
          })
        }
      }
      document.head.appendChild(script)
    },

    getSpread: function (buy, sell) {
      var b = parseFloat(buy.replace(/,/g, ''))
      var s = parseFloat(sell.replace(/,/g, ''))
      if (isNaN(b) || isNaN(s)) return '—'
      return (s - b).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
  },
  head: function () { return { title: 'ราคาทองคำ' } }
}
</script>

<style scoped>
.gold-hero {
  position: relative; background: #111827;
  border-bottom: 1px solid #1f2937; overflow: hidden;
}
.gold-hero-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 80% 50%, rgba(245,158,11,.12) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 50%, rgba(251,191,36,.06) 0%, transparent 60%);
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
.gold-card {
  border-radius: 16px; padding: 24px;
  height: 100%; position: relative; overflow: hidden;
}
.gold-card--jewelry {
  background: linear-gradient(145deg, #78350f, #d97706);
  border: 1px solid rgba(251,191,36,.3);
}
.gold-card--bar {
  background: linear-gradient(145deg, #713f12, #ca8a04);
  border: 1px solid rgba(251,191,36,.3);
}
.gold-card::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 150px; height: 150px;
  background: rgba(255,255,255,.06); border-radius: 50%;
}
.gold-card-header { display: flex; align-items: center; gap: 14px; }
.gold-type-icon {
  width: 48px; height: 48px;
  background: rgba(255,255,255,.15); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; flex-shrink: 0;
}
.gold-type-title { font-size: 18px; font-weight: 700; color: #fff; }
.price-label {
  font-size: 11px; color: rgba(255,255,255,.6);
  margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px;
}
.price-buy  { font-size: 22px; font-weight: 800; color: #fff; line-height: 1; }
.price-sell { font-size: 22px; font-weight: 800; color: #fde68a; line-height: 1; }
.price-unit { font-size: 10px; color: rgba(255,255,255,.5); margin-top: 4px; }
.spread-row {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0,0,0,.2); border-radius: 8px; padding: 8px 12px;
}
.spread-val { font-size: 13px; font-weight: 700; color: #fde68a; }

/* Chart */
.chart-wrap {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 12px;
  overflow: hidden;
  height: 500px;
}
</style>