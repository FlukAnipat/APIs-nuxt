<template>
  <v-container fluid class="pa-3 pa-sm-6" style="max-width:1200px">

    <!-- Header -->
    <div class="d-flex align-start justify-space-between mb-5 flex-wrap" style="gap:12px">
      <div>
        <div class="page-header mb-1">
          <h1 class="text-h5 font-weight-bold white--text">News - ข่าวทั่วไป</h1>
        </div>
        <p class="caption mb-0" style="color:#6b7280">ข่าวสดจาก Thai PBS — อัปเดตอัตโนมัติ</p>
      </div>
      <div class="d-flex align-center flex-wrap" style="gap:8px">
        <v-chip small outlined color="grey" class="font-weight-medium">
          <v-icon left x-small>mdi-newspaper</v-icon>
          {{ filteredItems.length }} ข่าว
        </v-chip>
        <v-btn small depressed color="#1f2937" :loading="loading" @click="fetchNews" style="border:1px solid #374151">
          <v-icon left small>mdi-refresh</v-icon>รีเฟรช
        </v-btn>
      </div>
    </div>

    <!-- Filter -->
    <div class="mb-5">
      <div class="caption font-weight-bold text-uppercase mb-2" style="color:#4b5563;letter-spacing:1px">
        กรองตามหมวด
      </div>
      <div class="d-flex flex-nowrap overflow-x-auto pb-1" style="gap:8px; -webkit-overflow-scrolling:touch">
        <v-chip
          small class="filter-chip font-weight-medium"
          :color="activeFilter === null ? 'primary' : ''"
          :outlined="activeFilter !== null"
          @click="setFilter(null)"
        >
          <v-icon left x-small>mdi-view-grid-outline</v-icon>
          ทั้งหมด
          <span class="ml-1" style="opacity:.7">({{ items.length }})</span>
        </v-chip>
        <v-chip
          v-for="f in filters" :key="f.key"
          small class="filter-chip font-weight-medium"
          :color="activeFilter === f.key ? f.color : ''"
          :outlined="activeFilter !== f.key"
          @click="setFilter(f.key)"
        >
          {{ f.icon }} {{ f.label }}
          <span class="ml-1" style="opacity:.7">({{ countFilter(f.keywords) }})</span>
        </v-chip>
      </div>
    </div>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col v-for="(item, idx) in pagedItems" :key="idx" cols="12" sm="6" md="4">
        <v-skeleton-loader type="image, article" dark />
      </v-col>
    </v-row>

    <!-- Error -->
    <v-alert v-else-if="error" type="error" outlined dense class="mb-4">
      <div class="d-flex align-center justify-space-between">
        <span>{{ error }}</span>
        <v-btn x-small text color="error" @click="fetchNews">ลองใหม่</v-btn>
      </div>
    </v-alert>

    <!-- Empty -->
    <v-card v-else-if="filteredItems.length === 0" color="#111827" outlined class="pa-10 text-center" style="border-color:#1f2937">
      <v-icon size="48" color="#374151">mdi-newspaper-variant-outline</v-icon>
      <p class="mt-3 mb-0" style="color:#6b7280">ไม่พบข่าวที่ตรงกับ filter นี้</p>
    </v-card>

    <!-- Cards -->
    <v-row v-else>
      <v-col v-for="(item, idx) in pagedItems" :key="idx" cols="12" sm="6" md="4">
        <v-card
          :href="item.link" target="_blank" rel="noopener"
          color="#111827" outlined
          class="news-card"
          style="text-decoration:none"
        >
          <!-- รูป -->
          <div style="position:relative; height:190px; overflow:hidden; background:#1f2937">
            <v-img v-if="item.image" :src="item.image" height="190" @error="item.image = ''">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular size="24" width="2" indeterminate color="grey" />
                </v-row>
              </template>
            </v-img>
            <div v-else class="d-flex align-center justify-center fill-height">
              <v-icon size="40" color="#374151">mdi-image-outline</v-icon>
            </div>
            <div style="position:absolute; top:10px; left:10px; display:flex; gap:5px">
              <v-chip x-small color="primary" style="font-size:9px;font-weight:700">Thai PBS</v-chip>
              <v-chip v-if="getTag(item)" x-small :color="getTagColor(item)" style="font-size:9px;font-weight:700">
                {{ getTag(item) }}
              </v-chip>
            </div>
          </div>

          <!-- Content -->
          <v-card-text class="pt-3 pb-2" style="flex:1">
            <p class="body-2 font-weight-bold white--text mb-2 clamp-2">{{ item.title }}</p>
            <p class="caption mb-0 clamp-2" style="color:#6b7280; line-height:1.6">{{ item.description }}</p>
          </v-card-text>

          <v-divider style="border-color:#1f2937" />

          <v-card-actions class="px-4 py-2">
            <span class="caption" style="color:#4b5563">
              <v-icon x-small style="color:#4b5563" class="mr-1">mdi-clock-outline</v-icon>
              {{ formatDate(item.pubDate) }}
            </span>
            <v-spacer />
            <span class="caption primary--text font-weight-bold">อ่านต่อ →</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <div v-if="!loading && !error && totalPages > 1" class="d-flex justify-center mt-8">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        color="primary"
        @input="onPageChange"
      />
    </div>

    <!-- Page info -->
    <div v-if="!loading && totalPages > 1" class="text-center mt-2">
      <span class="caption" style="color:#4b5563">
        หน้า {{ currentPage }} / {{ totalPages }}
      </span>
    </div>

  </v-container>
