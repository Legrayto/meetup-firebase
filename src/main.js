import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getStorage } from "firebase/storage"

import DateFilter from './filters/dateFilter.js'
import AlertCmp from "./components/general/Alert.vue"
import EditMeetupDetails from "./components/edit/EditMeetupDetails.vue"
import EditMeetupDate from "./components/edit/EditMeetupDate.vue"
import EditProfile from "./components/edit/EditProfile.vue"
import RegisteredMeetup from "./components/registered/RegisteredMeetup.vue"


//import { getAnalytics } from "firebase/analytics";

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details', EditMeetupDetails)
Vue.component('app-edit-meetup-date', EditMeetupDate)
Vue.component('app-edit-profile', EditProfile)
Vue.component('app-meetup-register', RegisteredMeetup)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
 async created() {
		const firebaseConfig = {
			apiKey: "AIzaSyCETrcn2yblq5QrBcrkqJ8DJKaEI0h2X_c",
			authDomain: "meetup-1eb75.firebaseapp.com",
			projectId: "meetup-1eb75",
			storageBucket: "gs://meetup-1eb75.appspot.com",
			messagingSenderId: "199082179180",
			appId: "1:199082179180:web:0d50beb108284e51d23649",
			measurementId: "G-HMT4BW1D1R",
			databaseURL: "https://meetup-1eb75-default-rtdb.firebaseio.com",
		};
		const app = initializeApp(firebaseConfig);
		const database = getDatabase(app);
		const storage = getStorage(app)

		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.$store.dispatch('autoAuth', user)
				this.$store.dispatch('fetchData')
			}
		});
		this.$store.dispatch('loadMeetups')

		//const analytics = getAnalytics(app);
	}
}).$mount('#app')
