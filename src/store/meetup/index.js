import { getDatabase, ref, push, set, onValue, update, remove} from "firebase/database";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  state: {
		loadedMeetups: []
  },

	getters: {
		loadedMeetups(state) {
			return state.loadedMeetups.sort((meetupA, meetupB) => meetupA.date > meetupB.date)
		},
		loadedMeetup(state) {
			return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
		},
		showMeetups(state, getters) {
			return getters.loadedMeetups.slice(0, 4)
		}
	},

	mutations: {
		setLoadedMeetups(state, meetups) {
			state.loadedMeetups = meetups
		},

		createMeetup(state, meetup) {
			state.loadedMeetups.push(meetup)
		},

		editMeetup(state, meetup) {
			state.loadedMeetups.find(item => {
				if (item.id === meetup.id) {
					for (let key in meetup) {
						item[key] = meetup[key]
					}
				}
			})
		}
	},

	actions: {
		loadMeetups({commit}) {
			commit('setLoading', true)
			const meetups = []
			const db = getDatabase()
			onValue(ref(db, '/meetups/'), (data) => {
				const obj = data.val()
				for (let key in obj) {
					meetups.push({
						id: key,
						title: obj[key].title,
						location: obj[key].location,
						imageUrl: obj[key].imageUrl,
						discription: obj[key].discription,
						date: obj[key].date,
						createId: obj[key].createId
					})
				}
				commit('setLoading', false)
				commit('setLoadedMeetups', meetups)
			}, {
				onlyOnce: true
			})
		},

		createMeetup({commit}, meetup) {
			const db = getDatabase()
			const storage = getStorage()
			const newMeetup = push(ref(db, 'meetups'))
			let key = newMeetup.key
			set(newMeetup , meetup)
				.then(() => {
					const fileName = meetup.imageUrl.name
					const exp = fileName.slice(fileName.lastIndexOf('.'))
					const fileUrl = 'meetups/' + key + exp
					return uploadBytes(sRef(storage, fileUrl), meetup.imageUrl)
				})
				.then(fileMeta => {
					return getDownloadURL(sRef(storage, fileMeta.metadata.fullPath))
				})
				.then(url => {
					const updates = {};
					updates['/meetups/' + key + '/imageUrl/'] = url
					update(ref(db), updates);
					return url
				})
				.then((url) => {
					commit('createMeetup', {
						...meetup,
						id: key,
						imageUrl: url
					})
				})
				.catch(error => console.log(error))
		},

		editMeetup({commit}, editMeetup) {
			commit('setLoading', true)
			const db = getDatabase()
			const updates = {}
			for (let item in editMeetup) {
				if (item !== 'id') {
					updates['/meetups/' + editMeetup.id + `/${item}/`] = editMeetup[item]
				}
			}
			update(ref(db), updates)
			commit('setLoading', false)
			commit('editMeetup', editMeetup)
		}
	}
}
