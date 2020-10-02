<template>
  <a-carousel autoplay>
    <div><h3>1</h3></div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </a-carousel>
</template>

<script>
  import ACarousel from 'ant-design-vue/lib/carousel';
  import 'ant-design-vue/dist/antd.css';
    export default {
        name: "balaner",
      components:{
        ACarousel
      }
    }
</script>

<style scoped>
  /* For demo */
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel >>> .slick-slide h3 {
    color: #fff;
  }
</style>