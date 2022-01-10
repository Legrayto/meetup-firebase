import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "firebase/auth";
import { getDatabase, ref, push, set, onValue, update, remove} from "firebase/database";

export default {
  state: {
		user: null,
  },

	getters: {
		user(state) {
			return state.user
		}
	},

	mutations: {
		userRegisterForMeetup(state, meetupIdObj) {
			state.user.registerMeetup.push(meetupIdObj.id)
			state.user.fbKeys[meetupIdObj.id] = meetupIdObj.fbKey
		},

		userUnRegisterFromMeetup(state, meetupId) {
			const registerMeetup = state.user.registerMeetup
			registerMeetup.splice(registerMeetup.findIndex(meetup => meetup === meetupId), 1)
			delete state.user.fbKeys[meetupId]
		},

		setUser(state, newUser) {
			state.user = newUser
		},
	},

	actions: {
		userRegisterForMeetup({commit, getters}, meetupId) {
			commit('setLoading', true)
			const db = getDatabase()
			const user = getters.user
			const registeredMeetups = push(ref(db, `/users/${user.id}/registrations`))
			const meetupKey = registeredMeetups.key
			set(registeredMeetups, meetupId)
				.then(() => {
					commit('setLoading', false)
					commit('userRegisterForMeetup', {id: meetupId, fbKey: meetupKey})
				})
				.catch(error => {
					console.log(error)
					commit('setLoading', false)
				})
		},

		userUnRegisterFromMeetup({commit, getters}, meetupId) {
			commit('setLoading', true)
			const db = getDatabase()
			const user = getters.user
			const registeredMeetups = ref(db, `/users/${user.id}/registrations/${user.fbKeys[meetupId]}`)
			remove(registeredMeetups)
				.then(() => {
					commit('userUnRegisterFromMeetup', meetupId)
					commit('setLoading', false)
				})
				.catch(error => {
					console.log(error)
					commit('setLoading', false)
				})
		},

		sighUpUser({commit}, user) {
			commit('setLoading', true)
			commit('clearError')
			const auth = getAuth()
			createUserWithEmailAndPassword(auth, user.email, user.password)
				.then(user => {
					const newUser = {
						id: user.user.uid,
						registerMeetup: [],
						fbKeys: {}
					}
					commit('setUser', newUser)
					commit('setLoading', false)
				})
				.catch(error => {
					commit('setError', error)
					commit('setLoading', false)
				})
		},

		sighInUser({commit}, user) {
			commit('setLoading', true)
			commit('clearError')
			const auth = getAuth()
			signInWithEmailAndPassword(auth, user.email, user.password)
				.then(user => {
					const newUser = {
						id: user.user.uid,
						registerMeetup: [],
						fbKeys: {}
					}
					commit('setUser', newUser)
					commit('setLoading', false)
				})
				.catch(error => {
					commit('setError', error)
					commit('setLoading', false)
				})
		},

		autoAuth({commit}, user) {
			commit('setUser', {
				id: user.uid,
				registerMeetup: [],
				fbKeys: {}
			})
		},

		fetchUserMeetup({commit, getters}) {
			commit('setLoading', true)
			const db = getDatabase()
			const userMeetupId = []
			const userMeetupFbKeys = {}
			onValue(ref(db, `/users/${getters.user.id}/registrations`), data => {
				const obj = data.val()
				for (let key in obj) {
					userMeetupId.push(obj[key])
					userMeetupFbKeys[obj[key]] = key
				}
				commit('setUser', {
					id: getters.user.id,
					registerMeetup: userMeetupId,
					fbKeys: userMeetupFbKeys
				})
				commit('setLoading', false)
			}, {
				onlyOnce: true
			})
		},

		logout({commit}) {
			const auth = getAuth()
			signOut(auth)
				.catch((error) => {
					console.log(error)
				})
			commit('setUser', null)
		}
	}
}
