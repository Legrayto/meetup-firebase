import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateEmail, updateProfile, reauthenticateWithCredential, EmailAuthProvider  } from "firebase/auth";
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

		sighUpUser({commit}, userData) {
			commit('setLoading', true)
			commit('clearError')
			const auth = getAuth()
			createUserWithEmailAndPassword(auth, userData.email, userData.password)
				.then(user => {
					const newUser = {
						id: user.user.uid,
						email: user.user.email,
						registerMeetup: [],
						fbKeys: {},
						name: '',
						avatar: ''
					}
					localStorage.setItem('userPass', `${userData.password}`)
					commit('setUser', newUser)
					commit('setLoading', false)
				})
				.catch(error => {
					commit('setError', error)
					commit('setLoading', false)
				})
		},

		sighInUser({commit, dispatch}, userData) {
			commit('setLoading', true)
			commit('clearError')
			const auth = getAuth()
			signInWithEmailAndPassword(auth, userData.email, userData.password)
				.then(user => {
					const newUser = {
						id: user.user.uid,
						email: user.user.email,
						registerMeetup: [],
						fbKeys: {},
						name: user.user.displayName,
						avatar: user.user.photoURL
					}
					localStorage.setItem('userPass', `${userData.password}`)
					return newUser
				})
				.then((newUser) => {
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

			const auth = getAuth()
			const user = auth.currentUser
			const db = getDatabase()

			const obj = {
				name: user?.displayName || '',
				avatar: user?.photoURL || '',
			}
			commit('setUserField', obj)
			commit('setLoading', false)
		},

		async editUserInfo({commit, getters}, info) {
			commit('setLoading', true)

			const auth = getAuth()
			const user = auth.currentUser

			const storage = getStorage()
			const profileAvatarFile = info.avatar
			const profileEmail = info.email
			const reqInfo = {
				displayName: info.name
			}
			const editInfo = {
				name: info.name
			}

			if (profileAvatarFile) {

					const fileName = profileAvatarFile.name
					const exp = fileName.slice(fileName.lastIndexOf('.'))
					const fileUrl = 'users/' + getters.user.id + exp
					const fileMeta = await uploadBytes(sRef(storage, fileUrl), profileAvatarFile)
					const avatarUrl = await getDownloadURL(sRef(storage, fileMeta.metadata.fullPath))
					
					reqInfo.photoURL = avatarUrl
					editInfo.avatar = avatarUrl 
			}

			if (profileEmail) {
				await this.dispatch('updateEmail', {user, profileEmail})
			}

			updateProfile(user, reqInfo)
				.then(() => {
					commit('setUserField', editInfo)
				})
				.catch(err => console.log(err))
				.finally(() => {
					commit('setLoading', false)

				})

		},

		async updateEmail({commit}, {user, profileEmail}) {
			return updateEmail(user, profileEmail)
					.then(() => {
						commit('setUserField', {email : profileEmail})
					})
					.catch((err) => {
						const userPass = localStorage.getItem('userPass')
						const credential = EmailAuthProvider.credential(
							user.email,
							userPass
						);
						reauthenticateWithCredential(user, credential)
							.then(() => {
								commit('setUserField', {email :profileEmail})
							})
							.catch(err => {
								console.log(err)
							})
					})
					
		},

		logout({commit}) {
			const auth = getAuth()
			signOut(auth)
				.catch((error) => {
					console.log(error)
				})
			localStorage.removeItem('userPass')
			commit('setUser', null)
		}
	}
}
