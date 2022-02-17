import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "firebase/auth";
import { getDatabase, ref, push, set, onValue, update, remove} from "firebase/database";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

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
		setUserField(state, obj) {
			for (const field in obj) {
				state.user[field] = obj[field]
			}
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
						email: user.user.email,
						registerMeetup: [],
						fbKeys: {},
						name: '',
						avatar: ''
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
						email: user.user.email,
						registerMeetup: [],
						fbKeys: {},
						name: '',
						avatar: ''
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
				email: user.email,
				registerMeetup: [],
				fbKeys: {},
				name: '',
				avatar: ''
			})
		},

		async fetchData({dispatch}) {
			await dispatch('fetchUserMeetup')
			await dispatch('fetchUserInfo')
		},

		async fetchUserMeetup({commit, getters}) {
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
				commit('setUserField', {
					registerMeetup: userMeetupId,
					fbKeys: userMeetupFbKeys
				})
				commit('setLoading', false)
			}, {
				onlyOnce: true
			})
		},


		async fetchUserInfo({commit, getters}) {
			commit('setLoading', true)

			const db = getDatabase()

			onValue(ref(db, `/users/${getters.user.id}/info`), data => {
				const info = data.val()
				const profile = {
					name: info?.name || '',
					avatar: info?.avatar || ''
				}
				commit('setUserField', profile)
				commit('setLoading', false)
			}, {
				onlyOnce: true
			})
		},

		// async fetchUserData({commit, dispatch, getters}) {
		// 	// commit('setLoading', true)
		// 	const db = getDatabase()
		// 	const userMeetupId = []
		// 	const userMeetupFbKeys = {}

		// 	onValue(ref(db, `/users/${getters.user.id}`), data => {
		// 		const obj = data.val()
		// 		const meetup = obj.registrations
		// 		const userInfo = obj.info

		// 		for (let key in meetup) {
		// 			userMeetupId.push(meetup[key])
		// 			userMeetupFbKeys[meetup[key]] = key
		// 		}

		// 		const res = {
		// 			registerMeetup: userMeetupId,
		// 			fbKeys: userMeetupFbKeys,
		// 			name: userInfo.name || {},
		// 			avatar: userInfo.avatar || ''
		// 		}

		// 		commit('setUser', {
		// 			id: getters.user.id,
		// 			email: getters.user.id,
		// 			...res
		// 		})
		// 		// commit('setLoading', false)
		// 	})
		// },

		// async fetchUserMeetup({getters}) {
		// 	const db = getDatabase()
		// 	const userMeetupId = []
		// 	const userMeetupFbKeys = {}
		// 	onValue(ref(db, `/users/${getters.user.id}/registrations`), data => {
		// 		const obj = data.val()
		// 		for (let key in obj) {
		// 			userMeetupId.push(obj[key])
		// 			userMeetupFbKeys[obj[key]] = key
		// 		}
		// 	}, {
		// 		onlyOnce: true
		// 	})
		// 	return {
		// 				registerMeetup: userMeetupId,
		// 				fbKeys: userMeetupFbKeys
		// 	}
		// },


		async editUserInfo({commit, getters}, info) {
			commit('setLoading', true)
			const db = getDatabase()
			const storage = getStorage()
			const updates = {}
			const profileName = info.name
			const profileAvatarFile = info.avatar
			const editInfo = {}

			updates['/users/' + getters.user.id + '/info/name/'] = profileName
			editInfo.name = profileName

			if (profileAvatarFile) {

					const fileName = profileAvatarFile.name
					const exp = fileName.slice(fileName.lastIndexOf('.'))
					const fileUrl = 'users/' + getters.user.id + exp
					const fileMeta = await uploadBytes(sRef(storage, fileUrl), profileAvatarFile)
					const avatarUrl = await getDownloadURL(sRef(storage, fileMeta.metadata.fullPath))

					updates['/users/' + getters.user.id + '/info/avatar'] = avatarUrl
					editInfo.avatar = avatarUrl
			}
			await update(ref(db), updates)
			commit('setUserField', editInfo)
			commit('setLoading', false)
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
