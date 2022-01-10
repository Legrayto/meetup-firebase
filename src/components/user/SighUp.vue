<template>
	<v-container>
		<v-row justify='center'>
			<v-col cols='12' sm='10' md='8'>
				<v-form
					@submit.prevent='sighUp'
					ref='form'
				>
					<v-text-field
						label='Email'
						required
						clearable
						v-model='email'
					></v-text-field>

					<v-text-field
						required
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[value => !!value || 'This field is required', value => value.length >= 6 || 'Min 6 characters',]"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            @click:append="show1 = !show1"
          ></v-text-field>

					<v-text-field
						required
            v-model="repeatPassword"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[value => this.password === value || 'Password mismatch']"
            :type="show2 ? 'text' : 'password'"
            label="Repeat Password"
            @click:append="show2 = !show2"
          ></v-text-field>

					<v-container v-if='error'>
						<v-row>
							<v-col>
								<app-alert
									:text='error.code'
									@dismissible='onClearError'
								></app-alert>
							</v-col>
						</v-row>
					</v-container>

					<v-container>
						<v-row>
							<v-btn
								:disabled='!validForm'
								:loading="loading"
								type='submit'
								color='accent'
							>Sigh Up</v-btn>

							<v-spacer></v-spacer>

							<v-btn
								@click='reset'
								color='primary'
							>Reset</v-btn>
						</v-row>
					</v-container>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>

export default {
	data() {
		return {
			show1: false,
			show2: false,
			email: '',
			password: '',
			repeatPassword: ''
		}
	},
	computed: {
		validForm() {
			return this.email !== ''
				&& this.password !== ''
				&& this.repeatPassword === this.password
		},
		user() {
			return this.$store.getters.user
		},
		error() {
			return this.$store.getters.error
		},
		loading() {
			return this.$store.getters.loading
		}
	},

	watch: {
		user(value) {
			if (value !== null && value !== undefined) {
				this.$router.push('/')
			}
		}
	},

	methods: {
		reset () {
			this.$refs.form.reset()
		},
		sighUp() {
			this.$store.dispatch('sighUpUser', {email: this.email, password: this.password})
		},
		onClearError() {
			this.$store.dispatch('clearError')
		}
	}
}

</script>