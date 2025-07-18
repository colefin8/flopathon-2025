import { createRouter, createWebHistory } from 'vue-router'

const componentFiles = import.meta.glob('../components/*.vue')

const dynamicRoutes = Object.keys(componentFiles)
  .map((path) => {
    const componentName = path.split('/').pop().replace('.vue', '')
    const listOfIgnoredComponents = ['HomeView', 'EasyMoney', 'Other']
    if (listOfIgnoredComponents.includes(componentName)) return null

    const routePath = '/' + componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

    return {
      path: routePath,
      name: componentName.toLowerCase(),
      component: componentFiles[path],
      meta: {
        displayName: componentName.replace(/([A-Z])/g, ' $1').trim(),
      },
    }
  })
  .filter((route) => route !== null)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/HomeView.vue'),
      meta: {
        displayName: 'Home',
      },
    },
    {
      path: '/other',
      component: () => import('../components/Other.vue'),
      meta: {
        displayName: 'Ineligible Submissions',
      },
      children: [
        {
          path: 'adam',
          name: 'Pokemon',
          component: () => import('../components/Other/TeamPokemon.vue')
        },
        {
          path: 'cole',
          name: 'Leaky',
          component: () => import('../components/Other/ColesSlider.vue')
        }
      ]
    },
    {
      path: '/easy-money',
      component: () => import('../components/EasyMoney.vue'),
      meta: {
        displayName: 'Easy Money',
      },
      children: [
        {
          path: '',
          name: 'Easy Money',
          component: () => import('../components/easyMoney/MainPage.vue'),
        },
        {
          path: 'ad',
          name: 'Easy Money Ad',
          component: () => import('../components/easyMoney/AdsAndLootBoxes.vue'),
        }
      ]
    },
    ...dynamicRoutes,
  ],
})

export default router
