import 'vuetify/dist/vuetify.min.css'
import Vue from 'vue';
import app from './components/app.vue';
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import colors from 'vuetify/es5/util/colors'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import List from './components/list.vue';
import Edit from './components/edit.vue';
import Check from './components/check.vue';
import store from './store.js'

Vue.use(Vuetify, {
  iconfont: 'mdi'
})
Vue.use(VueRouter)

const routes = [
  { path: '/', component: List },
  { path: '/edit/:address?', component: Edit },
  { path: '/check/:address?', component: Check }
]

const router = new VueRouter({
  routes
})

const main = new Vue({
	el: '#app',
	store,
	components: {app},
	template: '<app />',
	router
});