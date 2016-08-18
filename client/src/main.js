import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './App.vue'

// enable Vue Material
import VueMaterialComponents from 'vue-material-components'
Vue.use(VueMaterialComponents)

// enable Vue Router
Vue.use(VueRouter)

// enable Vue Resource
Vue.use(VueResource)

// intercept response and check for anything unauthorized. If there is an 
// unauthorized response, log the user out and redirect to the home route
Vue.http.interceptors.push({
  response: response => {
    if (response.status === 401) {
      this.logout()
      this.authenticated = false
      route.go('/')
    }

    return response
  }
})

// configure Vue Router
const router = new VueRouter()

router.map({
  '/': {
    name: 'home',
    component: require('./Home.vue')
  },
  '/about': {
    name: 'about',
    component: require('./About.vue')
  },
  '/question/:id': {
    name: 'question',
    component: require('./Question.vue')
  }
})

router.start(App, 'app')