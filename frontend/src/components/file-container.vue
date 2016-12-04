<template>
  <div id="file-container">
    <textarea name="code" id="code"></textarea>
    <button v-on:click="list">List</button>
    <button v-on:click="show">Show</button>
     <button v-on:click="relations">Relations</button>
    <button v-on:click="create">Create</button>
    <button v-on:click="update">Update</button>
    <button v-on:click="remove">Remove</button>
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
    this.cm.setSize(this.width, this.height);
  },
  props: {
    'width': { default: 600 },
    'height': { default: 400 },
  },
  data: function () {
    return {
      cm: null,
      title: '',
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

<style src="codemirror/lib/codemirror.css"></style>