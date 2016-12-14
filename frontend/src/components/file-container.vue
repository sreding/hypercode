<template>
  <div id="file-container">
    <div id="wrapper">

    <div class="container-menu-top">
    <router-link :to="{path:'/'}"  class="exit-btn" id="exit-btn">Overview</router-link>
      <a href="#" v-on:click="remove" class="exit-btn" id="exit-btn">Delete</a>
      <div class="ctr">0</div>
      </div>
      <h1>{{filedata.name}}</h1>
      
      <textarea name="editor" id="editor">{{filedata.source}}</textarea>
     <!--  <a href="#" class="prev-btn" id="prev-btn">&lt</a>
      <a href="#" class="next-btn" id="next-btn">&gt</a> -->
      <div class="container-menu">
      <a href="#" v-on:click="update" class="btn" id="save-btn">Save</a>
      <router-link :to="{path:filedata._id}"  class="btn" id="focus-btn">Focus</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// enable ajax
let Vue = require('vue');
let VueResource = require('vue-resource');
Vue.use(VueResource);

import hljs from 'highlight.js';
import CodeMirror from 'codemirror'
import 'codemirror/mode/clike/clike';

export default {
  name: 'file-container',
  mounted: function () {
    this.$el.querySelector('#editor')
    this.cm = CodeMirror.fromTextArea(this.$el.querySelector('#editor'), {
      lineNumbers: false,
      mode: 'text/x-java',
    });
    let that = this
    setTimeout(function(){that.cm.refresh()},100)
    this.file = this.filedata;
    this.container =  this.$el.querySelector('#wrapper');
    this.container.style.width=this.width+"vmin";
    this.container.style.height=this.height+"vmin";
    console.log("mounted" + this.file._id)

    this.connections();

  },
  props: {
    'filedata':{}
  },
  watch: {
    filedata: function (newfiledata) {
      let that = this
    this.cm.setValue(newfiledata.source)
    setTimeout(function(){that.cm.refresh()},100)
     
  // DOM updated
 
  this.file = this.filedata
      
       if(newfiledata){
     //  this.file = this.filedata; 
      // let block = this.$el.querySelector('code#code');
     //  hljs.highlightBlock(block);
         this.connections();

       }

      
    }
    // height: function(newH, oldH){
    //   // this.container.style.width=newH+"vmin";
    //   console.log("this changes height");
    //   console.log(this.container,newH);
    //   this.container.setAttribute("style","height="+newH+"vmin"+" width="+this.width+"vmin");
    //   console.log(this.container);
    // }
    },
  data: function () {
    return {
      file: {name:"Getting filname", source:"Loading source..."},
      'width':  80 ,
      'height':  80,
      title:"asfd",
      count: 0,
      cm:{}
    };
  },

  methods: {
    saveFileData(body){
    
    this.file = {
      name: body.name,
      extension: body.extension || "",
      type:  body.type || "",
      parent: body.parent || "",
      relations: body.relations || [],
      source: body.source || ""
    }

      },
      connections:function(){
         var self = this;
            this.$http({url: 'http://localhost:3000/api/files/'+ self.filedata._id +'?rel=count', method: 'GET'}).then(function (response) {
              console.log(response.body);
              self.count = response.body;
             
  }, function (response) {
      // error callback   
  }); 
      },
      update: function(event){
      var self = this;
      this.file.source = this.cm.getValue();
      this.$http({url: 'http://localhost:3000/api/files/'+ this.file._id, body:this.file, method: 'PUT'}).then(function (response) {

      // success callback
      
      this.cm.setValue(response.body.source);
      console.log(response.body);
      let that = this
      setTimeout(function(){that.cm.refresh()},100)
 

      }, function (response) {
      // error callback
  });
    },
        remove: function(event){
        var self = this;
        this.$http({url: 'http://localhost:3000/api/files/'+ this.file._id, method: 'DELETE'}).then(function (response) {

      // success callback
      self.cm.setValue("DELETED!");

      self.file = {};
  }, function (response) {
      // error callback
  });
    }
    ,
    focus: function(event){
      console.log("focus");
      event.preventDefault();
      event.stopPropagation();
      // this.container.setAttribute("style","height="+Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      //   +"px"+" width="+Math.max(document.documentElement.clientWidth, window.innerWidth || 0)+"px");
      this.height = 100;
      this.width = 50;
      // this.cm.setSize(this.width+, this.height-100); 

  }
}
}

</script>
<style src="codemirror/lib/codemirror.css">
</style>
<style src="codemirror/theme/monokai.css">
</style>
<style>
  .container-menu{
    /*background: rgba(255, 0, 0, 1);*/
    position: absolute;
    bottom: 0px;
    right: 0;
    width: 100%;
    height: 8%;
    background: grey;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: stretch;
  }
  .container-menu-top{
    /*background: rgba(255, 0, 0, 1);*/
    position: absolute;
    top: 0px;
    right: 0;
    width: 100%;
    height: 5%;
    background: #262626;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: stretch;
  }
  
  .btn:hover {
    background-color: #4d4d4d!important;
  }
  .exit-btn {
    background-color: #991f00;
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 2vmin;
    padding: 1.5vmin 1.5vmin;
    text-align: center;
    text-decoration: none;
    width: 10%;
  }
  .exit-btn:hover{
    background-color: #e62e00!important;
  }
  
  .btn {
    background-color: #262626;
    /*display: inline-block;*/
    flex-grow: 1;
    cursor: pointer;
    color: white;
    font-family: 'Helvetica Neue Thin',Helvetica, Arial;
    font-size: 140%;
    padding: 2%;
    width: auto;
    text-decoration: none;
    text-align: center;

  }
  .ctr {
    background-color: inherit;
    /*display: inline-block;*/
    flex-grow: 1;
    cursor: default;
    color: white;
    font-family: 'Helvetica Neue Thin',Helvetica, Arial;
    font-size: 2vmin;
    padding: 1.5vmin 1.5vmin;
    width: auto;
    text-decoration: none;
    text-align: right;

  }

  a:nth-child(2){
    border-left-style: solid;
    border-left-color: white;
    border-left-width: 1px;
  }
  
  #wrapper {
    background-color: #333333;
    width: 50vmin;
    height: 80vmin;
    margin: 10px;
    padding: 3vmin 3vmin 6vmin 3vmin;
    position: relative;
  }
 

  .CodeMirror pre {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }

  #code{
    word-wrap: break-word;
    height: 70vmin;
    width: 90%;
  }
  
  h1 {
    color: white;
    font-family: 'Helvetica Neue', Helvetica, Arial;
    font-weight: normal;
    text-align: center;
  }

.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    margin: 0 auto;
    
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

 </style>

<style src="../../node_modules/highlight.js/styles/atom-one-dark.css">
 </style>