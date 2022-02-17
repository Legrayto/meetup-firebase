<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red" dark block v-bind="attrs" v-on="on" v-if="isNewUser">
        Edit Profile
      </v-btn>
      <v-btn v-else v-bind="attrs" v-on="on" text>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Edit Profile</v-card-title>
      <v-divider class="mb-5"></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-avatar
              color="grey lighten-4"
              size="150"
              class="elevation-3"
              @click="onFileAvatar"
            >
              <v-img v-if="this.urlAvatar" :src="this.urlAvatar"></v-img>
              <v-icon v-else large color="grey lighten-1">mdi-plus</v-icon>
            </v-avatar>
            <input
              ref="fileInput"
              class="d-none"
              type="file"
              accept="image/*"
              @change="onFileChanged"
            />
          </v-col>
          <v-col cols="12" md="8">
            <v-form ref="form" v-model="valid">
              <v-text-field
                label="FirstName"
                :rules="rules"
                v-model="editFirstName"
                clearable
              ></v-text-field>
              <v-text-field
                label="LastName"
                :rules="rules"
                v-model="editLastName"
                clearable
              ></v-text-field>
              <v-text-field
                label="MiddleName"
                v-model="editMiddleName"
                :rules="rules"
                clearable
              ></v-text-field>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn text color="primary" @click="dialog = false">Close</v-btn>
        <v-btn
          text
          color="accent"
          @click="changeProfile"
          :disabled="!valid || urlAvatar === ''"
          >Change</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: false,
    },
    isNewUser: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      valid: true,
      rules: [
        (v) => !!v || "Field is required",
        (v) => /^([a-z]+)$/i.test(v) || "Field contains only letters",
      ],
      editFirstName: "",
      editLastName: "",
      editMiddleName: "",
      fileAvatar: null,
      urlAvatar: "",
    };
  },
  methods: {
    changeProfile() {
      if (this.isNewUser) {
        this.setNewProfile();
      } else {
        this.editOldProfile();
      }
    },

    setNewProfile() {
      const info = {};
      const fullName = this.fullName();

      info.name = fullName;
      info.avatar = this.fileAvatar;

      this.$store.dispatch("editUserInfo", info);
      this.dialog = false;
    },

    editOldProfile() {
      const notCange =
        this.fullName() === this.user.name &&
        this.urlAvatar === this.user.avatar;

      if (notCange) {
        this.dialog = false;
        return;
      }

      const info = {};
      const fullName = this.fullName();
      info.name = fullName;

      if (this.urlAvatar !== this.user.avatar) {
        info.avatar = this.fileAvatar;
      }

      this.$store.dispatch("editUserInfo", info);
      this.dialog = false;
    },

    fullName() {
      return `${this.editFirstName.trim()} ${this.editLastName.trim()} ${this.editMiddleName.trim()}`;
    },

    validate() {
      this.$refs.form.validate();
    },

    onFileAvatar() {
      this.$refs.fileInput.click();
    },

    onFileChanged(e) {
      this.fileAvatar = e.target.files[0];

      if (this.fileAvatar) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.urlAvatar = fileReader.result;
        });
        fileReader.readAsDataURL(this.fileAvatar);
      }
    },
  },

  created() {
    if (!this.isNewUser) {
      [this.editFirstName, this.editLastName, this.editMiddleName] =
        this.user.name.split(" ");
      this.urlAvatar = this.user.avatar;
    }
  },
};
</script>
