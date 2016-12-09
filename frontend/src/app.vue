<template id="main-template">
<div id="app">
<div class="hidden">
<!-- <template v-for="(item,index) in horizontal">
  <file-container :id="index" class="hFileContainer" >{{index}}</file-container>
</template>
<template v-for="(item,index) in vertical">
  <file-container :id="index" class="vFileContainer" >{{index}}</file-container>
</template> -->
<context-view></context-view>
</div>
<!-- <focus-view :id="1"></focus-view> -->
</div>
</template>

<script>
import ContextView from './components/context-view.vue';
import FocusView from './components/focus-view.vue';
import FileContainer from './components/file-container.vue';



export default {
  name: 'app',
  components: {
    'file-container': FileContainer,
    'focus-view': FocusView,
    'context-view': ContextView

  }
 
  
}
</script>

<style>

</style>
