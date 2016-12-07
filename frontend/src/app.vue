<template id="main-template">
<div id="app">
<div class="hidden">
<template v-for="(item,index) in horizontal">
  <file-container :id="index" class="hFileContainer" >{{index}}</file-container>
</template>
<template v-for="(item,index) in vertical">
  <file-container :id="index" class="vFileContainer" >{{index}}</file-container>
</template>
</div>

</div>
</template>
<!-- <div id="app"></div> -->
</template>

<script>

import FileContainer from './components/file-container.vue';
import * as THREE from 'three';
import * as TWEEN from 'tween.js';
// let TWEEN = require("tween.js")
/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CSS3DObject = function ( element ) {

  THREE.Object3D.call( this );

  this.element = element;
  this.element.style.position = 'absolute';

  this.addEventListener( 'removed', function ( event ) {

    if ( this.element.parentNode !== null ) {

      this.element.parentNode.removeChild( this.element );

    }

  } );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.CSS3DObject.prototype.constructor = THREE.CSS3DObject;

THREE.CSS3DSprite = function ( element ) {

  THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );
THREE.CSS3DSprite.prototype.constructor = THREE.CSS3DSprite;

//

THREE.CSS3DRenderer = function () {

  console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

  var _width, _height;
  var _widthHalf, _heightHalf;

  var matrix = new THREE.Matrix4();

  var cache = {
    camera: { fov: 0, style: '' },
    objects: {}
  };

  var domElement = document.createElement( 'div' );
  domElement.style.overflow = 'hidden';

  domElement.style.WebkitTransformStyle = 'preserve-3d';
  domElement.style.MozTransformStyle = 'preserve-3d';
  domElement.style.oTransformStyle = 'preserve-3d';
  domElement.style.transformStyle = 'preserve-3d';

  this.domElement = domElement;

  var cameraElement = document.createElement( 'div' );

  cameraElement.style.WebkitTransformStyle = 'preserve-3d';
  cameraElement.style.MozTransformStyle = 'preserve-3d';
  cameraElement.style.oTransformStyle = 'preserve-3d';
  cameraElement.style.transformStyle = 'preserve-3d';

  domElement.appendChild( cameraElement );

  this.setClearColor = function () {};

  this.getSize = function() {

    return {
      width: _width,
      height: _height
    };

  };

  this.setSize = function ( width, height ) {

    _width = width;
    _height = height;

    _widthHalf = _width / 2;
    _heightHalf = _height / 2;

    domElement.style.width = width + 'px';
    domElement.style.height = height + 'px';

    cameraElement.style.width = width + 'px';
    cameraElement.style.height = height + 'px';

  };

  var epsilon = function ( value ) {

    return Math.abs( value ) < Number.EPSILON ? 0 : value;

  };

  var getCameraCSSMatrix = function ( matrix ) {

    var elements = matrix.elements;

    return 'matrix3d(' +
      epsilon( elements[ 0 ] ) + ',' +
      epsilon( - elements[ 1 ] ) + ',' +
      epsilon( elements[ 2 ] ) + ',' +
      epsilon( elements[ 3 ] ) + ',' +
      epsilon( elements[ 4 ] ) + ',' +
      epsilon( - elements[ 5 ] ) + ',' +
      epsilon( elements[ 6 ] ) + ',' +
      epsilon( elements[ 7 ] ) + ',' +
      epsilon( elements[ 8 ] ) + ',' +
      epsilon( - elements[ 9 ] ) + ',' +
      epsilon( elements[ 10 ] ) + ',' +
      epsilon( elements[ 11 ] ) + ',' +
      epsilon( elements[ 12 ] ) + ',' +
      epsilon( - elements[ 13 ] ) + ',' +
      epsilon( elements[ 14 ] ) + ',' +
      epsilon( elements[ 15 ] ) +
    ')';

  };

  var getObjectCSSMatrix = function ( matrix ) {

    var elements = matrix.elements;

    return 'translate3d(-50%,-50%,0) matrix3d(' +
      epsilon( elements[ 0 ] ) + ',' +
      epsilon( elements[ 1 ] ) + ',' +
      epsilon( elements[ 2 ] ) + ',' +
      epsilon( elements[ 3 ] ) + ',' +
      epsilon( - elements[ 4 ] ) + ',' +
      epsilon( - elements[ 5 ] ) + ',' +
      epsilon( - elements[ 6 ] ) + ',' +
      epsilon( - elements[ 7 ] ) + ',' +
      epsilon( elements[ 8 ] ) + ',' +
      epsilon( elements[ 9 ] ) + ',' +
      epsilon( elements[ 10 ] ) + ',' +
      epsilon( elements[ 11 ] ) + ',' +
      epsilon( elements[ 12 ] ) + ',' +
      epsilon( elements[ 13 ] ) + ',' +
      epsilon( elements[ 14 ] ) + ',' +
      epsilon( elements[ 15 ] ) +
    ')';

  };

  var renderObject = function ( object, camera ) {

    if ( object instanceof THREE.CSS3DObject ) {

      var style;

      if ( object instanceof THREE.CSS3DSprite ) {

        // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

        matrix.copy( camera.matrixWorldInverse );
        matrix.transpose();
        matrix.copyPosition( object.matrixWorld );
        matrix.scale( object.scale );

        matrix.elements[ 3 ] = 0;
        matrix.elements[ 7 ] = 0;
        matrix.elements[ 11 ] = 0;
        matrix.elements[ 15 ] = 1;

        style = getObjectCSSMatrix( matrix );

      } else {

        style = getObjectCSSMatrix( object.matrixWorld );

      }

      var element = object.element;
      var cachedStyle = cache.objects[ object.id ];

      if ( cachedStyle === undefined || cachedStyle !== style ) {

        element.style.WebkitTransform = style;
        element.style.MozTransform = style;
        element.style.oTransform = style;
        element.style.transform = style;

        cache.objects[ object.id ] = style;

      }

      if ( element.parentNode !== cameraElement ) {

        cameraElement.appendChild( element );

      }

    }

    for ( var i = 0, l = object.children.length; i < l; i ++ ) {

      renderObject( object.children[ i ], camera );

    }

  };

  this.render = function ( scene, camera ) {

    var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.getEffectiveFOV() * 0.5 ) ) * _height;

    if ( cache.camera.fov !== fov ) {

      domElement.style.WebkitPerspective = fov + "px";
      domElement.style.MozPerspective = fov + "px";
      domElement.style.oPerspective = fov + "px";
      domElement.style.perspective = fov + "px";

      cache.camera.fov = fov;

    }

    scene.updateMatrixWorld();

    if ( camera.parent === null ) camera.updateMatrixWorld();

    camera.matrixWorldInverse.getInverse( camera.matrixWorld );

    var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
      " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

    if ( cache.camera.style !== style ) {

      cameraElement.style.WebkitTransform = style;
      cameraElement.style.MozTransform = style;
      cameraElement.style.oTransform = style;
      cameraElement.style.transform = style;

      cache.camera.style = style;

    }

    renderObject( scene, camera );

  };

};




