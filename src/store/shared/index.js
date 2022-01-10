export default {
  state: {
		loading: false,
		error: null
  },

	getters: {
		loading(state) {
			return state.loading
		},
		error(state) {
			return state.error
		}
	},

	mutations: {
		setError(state, error) {
			state.error = error
		},
		clearError(state) {
			state.error = null
		},
		setLoading(state, loadBool) {
			state.loading = loadBool
		}
	},

	actions: {
		clearError({commit}) {
			commit('clearError')
		}
	}
}
