<template>
<div id="app">
  <md-navbar title="Nomore" right>
    <md-nav-item v-link="{name: 'home'}" href="#">Home</md-nav-item>
    <md-nav-item v-link="{name: 'about'}" href="#">About</md-nav-item>
    <md-nav-item>
      <md-btn class="waves-effect waves-light" @click="login()" v-show="!authenticated">Login</md-btn>
      <md-btn class="waves-effect waves-light" @click="logout()" v-show="authenticated">Logout</md-btn>
    </md-nav-item>
  </md-navbar>

  <!-- route outlet -->
  <router-view></router-view>
</div>
</template>

<script>
/**
 * Check if the user are authenticated.
 * 
 * @return {boolean} true if the user are authenticated
 */
const checkAuth = () => !!localStorage.getItem('id_token')

export default {
  data () {
    return {
      authenticated: false,
      lock: new Auth0Lock('5VSrcANdXU3KZbq6wLbAp8eMTYFtJVTO', 'gil0mendes.eu.auth0.com'),
      stellar: null
    }
  },

  ready() {
    let self = this

    // set the initial authenticated state
    this.authenticated = checkAuth()

    // define event for authenticated
    this.lock.on('authenticated', authResult => {
      self.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // todo: handle error
          return
        }

        // save auth token and profile info on local storage
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('profile', JSON.stringify(profile))

        // set user as authenticated
        self.authenticated = true

        // hide login form
        self.lock.hide()
      })
    })

    // --- stellar client
    // create a new client instance
    self.stellar = new StellarClient({
      // server url
      url: 'http://0.0.0.0:8080/'
    })

    // open connection with stellar server
    self.stellar.on('connected', () => console.log('Stellar is now connected with server'))
    self.stellar.connect()
  },

  methods: {
    login() {
      this.lock.show()
    },

    logout() {
      let self = this

      // remove user data from localStorage
      localStorage.removeItem('id_token')
      localStorage.removeItem('profile')

      // set user as not signed in
      self.authenticated = false
    }
  }
}
</script>

<style>

</style>
