<template id="main-template">
<div id="app">


<context-view></context-view>

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
