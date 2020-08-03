<template>
  <v-card-text>
    <v-alert
      type="error"
      dismissible
      v-model="error"
      transition="slide-y-transition"
    >
      {{ errorMsg }}
    </v-alert>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
        name="email"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        id="password"
        label="Password"
        :rules="passwordRules"
        name="password"
        @click:append="show1 = !show1"
      ></v-text-field>
      <v-btn
        :disabled="!valid"
        type="submit"
        block
        class="orange accent-2 mt-4 mb-2 white--text"
        depressed
        x-large
        @click.prevent="validate"
        >Submit</v-btn
      >
      or
      <v-btn
        class="orange--text accent-2 mt-2"
        outlined
        color="indigo"
        x-large
        block
        @click="loginWithGoogle"
      >
        <v-icon left>mdi-google</v-icon>
        Login with google
      </v-btn>
    </v-form>
  </v-card-text>
</template>

<script>
import { auth, provider, db } from "../../firebase/index";
export default {
  data: () => ({
    valid: true,
    show1: false,
    error: false,
    errorMsg: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 8) || "Password must be less than 8 characters",
    ],
    email: "",
    password: "",
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then((res) => {
            this.$router.push("/");
          })
          .catch((err) => {
            this.error = true;
            this.errorMsg = err.message;
          });
      }
    },
    loginWithGoogle() {
      auth
        .signInWithPopup(provider)
        .then((res) => {
          const userRef = db.collection("users").doc(res.user.uid);

          if (res.additionalUserInfo.isNewUser) {
            userRef.set({
              nama: res.user.displayName,
              email: res.user.email,
              createdAt: new Date().toISOString().substr(0, 10),
            });
          }

          this.$router.push("/");
        })
        .catch((err) => {
          this.error = true;
          this.errorMsg = err.message;
        });
    },
  },
};
</script>

<style></style>
