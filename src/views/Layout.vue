<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link to="beranda">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Beranda</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="laporan">
          <v-list-item-action>
            <v-icon>mdi-file-chart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Laporan</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="kategori">
          <v-list-item-action>
            <v-icon>mdi-shape</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Kategori</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="orange accent-2" dark clipped-left flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>UANGKU</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- {{ user.email }} -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon large v-bind="attrs" v-on="on" @click="logout">
            <v-icon>mdi-power</v-icon>
          </v-btn>
        </template>
        <span>Keluar</span>
      </v-tooltip>
    </v-app-bar>

    <v-main class="grey lighten-5">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-snackbar v-model="snackbar" :color="alertType">
      {{ alertMsg }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          tutup
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { auth } from "../firebase/index";
import { mapState } from "vuex";

export default {
  data: () => ({
    drawer: null,
  }),
  computed: {
    ...mapState(["user", "snackbar", "alertMsg", "alertType"]),
    snackbar: {
      get() {
        return this.$store.state.snackbar;
      },
      set(val) {
        this.$store.commit("setSnackbar", val);
      },
    },
  },
  created() {
    this.$store.dispatch("onAuth");
  },
  mounted() {
    this.$store.dispatch("getKategori");
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
