import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import CreateMeetup from '../components/meetup/CreateMeetup'
import Meetups from '../components/meetup/Meetups'
import Meetup from '../components/meetup/Meetup'
import Profile from '../components/user/Profile'
import SighIn from '../components/user/SighIn'
import SighUp from '../components/user/SighUp'

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
  },
	{
    path: '/meetups/new',
    name: 'CreateMeetup',
    component: CreateMeetup,
  },
	{
  	path: '/meetups/:id',
    name: 'Meetup',
		props: true,
    component: Meetup,
  },
	{
    path: '/profile',
    name: 'Profile',
    component: Profile,
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
  routes
})

export default router
