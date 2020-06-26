<template>
    <a-card :bordered="false">
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="用户设置">
        <UserSetting/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="角色设置" force-render>
        <RoleSetting/>
      </a-tab-pane>
    </a-tabs>
  </div>
    </a-card>
</template>
<script>
  import UserSetting from "./UserSetting";
  import RoleSetting from "./RoleSetting";


  export default {
    components:{
      UserSetting,
      RoleSetting
    },
    data() {
      return {};
    },
    methods: {
      callback(key) {
        console.log(key);
      },
    },
  };
</script>
