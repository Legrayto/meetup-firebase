import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import CreateMeetup from '../components/meetup/CreateMeetup'
import Meetups from '../components/meetup/Meetups'
import Meetup from '../components/meetup/Meetup'
import Profile from '../components/user/Profile'
import SighIn from '../components/user/SighIn'
import SighUp from '../components/user/SighUp'
import AuthGuard from './auth-guard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/meetups',
    name: 'Meetups',
    component: Meetups,
		//beforeEnter: AuthGuard
  },
	{
    path: '/meetups/new',
    name: 'CreateMeetup',
    component: CreateMeetup,
		//beforeEnter: AuthGuard
  },
	{
  	path: '/meetups/:id',
    name: 'Meetup',
		props: true,
    component: Meetup,
		//beforeEnter: AuthGuard
  },
	{
    path: '/profile',
    name: 'Profile',
    component: Profile,
		//beforeEnter: AuthGuard
  },
	{
    path: '/sighin',
    name: 'SighIn',
    component: SighIn
  },
	{
    path: '/sighup',
    name: 'SighUp',
    component: SighUp
  }
]

const router = new VueRouter({
	mode: 'history',
  routes
})

export default router
