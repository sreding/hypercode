<template>
  <div id="file-container">
    <div id="wrapper">
      <a href="#" v-on:click="remove" id="exit-btn">x</a>
      <h1>{{title}}</h1>
      <code name="code" class="java.jsp" id="code">public static void main(){
        return "hello";
      }
      </code>
      <a href="#" class="prev-btn" id="prev-btn">&lt</a>
      <a href="#" class="next-btn" id="next-btn">&gt</a>
      <a href="#" v-on:click="update" class="save-btn" id="save-btn">Save</a>
      <a href="#" v-on:click="focus" class="focus-btn" id="focus-btn">Focus</a>
    </div>
  </div>
</template>

<script>
// enable ajax
var Vue = require('vue');
var VueResource = require('vue-resource');
Vue.use(VueResource);

import CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';

import hljs from 'highlight.js';

export default {
  name: 'file-container',
  mounted: function () {
    this.container =  this.$el.querySelector('#wrapper');
    this.container.style.width=this.width+"vmin";
    this.container.style.height=this.height+"vmin";
    var block = this.$el.querySelector('code#code');

    hljs.highlightBlock(block);
  },
  props: {
    'fileid':{default: "none"}
  },
  watch: {
    // whenever field changes, this function will run
    fileid: function (newFileid) {
      console.log("NEWFIELD", newFileid);
       if(newFileid!='none'){
       this.show(); // ready to insert the component
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
      cm: null,
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

  }, function (response) {
      // error callback
  });
    },
      update: function(event){
      var self = this;
      this.file.source = this.cm.getValue();
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
      self.cm.setValue("File deleted");
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

  .CodeMirror pre {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
  }
  
  h1 {
    color: white;
    font-family: 'Helvetica Neue', Helvetica, Arial;
    font-weight: normal;
    text-align: center;
  }

  /*

Atom One Dark by Daniel Gamage
Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax

base:    #282c34
mono-1:  #abb2bf
mono-2:  #818896
mono-3:  #5c6370
hue-1:   #56b6c2
hue-2:   #61aeee
hue-3:   #c678dd
hue-4:   #98c379
hue-5:   #e06c75
hue-5-2: #be5046
hue-6:   #d19a66
hue-6-2: #e6c07b

*/

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #abb2bf;
  background: #282c34;
}

.hljs-comment,
.hljs-quote {
  color: #5c6370;
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #c678dd;
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e06c75;
}

.hljs-literal {
  color: #56b6c2;
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta-string {
  color: #98c379;
}

.hljs-built_in,
.hljs-class .hljs-title {
  color: #e6c07b;
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #d19a66;
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #61aeee;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}
</style>