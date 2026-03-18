<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      permanent
      app
      width="230"
      color="#111827"
    >
      <!-- Logo -->
      <div class="d-flex align-center px-4 py-3" style="border-bottom:1px solid #1f2937; min-height:60px">
        <v-avatar size="38" class="flex-shrink-0">
          <v-img src="/img/icon.jpg" alt="APIs" />
        </v-avatar>
        <transition name="fade">
          <div v-if="!mini" class="ml-3">
            <div class="white--text font-weight-bold" style="font-size:15px;line-height:1.2">APIs</div>
            <div class="caption" style="color:#4b5563">Open Data Explorer</div>
          </div>
        </transition>
      </div>

      <v-list dense nav class="px-2 mt-2">
        <!-- หน้าแรก -->
        <v-subheader v-if="!mini" class="caption font-weight-bold px-2" style="color:#4b5563;height:28px">
          GENERAL
        </v-subheader>

        <v-list-item nuxt to="/" exact active-class="v-list-item--active" class="rounded-lg mb-1">
          <v-list-item-icon class="mr-3">
            <v-icon size="18">mdi-view-dashboard-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="body-2">หน้าแรก</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- API Data -->
        <template v-if="apiList.length > 0">
          <v-subheader v-if="!mini" class="caption font-weight-bold px-2 mt-2" style="color:#4b5563;height:28px">
            API DATA
          </v-subheader>
          <v-list-item
            v-for="api in apiList" :key="api.key"
            nuxt :to="'/data/' + api.key"
            active-class="v-list-item--active"
            class="rounded-lg mb-1"
          >
            <v-list-item-icon class="mr-3">
              <span style="font-size:17px;line-height:1">{{ api.icon }}</span>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-2">{{ api.label }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="!mini">
              <v-chip x-small :color="api.color" outlined style="font-size:9px">GET</v-chip>
            </v-list-item-action>
          </v-list-item>
        </template>

        <!-- ข่าวสาร -->
        <v-subheader v-if="!mini" class="caption font-weight-bold px-2 mt-2" style="color:#4b5563;height:28px">
          ข่าวสาร
        </v-subheader>
        <v-list-item
          nuxt to="/flood-news"
          active-class="v-list-item--active"
          class="rounded-lg mb-1"
        >
          <v-list-item-icon class="mr-3">
            <v-icon size="18">mdi-newspaper-variant-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="body-2">ข่าวทั่วไป</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="!mini">
            <v-chip x-small color="orange" outlined style="font-size:9px">RSS</v-chip>
          </v-list-item-action>
        </v-list-item>

      </v-list>

      <!-- Footer toggle -->
      <template v-slot:append>
        <div style="border-top:1px solid #1f2937">
          <v-list dense>
            <v-list-item @click="mini = !mini" class="rounded-lg">
              <v-list-item-icon class="mr-3">
                <v-icon size="18">{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="caption" style="color:#4b5563">ย่อ Sidebar</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main style="background:#0a0e17">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { API_LIST } from '../utils/apiConfig.js'
export default {
  data: function () {
    return {
      drawer:  true,
      mini:    false,
      apiList: API_LIST,
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>