<template>
	<v-dialog
		v-model='dialog'
		persistent
		max-width="600"
    transition="dialog-top-transition"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				v-on="on"
				icon
				x-small
				text
			>
				<v-icon >mdi-pencil</v-icon>
			</v-btn>
		</template>
		<v-card>
				<v-card-title>Edit Meetup Date</v-card-title>
  			<v-divider class='mb-5'></v-divider>
				<v-card-text>
					<v-date-picker
						full-width
						v-model='editDate'
						landscape
						class='mb-3'
						color='secondary'
					></v-date-picker>
					<v-time-picker
						color='secondary'
						full-width
						format="24hr"
						v-model='editTime'
						landscape
						actions
					>
					</v-time-picker>
				</v-card-text>

				<v-card-actions>
						<v-btn
							text
							color='primary'
							@click='closeDialog'
						>Close</v-btn>
						<v-btn
							text
							color='accent'
							@click='editMeetup'
						>Change</v-btn>
				</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: ['meetup'],
		data() {
			return {
				dialog: false,
				editDate: null,
				editTime: null,
				date: null,
				time: null
			}
		},

		methods: {
			closeDialog() {
				this.dialog = false
				setTimeout(() => {
					this.editDate = this.date
					this.editTime = this.time
				}, 100)
			},

			editMeetup() {
				this.dialog = false
				const editObj = {
					id: this.meetup.id
				}
				if ( this.finalDate !== this.meetup.date) {
					editObj.date = this.finalDate
				}
				this.$store.dispatch('editMeetup', editObj)
			},
		},

		computed: {
			finalDate() {
				return `${this.editDate} ${this.editTime}`
			}
		},

		created() {
			this.date = this.meetup.date.slice(0, this.meetup.date.indexOf(' ')).trim()
			this.editDate = this.date
			this.time = this.meetup.date.slice(this.meetup.date.indexOf(' ')).trim()
			this.editTime = this.time
		}
	}
</script>