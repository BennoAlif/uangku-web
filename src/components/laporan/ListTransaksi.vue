<template>
  <v-card class="rounded-lg px-6 pb-6" outlined height="100%">
    <!-- <v-card-title>Pemasukan/Pengeluaran</v-card-title> -->
    <v-tabs
      background-color="transparent"
      color="orange accent-2"
      grow
      v-model="tab"
    >
      <v-tab>
        Pengeluaran
      </v-tab>
      <v-tab>
        Pemasukan
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <table-pengeluaran :month="month" />
      </v-tab-item>
      <v-tab-item>
        <table-pemasukan :month="month" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import TablePengeluaran from "./Pengeluaran";
import TablePemasukan from "./Pemasukan";
export default {
  props: ["month"],
  components: { TablePengeluaran, TablePemasukan },
  data: () => ({
    tab: null,
  }),
};
</script>

<style></style>
