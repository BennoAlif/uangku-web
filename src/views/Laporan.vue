<template>
  <div>
    <v-row>
      <v-col cols="12">
        <div class="text-h3">Laporan Bulanan</div>
      </v-col>
      <v-col cols="12" md="4">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="month"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="month"
              append-icon="mdi-calendar"
              background-color="white"
              outlined
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="month" type="month" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="blue" @click="menu = false">Cancel</v-btn>
            <v-btn text color="blue" @click="$refs.menu.save(month)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4" md="3" xl="2"><bar-chart /></v-col>
      <v-col cols="12" sm="8" md="9" xl="10"><list-transaksi :month="month"/></v-col>
      <!-- <v-col cols="9"><area-chart /></v-col> -->
      <!-- <v-col cols="12" md="5"><table-pengeluaran :month="month"/></v-col>
      <v-col cols="12" md="5"><table-pemasukan :month="month"/></v-col> -->
    </v-row>
  </div>
</template>

<script>
// import TablePemasukan from "../components/laporan/Pemasukan";
// import TablePengeluaran from "../components/laporan/Pengeluaran";
import BarChart from "../components/laporan/BarChart";
import AreaChart from "../components/laporan/AreaChart";
import ListTransaksi from "../components/laporan/ListTransaksi";
import { mapState } from "vuex";
export default {
  components: { ListTransaksi, BarChart, AreaChart },
  data: () => ({
    month: new Date().toISOString().substr(0, 7),
    menu: false,
  }),
};
</script>

<style></style>
