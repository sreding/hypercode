<template id="main-template">
<div id="app">
<context-view></context-view>

</div>
</template>

<script>

import FileContainer from './components/file-container.vue';
import ContextView from './components/context-view.vue';


export default {
  name: 'app',
  components: {
    'file-container': FileContainer,
    'context-view':ContextView
  },
 
  
}
</script>

<style>

</style>
