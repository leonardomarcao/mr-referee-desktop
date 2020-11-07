import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/HomePage'
import newParliamentary from '@/components/NewParliamentary'
import monitor from '@/components/Monitor'
import monitorParliamentary from '@/components/MonitorParliamentary'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: home
    },
    {
      path: '/new-parliamentary',
      name: 'new-parliamentary',
      component: newParliamentary
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: monitor
    },
    {
      path: '/monitor-parliamentary/:id',
      name: 'monitor-parliamentary',
      component: monitorParliamentary
    }
  ]
})
