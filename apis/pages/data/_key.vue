<template>
  <v-container fluid class="pa-6">

    <!-- Not found -->
    <div v-if="!feed">
      <v-alert type="error" outlined>ไม่พบ feed: {{ $route.params.key }}</v-alert>
      <v-btn nuxt to="/" text color="primary" class="mt-2">← กลับหน้าแรก</v-btn>
    </div>

    <template v-else>

      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap" style="gap:12px">
        <div class="d-flex align-center" style="gap:12px">
          <span style="font-size:32px">{{ feed.icon }}</span>
          <div>
            <h1 class="text-h5 font-weight-bold white--text">{{ feed.label }}</h1>
            <p class="caption grey--text mb-0">{{ feed.desc }}</p>
          </div>
        </div>
        <div class="d-flex align-center" style="gap:8px">
          <v-chip small outlined color="grey">{{ filteredItems.length }} ข่าว</v-chip>
          <v-btn small outlined color="grey" :loading="loading" @click="fetchNews">
            <v-icon left small>mdi-refresh</v-icon>รีเฟรช
          </v-btn>
        </div>
      </div>

      <!-- Filter chips -->
      <div v-if="feed.filters && feed.filters.length" class="mb-5 d-flex flex-wrap" style="gap:8px">
        <v-chip
          small
          :outlined="activeFilter !== null"
          :color="activeFilter === null ? 'primary' : 'grey'"
          @click="activeFilter = null"
        >
          ทั้งหมด ({{ items.length }})
        </v-chip>
        <v-chip
          v-for="f in feed.filters"
          :key="f.key"
          small
          :outlined="activeFilter !== f.key"
          :color="activeFilter === f.key ? f.color : 'grey'"
          @click="activeFilter = activeFilter === f.key ? null : f.key"
        >
          {{ f.icon }} {{ f.label }} ({{ countFilter(f) }})
        </v-chip>
      </div>

      <!-- Loading -->
      <v-row v-if="loading">
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
          <v-skeleton-loader type="card" dark />
        </v-col>
      </v-row>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" outlined>
        {{ error }}
        <v-btn small text color="error" class="ml-2" @click="fetchNews">ลองใหม่</v-btn>
      </v-alert>

      <!-- Empty -->
      <v-card v-else-if="filteredItems.length === 0" dark color="#111827" outlined class="pa-8 text-center">
        <v-icon large color="grey">mdi-newspaper-variant-outline</v-icon>
        <p class="grey--text mt-3">ไม่พบข่าวที่ตรงกับ filter นี้</p>
      </v-card>

      <!-- Cards -->
      <v-row v-else>
        <v-col v-for="(item, idx) in filteredItems" :key="idx" cols="12" sm="6" md="4">
          <v-card
            dark color="#111827" outlined hover
            :href="item.link" target="_blank"
            style="border-color:#1f2937; text-decoration:none; height:100%; display:flex; flex-direction:column"
          >
            <v-img v-if="item.image" :src="item.image" height="180" @error="item.image = ''">
              <template v-slot:placeholder>
                <v-row class="fill-height" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey" />
                </v-row>
              </template>
              <div class="d-flex align-start pa-2" style="gap:6px">
                <v-chip x-small :color="feed.color">{{ feed.label }}</v-chip>
                <v-chip v-if="getTag(item)" x-small :color="getTagColor(item)">
                  {{ getTag(item) }}
                </v-chip>
              </div>
            </v-img>
            <div v-else class="d-flex align-center justify-center grey darken-4" style="height:180px">
              <v-icon large color="grey">mdi-newspaper</v-icon>
            </div>

            <v-card-title class="body-1 font-weight-bold" style="line-height:1.4; word-break:break-word">
              {{ item.title }}
            </v-card-title>
            <v-card-text class="caption grey--text" style="flex:1">
              {{ item.description }}
            </v-card-text>
            <v-card-actions style="border-top:1px solid #1f2937">
              <span class="caption grey--text">{{ formatDate(item.pubDate) }}</span>
              <v-spacer />
              <span class="caption primary--text font-weight-bold">อ่านต่อ →</span>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

    </template>
  </v-container>
</template>

<script>
import { RSS_LIST } from '../../utils/apiConfig.js'

export default {
  name: 'NewsPage',
  data: function () {
    return {
      items:        [],
      loading:      false,
      error:        null,
      activeFilter: null,
    }
  },
  computed: {
    feed: function () {
      return RSS_LIST.find(function (r) {
        return r.key === this.$route.params.key
      }.bind(this)) || null
    },
    filteredItems: function () {
      var self = this
      if (!self.activeFilter || !self.feed) return self.items
      var f = self.feed.filters.find(function (f) { return f.key === self.activeFilter })
      if (!f) return self.items
      return self.items.filter(function (item) {
        return f.keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })
      })
    }
  },
  watch: {
    '$route.params.key': function () {
      this.activeFilter = null
      this.fetchNews()
    }
  },
  mounted: function () { this.fetchNews() },
  methods: {
    fetchNews: function () {
      var self = this
      if (!self.feed) return
      self.loading = true
      self.error   = null
      fetch(self.feed.backend)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status)
          return r.json()
        })
        .then(function (data) { self.items = data.items || [] })
        .catch(function (e) { self.error = e.message })
        .finally(function () { self.loading = false })
    },
    countFilter: function (f) {
      return this.items.filter(function (item) {
        return f.keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })
      }).length
    },
    getTag: function (item) {
      if (!this.feed || !this.feed.filters) return null
      for (var i = 0; i < this.feed.filters.length; i++) {
        var f = this.feed.filters[i]
        if (f.keywords.some(function (kw) {
          return item.title.includes(kw) || item.description.includes(kw)
        })) return f.icon + ' ' + f.label
      }
      return null
    },
    getTagColor: function (item) {
      if (!this.feed || !this.feed.filters) return 'grey'
      for (var i = 0; i < this.feed.filters.length; i++) {
        var f = this.feed.filters[i]
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
  head: function () {
    return { title: (this.feed ? this.feed.label : 'ข่าว') + ' | GEO Data' }
  }
}
</script>