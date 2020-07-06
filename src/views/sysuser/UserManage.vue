<template>
  <div>
    <a-menu v-model="current" mode="horizontal" @openChange="onOpenChange">
      <a-menu-item key="/sysusermanager/usermanage/userSetting">
        <router-link :to="{ name: 'userSetting' }">
          用户配置
        </router-link>
      </a-menu-item>
      <a-menu-item key="/sysusermanager/usermanage/roleSetting">
        <router-link :to="{ name: 'roleSetting' }">
          角色配置
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
        current: ['/sysusermanager/usermanage/userSetting'],
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