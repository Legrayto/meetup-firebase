<template>
	<v-container>
		<v-row  justify='center' v-if='loading'>
			<v-col cols='auto'>
				<v-progress-circular
					:size="70"
					:width="7"
					fill-height
					color="primary"
					indeterminate
				></v-progress-circular>
			</v-col>
		</v-row>

		<div v-else>
			<v-row justify='center' class='mb-2'>
				<v-col sm='6' cols='12' class='text-center text-sm-right'>
					<v-btn
						large
						router to='/meetups'
						color='accent'
					>Explore Meetup</v-btn>
				</v-col>
				<v-col sm='6' cols='12' class='text-center text-sm-left'>
					<v-btn
						large
						router to='/meetups/new'
						color='accent'
						:disabled='!userIsAuth'
					>Organize Meetup</v-btn>
				</v-col>
			</v-row>
			<v-row justify='center'>
				<v-col xl='10' cols='12' class='text-center'>
					<v-carousel  >
						<v-carousel-item
								style='cursor:pointer'
								v-for="(meetup,index) in meetups"
								:key="index"
								:src="meetup.imageUrl"
								router :to="'/meetups/' + meetup.id"
								reverse-transition="fade-transition"
								transition="fade-transition"
							>
							<div
								absolute
								top
								style='background: rgba(0, 0, 0, 0.3); color: rgba(255, 255, 255, 0.9)'
								class="text-center font-weight-bold text-h3"
							>
								{{ meetup.title }}
							</div>
						</v-carousel-item>
							</v-carousel>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>

export default {
	computed: {
		meetups() {
			return this.$store.getters.showMeetups
		},
		loading() {
			return this.$store.getters.loading
		},
		userIsAuth() {
			return this.$store.getters.user !== null && this.$store.getters.user !== undefined
		}
	}
}

</script>