</template>

<script>
var API_URL = 'https://apis-nuxt-production.up.railway.app/news/flood'

var FILTERS = [
  { key: 'flood',    label: 'น้ำท่วม',    icon: '🌊', color: 'blue',
    keywords: ['น้ำท่วม','อุทกภัย','น้ำป่า','flood','น้ำหลาก','น้ำล้น'] },
  { key: 'accident', label: 'อุบัติเหตุ', icon: '🚗', color: 'amber',
    keywords: ['อุบัติเหตุ','ชน','รถคว่ำ','ไฟไหม้'] },
  { key: 'security', label: 'ความมั่นคง', icon: '🛡️', color: 'red',
    keywords: ['ยิง','ปะทะ','ระเบิด','ก่อเหตุ','จับกุม','วิสามัญ'] },
  { key: 'economy',  label: 'เศรษฐกิจ',  icon: '💰', color: 'green',
    keywords: ['ราคา','น้ำมัน','เศรษฐกิจ','ตลาด','ค่าครองชีพ'] },
]

export default {
  name: 'NewsPage',
  data: function () {
    return {
      items:        [],
      loading:      false,
      error:        null,
      activeFilter: null,
      filters:      FILTERS,
      currentPage:  1,
      perPageIndex: '12',
    }
  },
  computed: {
    perPage: function () {
      return parseInt(this.perPageIndex)
    },
    filteredItems: function () {
      var self = this
      if (!self.activeFilter) return self.items
      var f = FILTERS.find(function (f) { return f.key === self.activeFilter })
      if (!f) return self.items
      return self.items.filter(function (item) {
        return f.keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })
      })
    },
    totalPages: function () {
      return Math.ceil(this.filteredItems.length / this.perPage)
    },
    pageStart: function () {
      return (this.currentPage - 1) * this.perPage + 1
    },
    pageEnd: function () {
      return Math.min(this.currentPage * this.perPage, this.filteredItems.length)
    },
    pagedItems: function () {
      var start = (this.currentPage - 1) * this.perPage
      var end   = start + this.perPage
      return this.filteredItems.slice(start, end)
    },
  },
  mounted: function () { this.fetchNews() },
  methods: {
    fetchNews: function () {
      var self = this
      self.loading = true
      self.error   = null
      fetch(API_URL)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.json()
        })
        .then(function (data) {
          self.items       = data.items || []
          self.currentPage = 1
        })
        .catch(function (e) { self.error = e.message })
        .finally(function () { self.loading = false })
    },
    setFilter: function (key) {
      this.activeFilter = key
      this.currentPage  = 1  // reset หน้าเมื่อเปลี่ยน filter
    },
    onPageChange: function () {
      // scroll ขึ้นบนเมื่อเปลี่ยนหน้า
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    countFilter: function (keywords) {
      return this.items.filter(function (item) {
        return keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })
      }).length
    },
    getTag: function (item) {
      for (var i = 0; i < FILTERS.length; i++) {
        var f = FILTERS[i]
        if (f.keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })) return f.icon + ' ' + f.label
      }
      return null
    },
    getTagColor: function (item) {
      for (var i = 0; i < FILTERS.length; i++) {
        var f = FILTERS[i]
        if (f.keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })) return f.color
      }
      return 'grey'
    },
    formatDate: function (dateStr) {
      if (!dateStr) return ''
      var d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    },
  },
  head: function () { return { title: 'News' } }
}
</script>