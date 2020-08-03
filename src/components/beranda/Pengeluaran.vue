<template>
  <v-card class="rounded-lg px-6 pb-6" outlined height="100%">
    <v-card-title class="text-subtitle-1 text-sm-h5">Tambah Pengeluaran/Pemasukan</v-card-title>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-radio-group v-model="jenis" row>
              <v-radio
                label="Pengeluaran"
                color="red"
                value="pengeluaran"
              ></v-radio>
              <v-radio
                label="Pemasukan"
                color="green"
                value="pemasukan"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="2"><span class="text-h6 text-sm-h2">Rp</span></v-col>
          <v-col cols="10">
            <v-text-field
              type="number"
              class="text-h4"
              height="40px"
              label="Nominal"
              name="nominal"
              v-model="nominal"
              :rules="rules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  append-icon="mdi-calendar"
                  background-color="white"
                  readonly
                  v-bind="attrs"
                  :rules="rules"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="blue" @click="menu = false">Cancel</v-btn>
                <v-btn text color="blue" @click="$refs.menu.save(date)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              :items="kategori"
              item-text="nama"
              name="kategori"
              label="Kategori"
              v-model="namaKategori"
              :rules="rules"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-textarea
              name="catatan"
              v-model="catatan"
              label="Catatan"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!valid"
          block
          color="orange"
          depressed
          class="white--text"
          @click="validate"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { db } from "../../firebase";
export default {
  data: () => ({
    valid: true,
    jenis: "pengeluaran",
    date: new Date().toISOString().substr(0, 10),
    rules: [(v) => !!v || "Tidak boleh kosong"],
    menu: false,
    nominal: null,
    namaKategori: "",
    catatan: "",
  }),
  computed: mapState(["kategori", "user"]),
  methods: {
    validate() {
      const userRef = db.collection("users").doc(this.user.uid);
      if (this.$refs.form.validate()) {
        userRef
          .collection(this.jenis)
          .add({
            nominal: parseFloat(this.nominal),
            kategori: this.namaKategori,
            tanggal: this.date,
            bulan: this.date.substr(0, 7),
            catatan: this.catatan == "" ? "-" : this.catatan,
          })
          .then(() => {
            this.$store.commit("setSnackbar", true);
            this.$store.commit("setAlertType", "success");
            this.$store.commit("setAlertMsg", "Berhasil menyimpan data");
            this.nominal = "";
            this.namaKategori = "";
            this.catatan = "";
            this.$refs.form.resetValidation();
          })
          .catch((err) => {
            this.$store.commit("setSnackbar", true);
            this.$store.commit("setAlertType", "error");
            this.$store.commit("setAlertMsg", err.message);
          });
      }
    },
  },
};
</script>

<style></style>
