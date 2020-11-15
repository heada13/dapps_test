// eslint-disable-next-line
/* eslint-disable */ 
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import demo from './modules/demo'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    demo
  }
})