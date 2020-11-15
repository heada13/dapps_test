// eslint-disable-next-line
/* eslint-disable */ 

import Vue from 'vue'
import Router from 'vue-router'
import Top from '@/components/Top'
import Demo from '@/components/Demo'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path: '/',
      name: 'top',
      component: Top
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    },
  ]
})
