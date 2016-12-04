<template>
  <div id="file-container" >
  <div class="wrapper">
  <a href="#" class="exit-btn">x</a>
  <h1>{{title}}</h1>
    <textarea name="code" id="code">{{text}}</textarea>
    <a href="#" class="prev-btn">&lt</a>
    <a href="#" class="next-btn">&gt</a>
    <a href="#" class="save-btn">Save</a>

  </div>
  </div>
</template>

<script>
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
    if(this.height < 500){
        this.hideButtons();
      }else{
        this.showButtons();
      }
    this.container.style.width=this.width+"px";
    this.container.style.height=this.height+"px";
    
  },
  props: {
    'width': { default: 400 },
    'height': { default: 500 },
    'text':{default: 'hello world'},
    'title': {default:'fileName.java'}
  },
  data: function () {
    return {
      cm: null,
    };
  },
  methods:{
    hideButtons: function(){
      this.$el.querySelector('.prev-btn').style.visibility = "hidden";
      this.$el.querySelector('.next-btn').style.visibility = "hidden";
      this.$el.querySelector('.exit-btn').style.visibility = "hidden";
      this.$el.querySelector('.save-btn').style.visibility = "hidden";
    },
    showButtons: function(){
      this.$el.querySelector('.prev-btn').style.visibility = "visible";
      this.$el.querySelector('.next-btn').style.visibility = "visible";
      this.$el.querySelector('.exit-btn').style.visibility = "visible";
      this.$el.querySelector('.save-btn').style.visibility = "visible";
    } 
  },
  watch:{
    height: function (val, oldVal) {
      if(val < 500){
        this.hideButtons();
      }else{
        this.showButtons();
      }
      
      console.log(val);
    }
  }
  
    
}
</script>

<style src="codemirror/lib/codemirror.css">

</style>
<style>
.exit-btn{
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

.save-btn{
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

.next-btn{
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

.prev-btn{
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

.wrapper{
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