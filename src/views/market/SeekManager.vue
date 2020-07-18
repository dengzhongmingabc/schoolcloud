<template>
  <div>
    <a-menu v-model="current" mode="horizontal" @openChange="onOpenChange">
      <a-menu-item key="/market/seekManager/seek">
        <router-link :to="{ name: 'seek' }">
          咨询
        </router-link>
      </a-menu-item>
      <a-menu-item key="/market/seekManager/talkStudent">
        <router-link :to="{ name: 'talkStudent' }">
          沟通
        </router-link>
      </a-menu-item>
    </a-menu>
    <div>
      <route-view></route-view>
    </div>
  </div>
</template>
<script>
  import { RouteView } from '@/layouts'
  export default {
    components: {
      RouteView
    },
    data() {
      return {
        openKeys: [],
        current: ['/market/seekManager/seek'],
      };
    },
    mounted () {
      this.updateMenu()
    },
    methods: {
      onOpenChange (openKeys) {
        this.openKeys = openKeys
      },
      updateMenu () {
        const routes = this.$route.matched.concat()
        this.current = [ routes.pop().path ]
        console.log(this.current)
      }
    },
    watch: {
      '$route' (val) {
        this.updateMenu()
      }
    }
  };
</script>