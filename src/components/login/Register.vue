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
        v-model="name"
        :rules="[(value) => !!value || 'Name is required']"
        label="Your Name"
        name="name"
      ></v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        :rules="emailRules"
        name="email"
        type="email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        id="password"
        :rules="passwordRules"
        label="Password"
        name="password"
        @click:append="show1 = !show1"
      ></v-text-field>
      <v-btn
        :disabled="!valid"
        type="submit"
        block
        class="orange accent-2 mt-4 white--text"
        depressed
        x-large
        @click.prevent="validate"
        >Submit</v-btn
      >
    </v-form>
  </v-card-text>
</template>

<script>
import { auth, db } from "../../firebase";
export default {
  data: () => ({
    valid: true,
    show1: false,
    name: "",
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
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((cred) => {
            db.collection("users")
              .doc(cred.user.uid)
              .set({
                nama: this.name,
                email: this.email,
                createdAt: new Date().toISOString().substr(0, 10),
              });
            this.$router.push("/");
          })
          .catch((err) => {
            this.error = true;
            this.errorMsg = err.message;
          });
      }
    },
  },
};
</script>

<style></style>