var Vue = require('vue');
var VueResource = require('vue-resource');
Vue.use(VueResource);
let scene,camera,renderer;
function render(){
  renderer.render(scene,camera)
}
function animate(time) {

        requestAnimationFrame( animate );

        TWEEN.update(time);
        render()
  }

function rotationFunction(object,axis,angle,o){

  let old_position = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
  
  let rotationMatrix=new THREE.Matrix4();
  return function(time){
    rotationMatrix = rotationMatrix.makeRotationAxis( axis.normalize(), o.a );
    // console.log(angle*time)
    var newPos = old_position.clone().applyMatrix4(rotationMatrix);
    object.position.x = newPos.x;
    object.position.y = newPos.y;
    object.position.z = newPos.z;

  }

}
function rotateAboutWorldAxis(object, axis, angle) {
      var rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationAxis( axis.normalize(), angle );
      var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
      var newPos = currentPos.applyMatrix4(rotationMatrix);
      object.position.x = newPos.x;
      object.position.y = newPos.y;
      object.position.z = newPos.z;
}

export default {
  name: 'app',
  components: {
    'file-container': FileContainer
  },
  mounted: function () {
    this.list()
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 1500);

    
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.body.appendChild(renderer.domElement);

    // makes first element go in front and the rest in 
    this.setUpHorizontalCircle(800,(2*Math.PI)/this.horizontal.length,-Math.PI/2)
    this.setUpVerticalCircle(800,(2*Math.PI)/this.horizontal.length,-Math.PI/2)


    let that = this;
    window.onclick = function(){
      console.log("asfds")
      let d = 2000
      let angle=Math.PI/4//45 deg
      let axis = new THREE.Vector3(   0,1 ,0 )
      that.hSprites.forEach(function(item){
        let o = {a:0}
        new TWEEN.Tween(o)
        .to({a:angle},d)
        .easing(TWEEN.Easing.Exponential.InOut)
        .onUpdate(rotationFunction(item,axis,angle,o))
        .start()
      })
      let axis2= new THREE.Vector3(   1,0 ,0 )
      that.vSprites.forEach(function(item){
        let o = {a:0}
        new TWEEN.Tween(o)
        .to({a:angle},d)
        .easing(TWEEN.Easing.Exponential.InOut)
        .onUpdate(rotationFunction(item,axis2,angle,o))
        .start()
      })
      requestAnimationFrame(animate)
     
    }

    renderer.render( scene, camera );

    
  },
  created: function (){
      this.mainFile = "none";
      
  },
  data () {
    return {
      hSprites:[],
      vSprites:[],
      stage:{},
      id1 : "none",
      id2 : "none",
      id3 : "none",
      horizontal:["some code maybe","id","aa","a","some code maybe","id","aa","a"],
      vertical:["some code maybe","id","aa","a","some code maybe","id","aa","a"]
    }
  },
  watch: {
    horizontal:function(){
      console.log("xD")
    }
  },
  methods:{
    setUpHorizontalCircle:function(r,angle,offsetAngle){
      let elements = this.$el.querySelectorAll(".hFileContainer")
      elements.forEach((item, i)=>{

        let sprite = new THREE.CSS3DObject( item );
        let x = r * Math.cos(offsetAngle)
        let z = -r * Math.sin(offsetAngle)
        console.log(x,z)
        offsetAngle+=angle
        sprite.position.set(x,0, z)
        // rotateAboutWorldAxis(sprite,new THREE.Vector3(   1, 0,0 ),(Math.PI/180)*25 ) //tilted circle by 25 deg
        scene.add(sprite)
        this.hSprites.push(sprite)
      })
    },
    setUpVerticalCircle:function(r,angle,offsetAngle){
      let elements = this.$el.querySelectorAll(".vFileContainer")
      let sprites=[]
      elements.forEach((item, i)=>{

        let sprite = new THREE.CSS3DObject( item );
        let y = r * Math.cos(offsetAngle)
        let z = -r * Math.sin(offsetAngle)
        offsetAngle+=angle
        sprite.position.set(0,y, z)
        // rotateAboutWorldAxis(sprite,new THREE.Vector3(   1, 0,0 ),(Math.PI/180)*25 ) //tilted circle by 25 deg
        scene.add(sprite)
        this.vSprites.push(sprite)
      })

    },
    //Ajax calls
    preload:function(){
        var item1 = {
        name: "Code1.java",
        extension: "java",
        type: "class",
        source: "public void HelloWorld{ return 'Hello World!' }", };

        var id1;

      this.$http({url: 'http://localhost:3000/api/files/', method: 'POST', body: item1}).then(function (response) {
      // success callback
      id1 = response.body._id;
      this.id1 = id1;

        var item2 = {
        name: "Code2.java",
        extension: "java",
        type: "class",
        source: "public void HelloWorld{ return 'Hello World!' }", };

        var id2;

           this.$http({url: 'http://localhost:3000/api/files/', method: 'POST', body: item2}).then(function (response) {
      // success callback
      id2 = response.body._id;
      this.id3 = id2;

        var item3 = {
        name: "Code3.java",
        extension: "java",
        type: "class",
        relations:[id1, id2],
        source: "public void HelloWorld{ return 'Hello World!' }", };

        var id3;

         this.$http({url: 'http://localhost:3000/api/files/', method: 'POST', body: item3}).then(function (response) {
      // success callback
      id3 = response.body._id;
      this.id2 = id3;

       }, function (response) {
      // error callback   
      });

       }, function (response) {
      // error callback   
      });

       }, function (response) {
      // error callback   
      }); 

        

        var item2 = {
        name: "Filename",
        extension: "java",
        type: "class",
        source: "public void HelloWorld{ return 'Hello World!' }", };
    },

        list: function(event){
         var self = this; 
        this.$http({url: 'http://localhost:3000/api/files/', method: 'GET'}).then(function (response) {
      // success callback
      if(response.body.length < 1){
          self.preload();
      }
      else{
        console.log(response.body);
        var id1 = response.body[0]._id;
        console.log(id1)
        var id3 = response.body[1]._id;
        var id2 = response.body[2]._id;

        this.id1 = id1;
        this.id2 = id2;
        this.id3 = id3;
      }
  }, function (response) {
      // error callback   
  }); 
    },  
        create: function(data){
             var self = this;
        //dummy object

      this.$http({url: 'http://localhost:3000/api/files/', method: 'POST', body: data}).then(function (response) {
      // success callback
  }, function (response) {
      // error callback   
  }); 

      
    },
      relations:function(event){
      var self = this;
      console.log(this.mainFile);
            this.$http({url: 'http://localhost:3000/api/files/'+ this.mainFile +'?rel=1', method: 'GET'}).then(function (response) {
    
    // success callback
  
    self.id2 = response.body._id;
    self.id1 = response.body.relations[0];
    self.id3 = response.body.relations[1];
    console.log(self.id2);
    console.log("props changed");
    console.log(response.body);

  }, function (response) {
      // error callback   
  }); 
    },
  }   
  
}
</script>

<style>
#stage{
  width:90vw;
  height:90vh;
  /*background-color:lightblue;*/
}
/*file-container{
  position:absolute;
}*/
.contentWrapper{
  position: absolute;
  transition: all 2s;
}
/*.fileContainer{
  background-color: red;
  position:absolute;
  transition: all 2s;
}*/
.hidden{
display: none;
}
.three-div{
    background: #BADA55;
    color: #E50000;
    font-family: Arial, Helvetica, Sans-serif;
    font-size: 2em;
    padding: 2em;
}
</style>
