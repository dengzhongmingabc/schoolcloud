<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <!--<a href="https://www.github.com/vueComponent/pro-layout" target="_blank">Pro Layout</a>
      <a href="https://www.github.com/vueComponent/ant-design-vue-pro" target="_blank">Github</a>
      <a href="https://www.github.com/sendya/" target="_blank">@Sendya</a>-->
    </template>
    <template v-slot:copyright>
      <a href="https://www.honorfly.com" target="_blank">智能教培信息有限公司提供技术支持</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
