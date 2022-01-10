<template>
  <v-app>
		<div>
			<v-toolbar
				dense
				elevation="4"
				color='primary'
				dark
			>
				<v-app-bar-nav-icon
					@click.stop='isSideNav = !isSideNav'
					class='d-md-none'
				></v-app-bar-nav-icon>

				<v-toolbar-title>
					<router-link
						to='/'
						class='white--text'
						style='cursor: pointer;
							text-decoration: none'
						>Meetup</router-link>
				</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-toolbar-items class='d-none d-md-flex'>
					<v-btn
						text
						v-for='(item, index) in menuItems'
						:key='index'
						router :to='item.link'
						:disabled='item.title === "Profile"'
					>
						<v-icon left>{{ item.icon }}</v-icon>
						{{ item.title }}
					</v-btn>
					<v-btn
						text
						@click='onLogout'
						router to='/'
						v-if='userIsAuth'
					>
						<v-icon left>mdi-exit-run</v-icon>
						Logout
					</v-btn>
				</v-toolbar-items>

			</v-toolbar>

		</div>

		<v-navigation-drawer
			v-model='isSideNav'
			absolute
			temporary
		>
			<v-list>
				<v-list-item-group
					v-model='isSideNavCheck'
				>
					<v-list-item
						v-for='(item, index) in menuItems'
						:key='index'
						router :to='item.link'
					>
						<v-list-item-icon>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>{{ item.title }}</v-list-item-title>
						</v-list-item-content>

					</v-list-item>

					<v-list-item
						@click='onLogout'
						v-if='userIsAuth'
					>
						<v-list-item-icon>
							<v-icon left>mdi-exit-run</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>Logout</v-list-item-title>
						</v-list-item-content>
					</v-list-item>

				</v-list-item-group>
			</v-list>

		</v-navigation-drawer>

    <v-main>
			<router-view></router-view>
    </v-main>

  </v-app>
</template>

<script>

export default {
  data: () => ({
    isSideNav: false,
		isSideNavCheck: null,
  }),

	computed: {
		menuItems() {
			let menuItems = [
				{icon: 'mdi-door', title: 'Sigh Up', link: '/sighup'},
				{icon: 'mdi-lock-open', title: 'Sigh In', link: '/sighin'},
			]
			if (this.userIsAuth) {
				menuItems = [
					{icon: 'mdi-account-multiple', title: 'View Meetups', link: '/meetups'},
					{icon: 'mdi-plus', title: 'Organize Meetup', link: '/meetups/new'},
					{icon: 'mdi-account', title: 'Profile', link: '/profile'},
				]
			}
			return menuItems
		},
		userIsAuth() {
			return this.$store.getters.user !== null && this.$store.getters.user !== undefined
		}
	},

	watch: {
		isSideNavCheck() {
			this.isSideNav = false
		}
	},

	methods: {
		onLogout() {
			this.$store.dispatch('logout')
		}
	}
};
</script>
