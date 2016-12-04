<template>
  <div id="file-container" >
  <div id="wrapper">
  <a href="#" id="exit-btn">x</a>
  <h1>{{title}}</h1>
    <textarea name="code" id="code">{{text}}</textarea>
    <a href="#" v-on:click="prev.stop" id="prev-btn">&lt</a>
    <a href="#" v-on:click="next.stop" id="next-btn">&gt</a>
    <a href="#" v-on:click="update.stop" id="save-btn">Save</a>

  </div>
  </div>
</template>

<script>
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

    this.relations();
  },
  props: {
    'width': { default: 400 },
    'height': { default: 500 },
    'code': {default:"hello world"}
  },
  data: function () {
    return {
      cm: null,
      title: 'fileName.java',
      text: 'hello world'
    };
  },
  methods: {
    list: function(event){
         var self = this; 
    this.$http({url: 'http://localhost:3000/api/files/', method: 'GET'}).then(function (response) {
      // success callback
      var string = "";
      for(var i = 0; i < response.body.length; i++){
        string = string + response.body[i].source + "\n\n";
      }
      self.cm.setValue(string);
  }, function (response) {
      // error callback   
  }); 
    },
         show: function(event){
               var self = this;
            this.$http({url: 'http://localhost:3000/api/files/58447d87e9846e43e4a19ea1', method: 'GET'}).then(function (response) {
      // success callback
      console.log(response);
      self.cm.setValue(response.body.source + " SHOW");
  }, function (response) {
      // error callback   
  }); 
    },
    relations:function(event){
 var self = this;
            this.$http({url: 'http://localhost:3000/api/files/58447d87e9846e43e4a19ea1?rel=1', method: 'GET'}).then(function (response) {
      // success callback
      var string = response.body.source + " REL \n\n";
        for(var i = 0; i < response.body.relations.length; i++){
        string = string + response.body.relations[i].source + "\n\n";
      }

      self.cm.setValue(string);
  }, function (response) {
      // error callback   
  }); 
    },
        create: function(event){
             var self = this;
        //dummy object
        var data = {
        name: "Filename",
        type: "class",
        source: "public void HelloWorld{ return 'Hello World!' }", };

      this.$http({url: 'http://localhost:3000/api/files/', method: 'POST', body: data}).then(function (response) {
      // success callback
      self.cm.setValue(response.body.source + " POST");
  }, function (response) {
      // error callback   
  }); 

      
    },
      update: function(event){
             var self = this;
        this.$http({url: 'http://localhost:3000/api/files/58447d87e9846e43e4a19ea1', method: 'PUT'}).then(function (response) {
      // success callback
      self.cm.setValue(response.body.source + " UPDATE");
      }, function (response) {
      // error callback   
  }); 
    },
        remove: function(event){
               var self = this;
        this.$http({url: 'http://localhost:3000/api/files/58447d87e9846e43e4a19ea2', method: 'DELETE'}).then(function (response) {
      // success callback
      self.cm.setValue(response.body + "DELETE");
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
#exit-btn{
  background-color:#991f00;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:10px;
  padding:10px 10px;
  text-decoration:none;
  position:absolute;
  top:0px;
  left:0px;
}

#save-btn{
  background-color:#cc8800;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:21px;
  padding:10px 10px;
  text-decoration:none;
  position:absolute;
  bottom:0px;
  right:25px;
}

#next-btn{
  background-color:#cc8800;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:25px;
  padding:15px 5px;
  text-decoration:none;
  position:absolute;
  bottom:30%;
  right:0px;
}

#prev-btn{
  background-color:#cc8800;
  display:inline-block;
  cursor:pointer;
  color:#ffffff;
  font-family:Arial;
  font-size:25px;
  padding:15px 5px;
  text-decoration:none;
  position:absolute;
  bottom:30%;
  left:0px;
}

#wrapper{
  background-color:#333333;
  width:400px;
  height: 550px;
  margin:10px;
  padding:25px;
  position:relative;
}
h1{
  color:white;
  font-family:'Helvetica Neue', Helvetica, Arial;
  font-weight:normal;
  text-align:center;
}
</style>