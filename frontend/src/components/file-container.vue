<template>
  <div id="file-container">
    <div id="wrapper">
      <a href="#" v-on:click="remove" id="exit-btn">x</a>
      <h1>{{title}}</h1>
      <code name="code" style=" overflow: scroll;" class="java.jsp" id="code">
        
      </code>
     <!--  <a href="#" class="prev-btn" id="prev-btn">&lt</a>
      <a href="#" class="next-btn" id="next-btn">&gt</a> -->
      <a href="#" v-on:click="update" class="save-btn" id="save-btn">Save</a>
      <a href="#" v-on:click="focus" class="focus-btn" id="focus-btn">Focus</a>
    </div>
  </div>
</template>

<script>
// enable ajax
let Vue = require('vue');
let VueResource = require('vue-resource');
Vue.use(VueResource);

import hljs from 'highlight.js';

export default {
  name: 'file-container',
  mounted: function () {
    this.container =  this.$el.querySelector('#wrapper');
    this.container.style.width=this.width+"vmin";
    this.container.style.height=this.height+"vmin";
    
    let block = this.$el.querySelector('code#code');
    hljs.highlightBlock(block);

    block.addEventListener("focusout", function(){
      hljs.highlightBlock(block);
    });
  },
  props: {
    'fileid':{default: null}
  },
  watch: {
    fileid: function (newFileid) {
      console.log("Reload: ", newFileid);
      
       if(newFileid!=null){
       this.show();
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
      title: 'fileName.ext',
      file: {},
      'width':  80 ,
      'height':  80
    };
  },

  methods: {
    saveFileData(body){
    
    this.data = {
      name: body.name,
      extension: body.extension || "",
      type:  body.type || "",
      parent: body.parent || "",
      relations: body.relations || [],
      source: body.source || ""
    }

      },

    show: function(event){
    var self = this;
    this.$http({url: 'http://localhost:3000/api/files/'+ this.fileid, method: 'GET'}).then(function (response) {
    
    // success callback
    self.title = response.body.name;
    this.saveFileData(response.body);
    
    let block = this.$el.querySelector('code#code');
    block.innerHTML = response.body.source;
    hljs.highlightBlock(block);

  }, function (response) {
      // error callback
  });
    },
      update: function(event){
      var self = this;
      this.$http({url: 'http://localhost:3000/api/files/'+ this.fileid, body:this.file, method: 'PUT'}).then(function (response) {

      // success callback
      self.cm.setValue(response.body.source);
      }, function (response) {
      // error callback
  });
    },
        remove: function(event){
        var self = this;
        this.$http({url: 'http://localhost:3000/api/files/'+ this.fileid, method: 'DELETE'}).then(function (response) {

      // success callback
      self.cm.setValue(response.body + "DELETE");
      this.data = {};
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
</style>
<style>

  #exit-btn {
    background-color: #991f00;
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 2vmin;
    padding: 1.5vmin 1.5vmin;
    text-decoration: none;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  
  #save-btn {
    background-color: #cc8800;
    display: inline-block;`
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 100%;
    padding: 1% 1%;
    text-decoration: none;
    position: absolute;
    bottom: 0px;
    right: 10%;
  }
  
  #next-btn {
    background-color: #cc8800;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 100%;
    padding: 10% 1%;
    text-decoration: none;
    position: absolute;
    bottom: 30%;
    right: 0px;
  }
  
  #prev-btn {
    background-color: #cc8800;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 100%;
    padding: 10% 1%;
    text-decoration: none;
    position: absolute;
    bottom: 30%;
    left: 0px;
  }
  #focus-btn{
    background-color: #cc8800;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 100%;
    padding: 1% 1%;
    text-decoration: none;
    position: absolute;
    bottom: 0px;
    right: 20%;
  }
  
  #wrapper {
    background-color: #333333;
    width: 50vmin;
    height: 80vmin;
    margin: 10px;
    padding: 3vmin 3vmin 6vmin 3vmin;
    position: relative;
  }

   #save-btn:hover{
    background: rgba(255, 60, 0, 0.9);
  }
  #back-btn:hover{
    background: rgba(255, 60, 0, 0.9);
  }
  #exit-btn:hover{
    background: rgba(255, 0, 0, 1);
  }
   #focus-btn:hover{
    background: rgba(255, 0, 0, 1);
  }

  .CodeMirror pre {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }

  #code{
    word-wrap: break-word;
  }
  
  h1 {
    color: white;
    font-family: 'Helvetica Neue', Helvetica, Arial;
    font-weight: normal;
    text-align: center;
  }

 </style>

<style src="../../node_modules/highlight.js/styles/atom-one-dark.css">
 </style>