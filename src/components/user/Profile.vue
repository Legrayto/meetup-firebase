<template>
  <v-container>
    <div>
      <v-row justify="center">
        <v-col cols="12" class="text-center text-h4 text-sm-h3">Profile</v-col>
      </v-row>

      <v-row justify="center" align="center" v-if="loading">
        <v-col cols="auto">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-col>
      </v-row>

      <v-row justify="center" v-else>
        <v-col cols="10" sm="8" md="6">
          <app-edit-profile
            v-if="isNewUser"
            :isNewUser="true"
          ></app-edit-profile>

          <v-card v-if="!isNewUser">
            <v-card-text>
              <v-row>
                <v-col class="d-flex">
                  <v-avatar
                    color="grey lighten-4"
                    size="100"
                    class="elevation-3"
                  >
                    <v-img :src="user.avatar" v-if="user.avatar"></v-img>
                    <v-icon v-else large color="grey lighten-1"
                      >mdi-plus</v-icon
                    >
                  </v-avatar>
                  <v-spacer></v-spacer>
                  <app-edit-profile
                    :user="{ name: user.name, avatar: user.avatar }"
                  ></app-edit-profile>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="text-h6 text-sm-h4 font-weight-bold">
                    {{ user.name }}
                  </div>
                  <div class="text-subtitle font-italic indigo--text">
                    {{ user.email }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    user() {
      return this.$store.getters.user;
    },
    isNewUser() {
      return !this.loaging && !this.user.avatar && !this.user.name;
    },
  },
};
</script>
