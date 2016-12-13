<!-- <template id="main-template">
<div id="app">
<!-- 
<focus-view></focus-view>  -->

</div>

</template>

<script>
import ContextView from './components/context-view.vue';

import FileContainer from './components/file-container.vue';

const Entry = {
	template: '<p>/file for ContextView, /container for FileContainer</p>'
}
const routes = {
	'/' : Entry, //will eventually be replaced by overview
  '/file': ContextView,
  '/container':FileContainer
}

export default {
  name: 'app',
  components: {
    'file-container': FileContainer,
    'context-view': ContextView
    // 'focus-view': FocusView
  },
  data: function(){
  	return{
  		currentRoute: window.location.pathname
  	}
    
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
 

  
}
</script>

<style>

</style>
 -->