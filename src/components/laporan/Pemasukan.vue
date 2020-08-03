<template>
  <div>

    <h1>
      Total :
      <span class="green--text">{{ rupiahFormat(totalPemasukan) }}</span>
    </h1>

    <v-data-table
      :headers="headers"
      :items="pemasukan"
      :sort-desc="true"
      sort-by="tanggal"
      class="elevation-0"
    >
      <template v-slot:item.nominal="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
              class="d-inline-block text-truncate"
              style="max-width: 120px;"
              >{{ rupiahFormat(item.nominal) }}</span
            >
          </template>
          <span>{{ rupiahFormat(item.nominal) }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.kategori="{ item }">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            class="d-inline-block text-truncate"
            style="max-width: 160px;"
            >{{ item.kategori }}</span
          >
        </template>
        <span>{{ item.kategori }}</span>
      </v-tooltip>
    </template>
      <template v-slot:item.catatan="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
              class="d-inline-block text-truncate"
              style="max-width: 240px;"
              >{{ item.catatan }}</span
            >
          </template>
          <span>{{ item.catatan }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.catatan="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
              class="d-inline-block text-truncate"
              style="max-width: 240px;"
              >{{ item.catatan }}</span
            >
          </template>
          <span>{{ item.catatan }}</span>
        </v-tooltip>
      </template>
      <template v-slot:top>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit data</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-text-field
                  v-model="editedItem.nominal"
                  label="Nominal (Rp)"
                  :rules="rules"
                ></v-text-field>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="editedItem.tanggal"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.tanggal"
                      append-icon="mdi-calendar"
                      background-color="white"
                      readonly
                      v-bind="attrs"
                      :rules="rules"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.tanggal"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="blue" @click="menu = false"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      color="blue"
                      @click="$refs.menu.save(editedItem.tanggal)"
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
                <v-autocomplete
                  :items="kategori"
                  item-text="nama"
                  name="kategori"
                  label="Kategori"
                  v-model="editedItem.kategori"
                  :rules="rules"
                ></v-autocomplete>
                <v-textarea
                  name="catatan"
                  v-model="editedItem.catatan"
                  label="Catatan"
                ></v-textarea>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        There is no data to show
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { db } from "../../firebase";
export default {
  props: ["month"],
  data: () => ({
    dialog: false,
    loading: false,
    tanggal: new Date().toISOString().substr(0, 10),
    rules: [(v) => !!v || "Tidak boleh kosong"],
    menu: false,

    headers: [
      { text: "Tanggal", value: "tanggal" },
      { text: "Nominal", value: "nominal" },
      { text: "Kategori", value: "kategori" },
      { text: "Catatan", value: "catatan" },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    pemasukan: [],
    editedIndex: -1,
    editedItem: {
      tanggal: new Date().toISOString().substr(0, 10),
      nominal: 0,
      kategori: "",
      catatan: "",
    },
    defaultItem: {
      tanggal: new Date().toISOString().substr(0, 10),
      nominal: 0,
      kategori: "",
      catatan: "",
    },
  }),

  computed: {
    ...mapState(["kategori", "user"]),
    totalPemasukan() {
      return this.pemasukan.reduce(function(prev, cur) {
        return prev + cur.nominal;
      }, 0);

      return 0;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    month(val) {
      this.getData(val);
    },
  },

  mounted() {
    this.getData(this.$props.month);
  },

  methods: {
    getData(month) {
      this.pemasukan = [];
      this.loading = true;
      db.doc(`users/${this.user.uid}`)
        .collection("pemasukan")
        .where("bulan", "==", month)
        .orderBy("tanggal")
        .onSnapshot((snapshot) => {
          this.loading = false;
          snapshot.docChanges().forEach((change) => {
            let doc = change.doc;

            if (change.type === "added") {
              this.pemasukan.push({
                id: doc.id,
                ...doc.data(),
              });
            }
            if (change.type === "modified") {
              for (let i in this.pemasukan) {
                if (this.pemasukan[i].id == change.doc.id) {
                  this.pemasukan[i].tanggal = change.doc.data().tanggal;
                  this.pemasukan[i].nominal = change.doc.data().nominal;
                  this.pemasukan[i].kategori = change.doc.data().kategori;
                  this.pemasukan[i].catatan = change.doc.data().catatan;
                  break; //Stop this loop, we found it!
                }
              }
            }
          });
          this.$store.commit("setPemasukan", this.totalPemasukan);
          this.$store.commit("setDataPemasukan", this.pemasukan);
        });
    },
    rupiahFormat(data) {
      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      });

      return formatter.format(data);
    },
    editItem(item) {
      this.editedIndex = this.pemasukan.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.pemasukan.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        db
          .doc(`users/${this.user.uid}`)
          .collection("pemasukan")
          .doc(item.id)
          .delete()
          .then(() => {
            this.pemasukan.splice(index, 1);

            this.$store.commit("setSnackbar", true);
            this.$store.commit("setAlertType", "success");
            this.$store.commit("setAlertMsg", "Berhasil menghapus data");
          })
          .catch((err) => {
            console.log(err.message);
            this.$store.commit("setSnackbar", true);
            this.$store.commit("setAlertType", "error");
            this.$store.commit("setAlertMsg", err.message);
          });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      let data = {
        nominal: parseFloat(this.editedItem.nominal),
        kategori: this.editedItem.kategori,
        tanggal: this.editedItem.tanggal,
        bulan: this.editedItem.tanggal.substr(0, 7),
        catatan: this.editedItem.catatan,
      };

      db.doc(`users/${this.user.uid}`)
        .collection("pemasukan")
        .doc(this.editedItem.id)
        .update(data)
        .then(() => {
          this.$store.commit("setSnackbar", true);
          this.$store.commit("setAlertType", "success");
          this.$store.commit("setAlertMsg", "Berhasil mengubah data");
        })
        .catch((err) => {
          console.log(err.message);
          this.$store.commit("setSnackbar", true);
          this.$store.commit("setAlertType", "error");
          this.$store.commit("setAlertMsg", err.message);
        });

      this.close();
    },
  },
};
</script>

<style></style>
