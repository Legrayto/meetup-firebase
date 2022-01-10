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
				fab
			>
				<v-icon >mdi-pencil</v-icon>
			</v-btn>
		</template>
		<v-card>
				<v-card-title>Edit Meetup Details</v-card-title>
  			<v-divider class='mb-5'></v-divider>
				<v-card-text>
					<v-text-field
						label='Title'
						required
						clearable
						v-model='editTitle'
						:rules="[value => !!value || 'This field cannot be empty']"
					></v-text-field>

					<v-text-field
						required
						v-model="editDiscriptoin"
						clearable
						:rules="[value => !!value || 'This field cannot be empty']"
						label="Discriprion"
					></v-text-field>
				</v-card-text>

				<v-card-actions>
						<v-btn
							text
							color='primary'
							@click='dialog = false'
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
				editTitle: this.meetup.title,
				editDiscriptoin: this.meetup.discription
			}
		},

		methods: {
			editMeetup() {
				this.dialog = false
				const editObj = {
					id: this.meetup.id
				}
				if ( this.editTitle !== this.meetup.title) {
					editObj.title = this.editTitle
				}
				if ( this.editDiscriptoin !== this.meetup.discription) {
					editObj.discription = this.editDiscriptoin
				}
				this.$store.dispatch('editMeetup', editObj)
			}
		}
	}
</script>