<template>
  <div id="file-container">
    <div id="wrapper">
      <a href="#" v-on:click="remove" id="exit-btn">x</a>
      <h1>{{title}}</h1>
      <textarea name="code" id="code"></textarea>
      <a href="#" class="prev-btn" id="prev-btn">&lt</a>
      <a href="#" class="next-btn" id="next-btn">&gt</a>
      <a href="#" v-on:click="update" class="save-btn" id="save-btn">Save</a>

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

export default {
  name: 'file-container',
  mounted: function () {
    this.cm = CodeMirror.fromTextArea(this.$el.querySelector('#code'), {
      lineNumbers: true,
      mode: 'text/x-java',
    });
    this.cm.setSize(this.width, this.height-100);

    this.container =  this.$el.querySelector('#wrapper');

    this.container.style.width=this.width+"px";
    this.container.style.height=this.height+"px";

  },
  props: {
    'width': { default: 400 },
    'height': { default: 500 },
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
    },
  data: function () {
    return {
      cm: null,
      title: 'fileName.ext',
      file: {}
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
    self.cm.setValue(response.body.source);
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
    font-family: Arial;
    font-size: 10px;
    padding: 10px 10px;
    text-decoration: none;
    position: absolute;
    top: 0px;
    left: 0px;
  }
  
  #save-btn {
    background-color: #cc8800;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 21px;
    padding: 10px 10px;
    text-decoration: none;
    position: absolute;
    bottom: 0px;
    right: 25px;
  }
  
  #next-btn {
    background-color: #cc8800;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 25px;
    padding: 15px 5px;
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
    font-family: Arial;
    font-size: 25px;
    padding: 15px 5px;
    text-decoration: none;
    position: absolute;
    bottom: 30%;
    left: 0px;
  }
  
  #wrapper {
    background-color: #333333;
    width: 400px;
    height: 550px;
    margin: 10px;
    padding: 25px;
    position: relative;
  }
  
  h1 {
    color: white;
    font-family: 'Helvetica Neue', Helvetica, Arial;
    font-weight: normal;
    text-align: center;
  }
</style>