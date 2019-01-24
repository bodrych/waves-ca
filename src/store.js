import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    certs: [],
  },
  mutations: {
    loadCerts (state, certs) {
      state.certs = certs.slice(0)
      console.log(JSON.stringify(state.certs))
    }
  }
})

export default store
