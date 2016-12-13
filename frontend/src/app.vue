<template id="main-template">
<div id="app">

<!-- <focus-view></focus-view>  -->
<!-- <router-link></router-link> -->
<router-view></router-view>
</div>

</template>

<script>
import ContextView from './components/context-view.vue';
import FileContainer from './components/file-container.vue';

export default {
  name: 'app',
  components: {
    'file-container': FileContainer,
    'context-view': ContextView
  }

  
}
</script>

<style>

</style>
 -->