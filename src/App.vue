<template>
  <NavBar />
  <!-- //默认是使用路由中定义的name来进行判重的 但这可能导致错误 若要使用完整路径进行判重 需要使用下面的方式 -->
  <router-view :key="$route.fullPath" />
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import NavBar from './components/NavBar.vue';

export default {
  name: "App",
  components: {
    NavBar,
  }
}
</script>

<style scoped></style>
