<template>
  <div>
    <a-menu v-model="current" mode="horizontal" @openChange="onOpenChange">
      <a-menu-item key="/teach/course/courseSetting">
        <router-link :to="{ name: 'courseSetting' }">
          课程配置
        </router-link>
      </a-menu-item>
      <a-menu-item key="/teach/course/courseTypeSetting">
        <router-link :to="{ name: 'courseTypeSetting' }">
          类型配置
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
        current: ['/teach/course/courseSetting'],
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