<template>
  <v-app>
    <v-main class="grey lighten-2">
      <v-container fluid>
        <v-row align="center" justify="center" class="mt-16">
          <v-col cols="12" sm="8" md="4" align="center">
            <span class="text-h1 text-center secondary--text">
              UANGKU
            </span>
            <v-card class="rounded-lg px-4 mt-8" max-width="400">
              <v-tabs
                background-color="transparent"
                color="orange accent-2"
                fixed-tabs
                v-model="tab"
              >
                <v-tab>
                  Login
                </v-tab>
                <v-tab>
                  Register
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab">
                <v-tab-item>
                  <login-form />
                </v-tab-item>
                <v-tab-item>
                  <Register />
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LoginForm from "../components/login/LoginForm";
import Register from "../components/login/Register";
export default {
  components: { LoginForm, Register },
  data: () => ({
    tab: null,
  }),
};
</script>

<style></style>
