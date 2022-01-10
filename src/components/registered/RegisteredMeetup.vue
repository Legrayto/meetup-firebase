<template>
	<v-dialog
		v-model='dialog'
		max-width='400'
		persistent
    transition="dialog-top-transition"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				v-on="on"
				dark
				color='primary'
			>
				{{btnText}}
			</v-btn>
		</template>
		<v-card>
				<v-card-title v-if='userIsRegistered'>Registered this Meetup?</v-card-title>
				<v-card-title v-else>Unregistered this Meetup?</v-card-title>
  			<v-divider class='mb-5'></v-divider>
				<v-card-text>You can always change your decision later on.</v-card-text>
				<v-card-actions>
						<v-btn
							text
							color='primary'
							@click='dialog = false'
						>Close</v-btn>
						<v-btn
							text
							color='accent'
							@click='onAgree'
						>Confirm</v-btn>
				</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: ['meetupId'],
		data() {
			return {
				dialog: false,
			}
		},

		computed: {
			userIsRegistered() {
				return this.$store.getters.user.registerMeetup.findIndex(meetupId => {
					return meetupId === this.meetupId
				}) >= 0
			},

			btnText() {
				return this.userIsRegistered ? 'Unregister' : 'Register'
			},

		},

		methods: {
			onAgree() {
				this.userIsRegistered ?
					this.$store.dispatch('userUnRegisterFromMeetup', this.meetupId)
					: this.$store.dispatch('userRegisterForMeetup', this.meetupId)
				this.dialog = false
			}
		}
	}
</script>