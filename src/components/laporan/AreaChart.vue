<template>
  <v-card class="rounded-lg px-6 pt-4" outlined>
    <VueApexCharts
      ref="realtimeChart"
      type="area"
      height="400"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </v-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { mapState } from "vuex";
export default {
  components: { VueApexCharts },
  data: () => ({
    series: [
      {
        name: "Pemasukan",
        data: [],
      },
      {
        name: "Pengeluaran",
        data: [],
      },
    ],
    chartOptions: {
      chart: {
        height: 400,
        type: "area",
      },
      colors: ["#4CAF50", "#F44336"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: [],
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
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  }),
  computed: {
    ...mapState(["dataPemasukan", "dataPengeluaran"]),
    getKeys() {
      let masukKeys = Object.keys(this.groupBy(this.dataPemasukan, "tanggal"));
      let keluarKeys = Object.keys(
        this.groupBy(this.dataPengeluaran, "tanggal")
      );
      if (masukKeys.length >= keluarKeys.length) {
        return masukKeys;
      } else {
        return keluarKeys;
      }
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      this.chartOptions = {
        xaxis: {
          categories: this.getKeys,
        },
      };
      let data = this.groupBy(this.dataPemasukan, "tanggal");

      for (const key in data) {
        let pemasukan = this.totalPemasukan(data[key]);
        this.series[0].data.push(pemasukan);
      }

      let dataPengeluaran = this.groupBy(this.dataPengeluaran, "tanggal");
      for (const key in dataPengeluaran) {
        let pengeluaran = this.totalPemasukan(dataPengeluaran[key]);
        this.series[1].data.push(pengeluaran);
      }
      this.$refs.realtimeChart.updateSeries(
        [{ data: this.series[0].data }, { data: this.series[1].data }],
        false,
        true
      );
    },
    groupBy(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    totalPemasukan(data) {
      return data.reduce(function(prev, cur) {
        return prev + cur.nominal;
      }, 0);

      return 0;
    },
  },
};
</script>

<style></style>
