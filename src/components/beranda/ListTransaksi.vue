<template>
  <v-card class="rounded-lg px-6 pb-6" outlined height="100%">
    <v-card-title class="text-subtitle-1 text-sm-h5"
      >Pemasukan/Pengeluaran hari ini</v-card-title
    >
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
        <table-pengeluaran />
      </v-tab-item>
      <v-tab-item>
        <table-pemasukan />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import TablePengeluaran from "./tables/Pengeluaran";
import TablePemasukan from "./tables/Pemasukan";
export default {
  components: { TablePengeluaran, TablePemasukan },
  data: () => ({
    tab: null,
  }),
};
</script>

<style></style>
