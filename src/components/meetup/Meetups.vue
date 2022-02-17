<template>
  <v-container>
    <v-row justify="center" v-if="loading">
      <v-col cols="auto">
        <v-progress-circular
          :size="70"
          :width="7"
          fill-height
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row
      justify="center"
      v-for="(meetup, index) in meetups"
      :key="index"
      v-if="!loading"
    >
      <v-col cols="12" lg="8">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="12" sm="4">
                <v-img height="150" :src="meetup.imageUrl"></v-img>
              </v-col>
              <v-col>
                <v-card-title class="text-h4">{{ meetup.title }}</v-card-title>
                <v-card-subtitle class="accent--text">{{
                  meetup.date | date
                }}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    style="cursor: pointer"
                    text
                    router
                    :to="'/meetups/' + meetup.id"
                    color="primary"
                  >
                    <v-icon left>mdi-arrow-collapse-right</v-icon>
                    View
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    meetups() {
      return this.$store.getters.loadedMeetups;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
};
</script>
