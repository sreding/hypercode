import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import ContextView from './components/context-view.vue';
import FileContainer from './components/file-container.vue';
import FocusView from './components/focus-view.vue';
import OverView from './components/over-view.vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons';

const Entry = {
	template: '<p>/file for ContextView, /container for FileContainer</p>'
}

const NotFound = {
  components: {
    "icon":Icon
  },
	template: '<div id="centerContainer"><p> <icon name="meh-o" scale="1"></icon> 404 - not found <icon name="meh-o" scale="1"></icon></p></div>',
}

const routes = [
  //will eventually be replaced by overview
  { path: '/container', component: FileContainer },
  { path: '/file/:id', component: ContextView },
  { path: '/single', component: FocusView },
  { path: '/single/:id', component: FocusView },
  { path: '/', component: OverView },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
	mode:'history',
  routes // short for routes: routes
})


Vue.use(VueRouter);
const app = new Vue({
  el:'#app',
  render: h => h(App),
  router
})
