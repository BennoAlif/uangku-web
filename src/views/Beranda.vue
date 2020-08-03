<template>
  <v-row>
    <v-col cols="12" md="5"><Pengeluaran /></v-col>
    <v-col cols="12" md="7"><ListTransaksi /></v-col>
  </v-row>
</template>

<script>
import Pengeluaran from "../components/beranda/Pengeluaran";
import ListTransaksi from "../components/beranda/ListTransaksi";
export default {
  components: { Pengeluaran, ListTransaksi },
};
</script>

<style></style>
