import Vue from "vue";
import Vuex from "vuex";
import { auth, db } from "../firebase";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    kategori: [],
    user: null,
    error: null,
    loading: false,
    totalPemasukan: 0,
    totalPengeluaran: 0,
    dataPemasukan: [],
    dataPengeluaran: [],
    snackbar: false,
    alertType: "",
    alertMsg: "",
  },
  mutations: {
    setPemasukan(state, data) {
      state.totalPemasukan = data;
    },
    setPengeluaran(state, data) {
      state.totalPengeluaran = data;
    },
    setDataPemasukan(state, data) {
      state.dataPemasukan = data;
    },
    setDataPengeluaran(state, data) {
      state.dataPengeluaran = data;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setSnackbar(state, data) {
      state.snackbar = data;
    },
    setAlertType(state, data) {
      state.alertType = data;
    },
    setAlertMsg(state, data) {
      state.alertMsg = data;
    },
  },
  actions: {
    onAuth({ commit }) {
      this.state.loading = true;
      auth.onAuthStateChanged((payload) => {
        this.state.loading = false;
        const { email, uid } = payload;
        this.state.user = { email, uid };
      });
    },
    logout({ commit }) {
      auth
        .signOut()
        .then(() => {
          commit("setUser", null);
          router.push("/login");
        })
        .then(() => {
          this.state.user = [];
          this.state.kategori = [];
          this.state.pengeluaranHariIni = [];
          this.state.dataPemasukan = [];
          this.state.dataPengeluaran = [];
          this.state.totalPemasukan = 0;
          this.state.totalPengeluaran = 0;
        });
    },
    getKategori() {
      db.collection("categories").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let doc = change.doc;
          if (change.type === "added") {
            this.state.kategori.push({
              id: doc.id,
              ...doc.data(),
            });
          }
          if (change.type === "modified") {
            for (let i in this.state.kategori) {
              if (this.state.kategori[i].id == change.doc.id) {
                this.state.kategori[i].nama = change.doc.data().nama;
                break; //Stop this loop, we found it!
              }
            }
          }
        });
      });
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined;
    },
  },
});
