<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card class="rounded-lg px-6 pb-6" outlined>
        <v-card-title>Tambah Kategori</v-card-title>
        <v-card-text>
          <v-text-field
            label="Nama kategori"
            v-model="namaKategori"
            name="namaKategori"
            hint="Contoh: Hiburan, Sekolah, dll"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="this.namaKategori == '' ? true : false"
            block
            color="orange"
            class="white--text"
            depressed
            @click="addKategori"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card class="rounded-lg px-6 pb-6" outlined>
        <v-card-title>List Kategori</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="kategori"
            sort-by="calories"
            class="elevation-0"
          >
            <template v-slot:item.nama="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    class="d-inline-block text-truncate"
                    style="max-width: 280px;"
                    >{{ item.nama }}</span
                  >
                </template>
                <span>{{ item.nama }}</span>
              </v-tooltip>
            </template>
            <template v-slot:top>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Edit Kategori</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-text-field
                        v-model="editedItem.nama"
                        label="Nama Kategori"
                      ></v-text-field>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"
                      >Cancel</v-btn
                    >
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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import { db } from "../firebase";
export default {
  data: () => ({
    dialog: false,
    namaKategori: "",
    headers: [
      { text: "Nama Kategori", value: "nama" },
      { text: "Aksi", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      nama: "",
    },
    defaultItem: {
      nama: "",
    },
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  computed: mapState(["kategori", "user"]),

  methods: {
    addKategori() {
      db.collection("categories")
        .add({
          nama: this.namaKategori,
        })
        .then(() => {
          this.namaKategori = "";
          console.log("Berhasil menambah data");
          this.$store.commit("setSnackbar", true);
          this.$store.commit("setAlertType", "success");
          this.$store.commit("setAlertMsg", "Berhasil menambah data");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    editItem(item) {
      this.editedIndex = this.kategori.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.kategori.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        db
          .collection("categories")
          .doc(item.id)
          .delete()
          .then(() => {
            this.kategori.splice(index, 1);
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
      if (this.editedIndex > -1) {
        db.collection("categories")
          .doc(this.editedItem.id)
          .update({ nama: this.editedItem.nama })
          .then(() => {
            this.$store.commit("setSnackbar", true);
            this.$store.commit("setAlertType", "success");
            this.$store.commit("setAlertMsg", "Berhasil mengubah data");
          })
          .catch((err) => {
            this.$store.commit("setSnackbar", true);
            this.$store.commit("setAlertType", "error");
            this.$store.commit("setAlertMsg", err.message);
          });
      }
      this.close();
    },
  },
};
</script>

<style></style>
