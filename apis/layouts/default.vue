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

        <!-- ── ภาพรวม ── -->
        <v-subheader v-if="!mini" class="caption font-weight-bold px-2" style="color:#4b5563;height:24px;letter-spacing:1px">
          ภาพรวม
        </v-subheader>

        <v-tooltip right :disabled="!mini">
          <template v-slot:activator="{ on }">
            <v-list-item nuxt to="/" exact active-class="v-list-item--active" class="rounded-lg mb-1" v-on="on">
              <v-list-item-icon class="mr-3">
                <v-icon size="18">mdi-view-dashboard-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="body-2">Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>หน้าแรก</span>
        </v-tooltip>

        <v-divider class="my-2" style="border-color:#1f2937" />

        <!-- ── API Data ── -->
        <template v-if="apiList.length > 0">
          <v-subheader v-if="!mini" class="caption font-weight-bold px-2" style="color:#4b5563;height:24px;letter-spacing:1px">
            API Data
          </v-subheader>

          <v-tooltip
            v-for="api in apiList"
            :key="api.key"
            right :disabled="!mini"
          >
            <template v-slot:activator="{ on }">
              <v-list-item
                nuxt :to="'/data/' + api.key"
                active-class="v-list-item--active"
                class="rounded-lg mb-1"
                v-on="on"
              >
                <v-list-item-icon class="mr-3" style="align-items:center">
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
            <span>{{ api.label }}</span>
          </v-tooltip>

          <v-divider class="my-2" style="border-color:#1f2937" />
        </template>

        <!-- ── ข่าวสาร ── -->
        <v-subheader v-if="!mini" class="caption font-weight-bold px-2" style="color:#4b5563;height:24px;letter-spacing:1px">
          ข่าวสาร
        </v-subheader>

        <v-tooltip right :disabled="!mini">
          <template v-slot:activator="{ on }">
            <v-list-item
              nuxt to="/flood-news"
              active-class="v-list-item--active"
              class="rounded-lg mb-1"
              v-on="on"
            >
              <v-list-item-icon class="mr-3">
                <v-icon size="18">mdi-newspaper-variant-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="body-2">News</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="!mini">
                <v-chip x-small color="orange" outlined style="font-size:9px">RSS</v-chip>
              </v-list-item-action>
            </v-list-item>
          </template>
          <span>ข่าวทั่วไป</span>
        </v-tooltip>

      </v-list>
     <!-- ── ข้อมูลทั่วไป ── -->
    <template v-if="externalList.length > 0">
      <v-divider class="my-2" style="border-color:#1f2937" />

      <v-subheader v-if="!mini" class="caption font-weight-bold px-2" style="color:#4b5563;height:24px;letter-spacing:1px">
        ข้อมูลทั่วไป
      </v-subheader>

      <v-tooltip
        v-for="item in externalList"
        :key="item.key"
        right :disabled="!mini"
      >
        <template v-slot:activator="{ on }">
          <v-list-item
            nuxt :to="item.page"
            active-class="v-list-item--active"
            class="rounded-lg mb-1"
            v-on="on"
          >
            <v-list-item-icon class="mr-3" style="align-items:center">
              <span style="font-size:17px;line-height:1">{{ item.icon }}</span>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-2">{{ item.label }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="!mini">
              <v-chip x-small :color="item.color" outlined style="font-size:9px">API</v-chip>
            </v-list-item-action>
          </v-list-item>
        </template>
        <span>{{ item.label }}</span>
      </v-tooltip>
    </template>

      <!-- Toggle -->
      <template v-slot:append>
        <div style="border-top:1px solid #1f2937">
          <v-list dense>
            <v-tooltip right :disabled="!mini">
              <template v-slot:activator="{ on }">
                <v-list-item @click="mini = !mini" class="rounded-lg" v-on="on">
                  <v-list-item-icon class="mr-3">
                    <v-icon size="18">{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="caption" style="color:#4b5563">ย่อ Sidebar</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>ขยาย Sidebar</span>
            </v-tooltip>
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
  import { API_LIST, RSS_LIST, EXTERNAL_LIST } from '../utils/apiConfig.js'
  export default {
    data: function () {
      return {
        drawer:       true,
        mini:         false,
        apiList:      API_LIST,
        rssList:      RSS_LIST,
        externalList: EXTERNAL_LIST,
      }
    }
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter, .fade-leave-to { opacity: 0; }
</style>