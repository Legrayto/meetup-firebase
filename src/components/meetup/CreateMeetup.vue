<template>
	<v-container>
		<v-row justify='center'>
			<v-col cols='12' class='text-center text-h4 text-sm-h3'>Create Meetup</v-col>
		</v-row>
		<v-row justify='center'>
			<v-col cols='12' sm='8' lg='6'>
				<v-form
					@submit.prevent='createMeetup'
					ref='form'
				>
					<v-text-field
						label='Title'
						require
						clearable
						v-model='title'
					></v-text-field>

					<v-text-field
						label='Location'
						require
						clearable
						v-model='location'
					></v-text-field>

					<v-file-input
						label='Image'
						accept="image/*"
						v-model='image'
					></v-file-input>

					<v-img :src='imageUrl' :height='imageUrl ? 200 : 0'></v-img>

					<v-textarea
						clearable
						label="Discription"
						v-model='discription'
					></v-textarea>

						<v-row justify='center' align='center' class='mb-8'>
							<v-col cols='12' sm='10' md='6'>
								<v-date-picker
									full-width
									v-model="date"
									elevation="10"
									color='secondary'
								></v-date-picker>
							</v-col>
							<v-col cols='12' sm='10' md='6' >
								<v-time-picker
									full-width
									format="24hr"
									v-model='time'
									elevation="10"
									color='secondary'
								></v-time-picker>
							</v-col>
						</v-row>

					<v-container>
						<v-row>
							<v-btn
								:disabled='!validForm'
								type='submit'
								color='accent'
							>Add Meetup</v-btn>

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
				title: '',
				location: '',
				imageUrl: '',
				discription: '',
				date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
				time: '',
				image: null
			}
		},

		computed: {
			validForm() {
				return this.title !== ''
					&& this.location !== ''
					&& this.image !== null
					&& this.discription !== ''
					&& this.time !== ''
			},
			user() {
				return this.$store.getters.user
			}
		},

		methods: {
      reset () {
        this.$refs.form.reset()
      },
			createMeetup() {
				const meetup = {
					title: this.title,
					location: this.location,
					imageUrl: this.image,
					discription: this.discription,
					date: `${this.date} ${this.time}`,
					createId: this.user.id
				}
				this.$store.dispatch('createMeetup', meetup)
				this.reset()
			}
		},

		watch: {
			image(value) {
				if (value) {
					const fileReader = new FileReader()
					fileReader.addEventListener('load', () => {
						this.imageUrl = fileReader.result
					})
					fileReader.readAsDataURL(this.image)
				} else {
					this.imageUrl = ''
				}
			}
		}
	}

</script>