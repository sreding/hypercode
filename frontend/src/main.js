import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import ContextView from './components/context-view.vue';
import FileContainer from './components/file-container.vue';
import FocusView from './components/focus-view.vue';
import OverView from './components/over-view.vue';


const Entry = {
	template: '<p>/file for ContextView, /container for FileContainer</p>'
}

const NotFound = {
	template: '<p>404 - not found</p>'
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
