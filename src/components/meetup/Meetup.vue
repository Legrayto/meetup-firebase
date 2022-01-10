<template>
	<v-container>
		<v-row justify='center' align='center' v-if='loading'>
			<v-col cols='auto'>
				<v-progress-circular
					:size="70"
					:width="7"
					color="primary"
					indeterminate
				></v-progress-circular>
			</v-col>
		</v-row>
		<v-row justify='center' v-else>
			<v-col cols='10'>
				<v-card>
					<v-card-title>
						<div class='text-h4 primary--text'>{{ meetup.title }}</div>
						<template v-if='userIsCreator'>
							<v-spacer></v-spacer>
							<app-edit-meetup-details :meetup='meetup'></app-edit-meetup-details>
						</template>
					</v-card-title>
					<v-img
						height='400'
						:src="meetup.imageUrl"
					></v-img>
					<v-card-text class='d-flex align-center'>
						<template v-if='userIsCreator'>
							<app-edit-meetup-date :meetup='meetup'></app-edit-meetup-date>
						</template>
						<span class='ml-3 secondary--text text-subtitle-1'>{{ meetup.date | date}} - {{meetup.location}}</span>
					</v-card-text>
					<v-card-text>
						<div class="black--text">{{meetup.discription}}</div>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<app-meetup-register
							:meetupId='meetup.id'
							v-if='userIsAuthenticated && !userIsCreator'
						></app-meetup-register>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	export default {
		props: ['id'],
		computed: {
			meetup() {
				return this.$store.getters.loadedMeetup(this.id)
			},
			loading() {
				return this.$store.getters.loading
			},
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
			userIsCreator() {
				if (!this.userIsAuthenticated) {
          return false
        }
				return this.$store.getters.user.id === this.meetup.createId
			}
		}
	}
</script>