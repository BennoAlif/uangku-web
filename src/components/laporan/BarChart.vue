<template>
  <v-card class="rounded-lg px-6 pt-4" outlined>
    <v-card-title>Grafik</v-card-title>
    <VueApexCharts
      type="bar"
      height="400"
      :options="chartOptions"
      :series="[
        {
          name: 'Pengeluaran',
          data: [totalPengeluaran],
        },
        {
          name: 'Pemasukan',
          data: [totalPemasukan],
        },
      ]"
    ></VueApexCharts
  ></v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapState } from "vuex";
export default {
  components: { VueApexCharts },
  data: () => ({
    series: [
      {
        name: "Pengeluaran",
        data: [],
      },
      {
        name: "Pemasukan",
        data: [],
      },
    ],
    chartOptions: {
      chart: {
        type: "bar",
        height: 400,
        toolbar: { show: false },
      },
      colors: ["#F44336", "#4CAF50"],
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Perbandingan"],
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function(val) {
            const formatter = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 2,
            });

            return formatter.format(val);
          },
        },
      },
    },
  }),
  computed: mapState(["totalPemasukan", "totalPengeluaran"]),
};
</script>

<style></style>
