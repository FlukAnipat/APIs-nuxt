<template>
  <v-container fluid class="pa-6" style="max-width:1100px">

    <!-- Header -->
    <div class="mb-8">
      <div class="page-header mb-2">
        <h1 class="text-h5 font-weight-bold white--text">Dashboard - APIs Explorer</h1>
      </div>
      <p class="body-2 mb-0" style="color:#6b7280">
        รวม API และแหล่งข้อมูลที่ใช้งานในโปรเจค — เลือกหมวดด้านล่างเพื่อดูข้อมูล
      </p>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold primary--text">{{ apiList.length + 1 }}</div>
          <div class="caption mt-1" style="color:#6b7280">แหล่งข้อมูล</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold success--text">{{ apiList.length }}</div>
          <div class="caption mt-1" style="color:#6b7280">REST API</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold warning--text">1</div>
          <div class="caption mt-1" style="color:#6b7280">RSS Feed</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card color="#111827" outlined class="pa-4 text-center" style="border-color:#1f2937">
          <div class="text-h4 font-weight-bold info--text">v2.0</div>
          <div class="caption mt-1" style="color:#6b7280">API Version</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- API Section -->
    <template v-if="apiList.length > 0">
      <div class="d-flex align-center mb-3" style="gap:8px">
        <span class="caption font-weight-bold text-uppercase" style="color:#4b5563;letter-spacing:1px">REST API</span>
        <v-divider style="border-color:#1f2937" />
        <v-chip x-small outlined color="grey">{{ apiList.length }}</v-chip>
      </div>
      <v-row class="mb-6">
        <v-col v-for="api in apiList" :key="api.key" cols="12" sm="6" md="4">
          <v-card
            nuxt :to="'/data/' + api.key"
            color="#111827" outlined hover
            class="api-card pa-1"
          >
            <v-card-title class="pb-1">
              <span class="mr-2" style="font-size:22px">{{ api.icon }}</span>
              <span class="body-1 font-weight-bold white--text">{{ api.label }}</span>
              <v-spacer />
              <v-chip x-small :color="api.color" outlined>GET</v-chip>
            </v-card-title>
            <v-card-subtitle class="pt-1 pb-2" style="font-size:12px">
              {{ api.desc }}
            </v-card-subtitle>
            <v-card-actions class="pt-0" style="border-top:1px solid #1f2937">
              <code class="caption" style="color:#4b5563;background:transparent">
                /features/{{ api.resource }}
              </code>
              <v-spacer />
              <v-icon small color="grey">mdi-arrow-right</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- RSS Section -->
    <div class="d-flex align-center mb-3" style="gap:8px">
      <span class="caption font-weight-bold text-uppercase" style="color:#4b5563;letter-spacing:1px">ข่าวสาร</span>
      <v-divider style="border-color:#1f2937" />
      <v-chip x-small outlined color="grey">1</v-chip>
    </div>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card nuxt to="/flood-news" color="#111827" outlined hover class="api-card pa-1">
          <v-card-title class="pb-1">
            <v-icon class="mr-2" color="orange">mdi-newspaper-variant-outline</v-icon>
            <span class="body-1 font-weight-bold white--text">ข่าวทั่วไป</span>
            <v-spacer />
            <v-chip x-small color="orange" outlined>RSS</v-chip>
          </v-card-title>
          <v-card-subtitle class="pt-1 pb-2" style="font-size:12px">
            ข่าวสดจาก Thai PBS — กรองตามหมวดหมู่
          </v-card-subtitle>
          <v-card-actions class="pt-0" style="border-top:1px solid #1f2937">
            <code class="caption" style="color:#4b5563;background:transparent">
              Thai PBS RSS
            </code>
            <v-spacer />
            <v-icon small color="grey">mdi-arrow-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { API_LIST } from '../utils/apiConfig.js'
export default {
  data: function () { return { apiList: API_LIST } },
  head: function () { return { title: 'หน้าแรก' } }
}
</script>