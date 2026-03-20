<template>
  <v-container fluid class="pa-3 pa-sm-6" style="max-width:1100px">

    <div class="mb-8">
      <div class="page-header mb-2">
        <h1 class="text-h5 font-weight-bold white--text">APIs Explorer</h1>
      </div>
      <p class="body-2 mb-0" style="color:#6b7280">
        รวม API และแหล่งข้อมูลที่ใช้งานในโปรเจค — เลือกหมวดด้านล่างเพื่อดูข้อมูล
      </p>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="3" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold primary--text">{{ totalCount }}</div>
          <div class="caption mt-1" style="color:#6b7280">แหล่งข้อมูลทั้งหมด</div>
        </v-card>
      </v-col>
      <v-col cols="3" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold success--text">{{ apiList.length }}</div>
          <div class="caption mt-1" style="color:#6b7280">REST API</div>
        </v-card>
      </v-col>
      <v-col cols="3" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold warning--text">{{ rssList.length }}</div>
          <div class="caption mt-1" style="color:#6b7280">RSS Feed</div>
        </v-card>
      </v-col>
      <v-col cols="3" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold info--text">{{ externalList.length }}</div>
          <div class="caption mt-1" style="color:#6b7280">External API</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- REST API -->
    <template v-if="apiList.length > 0">
      <div class="d-flex align-center mb-3" style="gap:8px">
        <span class="caption font-weight-bold text-uppercase" style="color:#4b5563;letter-spacing:1px">REST API</span>
        <v-divider style="border-color:#1f2937" />
        <v-chip x-small outlined color="grey">{{ apiList.length }}</v-chip>
      </div>
      <v-row class="mb-6">
        <v-col v-for="item in apiList" :key="item.key" cols="12" sm="6" md="4">
          <v-card nuxt :to="'/data/' + item.key" color="#111827" outlined hover class="api-card pa-1">
            <v-card-title class="pb-1">
              <span class="mr-2" style="font-size:22px">{{ item.icon }}</span>
              <span class="body-1 font-weight-bold white--text">{{ item.label }}</span>
              <v-spacer />
              <v-chip x-small :color="item.color" outlined>GET</v-chip>
            </v-card-title>
            <v-card-subtitle class="pt-1 pb-2" style="font-size:12px">{{ item.desc }}</v-card-subtitle>
            <v-card-actions class="pt-0" style="border-top:1px solid #1f2937">
              <code class="caption" style="color:#4b5563;background:transparent">/features/{{ item.resource }}</code>
              <v-spacer />
              <v-icon small color="grey">mdi-arrow-right</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- External API -->
    <template v-if="externalList.length > 0">
      <div class="d-flex align-center mb-3" style="gap:8px">
        <span class="caption font-weight-bold text-uppercase" style="color:#4b5563;letter-spacing:1px">External API</span>
        <v-divider style="border-color:#1f2937" />
        <v-chip x-small outlined color="grey">{{ externalList.length }}</v-chip>
      </div>
      <v-row class="mb-6">
        <v-col v-for="item in externalList" :key="item.key" cols="12" sm="6" md="4">
          <v-card nuxt :to="item.page" color="#111827" outlined hover class="api-card pa-1">
            <v-card-title class="pb-1">
              <span class="mr-2" style="font-size:22px">{{ item.icon }}</span>
              <span class="body-1 font-weight-bold white--text">{{ item.label }}</span>
              <v-spacer />
              <v-chip x-small :color="item.color" outlined>GET</v-chip>
            </v-card-title>
            <v-card-subtitle class="pt-1 pb-2" style="font-size:12px">{{ item.desc }}</v-card-subtitle>
            <v-card-actions class="pt-0" style="border-top:1px solid #1f2937">
              <code class="caption" style="color:#4b5563;background:transparent">{{ item.url }}</code>
              <v-spacer />
              <v-icon small color="grey">mdi-arrow-right</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- RSS -->
    <template v-if="rssList.length > 0">
      <div class="d-flex align-center mb-3" style="gap:8px">
        <span class="caption font-weight-bold text-uppercase" style="color:#4b5563;letter-spacing:1px">ข่าวสาร</span>
        <v-divider style="border-color:#1f2937" />
        <v-chip x-small outlined color="grey">{{ rssList.length }}</v-chip>
      </div>
      <v-row>
        <v-col v-for="item in rssList" :key="item.key" cols="12" sm="6" md="4">
          <v-card nuxt :to="item.page" color="#111827" outlined hover class="api-card pa-1">
            <v-card-title class="pb-1">
              <span class="mr-2" style="font-size:22px">{{ item.icon }}</span>
              <span class="body-1 font-weight-bold white--text">{{ item.label }}</span>
              <v-spacer />
              <v-chip x-small :color="item.color" outlined>RSS</v-chip>
            </v-card-title>
            <v-card-subtitle class="pt-1 pb-2" style="font-size:12px">{{ item.desc }}</v-card-subtitle>
            <v-card-actions class="pt-0" style="border-top:1px solid #1f2937">
              <code class="caption" style="color:#4b5563;background:transparent">{{ item.backend }}</code>
              <v-spacer />
              <v-icon small color="grey">mdi-arrow-right</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

  </v-container>
</template>

<script>
import { API_LIST, RSS_LIST, EXTERNAL_LIST } from '../utils/apiConfig.js'

export default {
  name: 'DashboardPage',
  data: function () {
    return {
      apiList:      API_LIST,
      rssList:      RSS_LIST,
      externalList: EXTERNAL_LIST,
    }
  },
  computed: {
    totalCount: function () {
      return this.apiList.length + this.rssList.length + this.externalList.length
    }
  },
  head: function () { return { title: 'หน้าแรก' } }
}
</script>