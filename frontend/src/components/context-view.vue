<template id="main-template">
<div id="context-view">
<div class="hidden">
</div>

<div class="hidden">

<!-- <template id="horizontalTemplate" v-for="(item,index) in horizontal"> -->
  <file-container :filedata="item" v-for="(item,index) in horizontal"   :key="Math.random()*1000000" class="hFileContainer" >{{index}}</file-container>
  <!-- <div class="hFileContainer three-div" contenteditable="true">asdfasdfasdfasdfasdf</div> -->
<!-- </template> -->
  

<!-- <template id="verticalTemplate" v-for="(item,index) in vertical"> -->
  <file-container :filedata="item" v-for="(item,index) in vertical"   :key="Math.random()*1000000" class="vFileContainer" >{{index}}</file-container>
  <file-container v-for="(item,index) in maindata" :filedata="item" :key="Math.random()*1000000"  class="main-container" ></file-container>
  <!-- <div class="vFileContainer three-div" contenteditable="true">asasdfasdfasdfasdfdf</div> -->
<!-- </template> -->
</div>

<div class="container-menu-top">
    <a  v-on:click="clearStage()" class="task-btn" id="backToOverview">Overview</a>
    <a id="zoomButton"  class="task-btn">Zoom</a>
    <a id="rotateBack"  v-on:click="rotateBackToMainFile()" class="task-btn">RotateBack</a>
      </div>

</div>

</template>
<!-- <div id="app"></div> -->
</template>

<script>

import FileContainer from './file-container.vue';
import * as THREE from 'three';
import * as TWEEN from 'tween.js';

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


let Vue = require('vue');
let VueResource = require('vue-resource');
Vue.use(VueResource);
let scene,camera,renderer,hcontainer,vcontainer;

//keycodes
const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40


function render(){
  renderer.render(scene,camera)
}
function animate(time) {

        requestAnimationFrame( animate );

        TWEEN.update(time);
        render()
  }

//returns a function for tween to use on update
function rotationFunction(object,axis,to){

  let old_position = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
  
  let rotationMatrix=new THREE.Matrix4();
  return function(time){
    rotationMatrix = rotationMatrix.makeRotationAxis( axis.normalize(), to.angle );
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

function MainFile(sprite,vLength,hLength,vRadius,hRadius){
  this.sprite = sprite
  this.vPos=0 //pos
  this.hPos=0 //pos
  this.vLength=vLength+1
  this.hLength=hLength+1
  this.rotatingVertical = false
  this.rotatingHorizontal = false
  this.verticalRotateable = function(){
    return (this.hPos%this.hLength) === 0
  }
  this.horizontalRotateable = function(){
    return (this.vPos%this.vLength) === 0
  }
  this.inFront = function(){
    return ((this.hPos%this.hLength) === 0) && ((this.vPos%this.vLength) === 0)
  }
  this.updatePos=function(){
    this.vPos%=this.vLength
    this.hPos%=this.hLength
  }
  this.clear=function(newVLength,newHLength){
    this.sprite.position.z=0
    this.sprite.position.y=0
    this.sprite.position.x=0
    this.vLength=newVLength+1
    this.hLength=newHLength+1
    this.rotatingVertical = false
    this.rotatingHorizontal = false
    this.vPos=0 //pos
    this.hPos=0 //pos
  }
  this.remove = function(){
    scene.remove(this.sprite)
  }


}
renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.body.appendChild(renderer.domElement);
  renderer.domElement.style.display="none"//blocks other elements from being clicked otherwise

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
      }
window.addEventListener("resize",onWindowResize)

scene = new THREE.Scene();
    // let rH = 2000
    // let rV = 800
camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0,2*window.innerHeight);
scene.add(camera)


renderer.render( scene, camera );
    requestAnimationFrame(animate)



export default {
  name: 'context-view',
  components: {
    'file-container': FileContainer
  },
  mounted: function () {
    renderer.domElement.style.display=""

    
    
    

    
    
    hcontainer = new THREE.CSS3DObject(document.createElement("div"));
    vcontainer = new THREE.CSS3DObject(document.createElement("div"));

    vcontainer.position.z=-this.rV //makes the main content always be in the z=0 plane
    hcontainer.position.z=-this.rH //makes the main content always be in the z=0 plane

    scene.add(hcontainer)
    scene.add(vcontainer)


    

   

    // makes first element go in front and the rest in 
    // let hAngleBetween = (2*Math.PI)/(this.horizontal.length+1) //+1 for main file
    // let vAngleBetween = (2*Math.PI)/(this.vertical.length+1)

    // this.setUpHorizontalCircle(rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
    // this.setUpVerticalCircle(rV,vAngleBetween,-Math.PI/2+vAngleBetween)
    

    // this.setUpMain();

    let that = this;
    // document.$el.addEventListener("keydown", this.handleKeyEvent.bind(this));
    document.onkeydown = this.handleKeyEvent.bind(this)
  
    

    this.setUpZoom()
    // this.setup()
    that.mainid = that.$route.params.id    
  //   this.$route.beforeRouteLeave=function (to, from, next) {
  //   // called when the route that renders this component is about to
  //   // be navigated away from.
  //   // has access to `this` component instance.
  //   console.log("bye")
  // }
},
  created: function (){
      this.mainFile = "none";

  },
  data () {
    return {
      rH:2000,
      rV:900,
      hSprites:[], // horizontal sprites
      vSprites:[],  // vertical sprites
      mainid: null, // id of main file

      vLocked:false,
      hLocked:false,

      sync:0,//used to call a function after both vertical and horizontal heve been called
      maindata: [], //main data file
      main:null, // keeping track of main sprite and general state of rotations
      rotationsRunning:0,
      horizontal:[], //horizontal 
      vertical:[],
      hFiles:[],
      vFiles:[],
      tempMainData:{}
    }
  },
  beforeRouteLeave:function (to, from, next) {
    this.clearEverything()
      if(this.main !== null){
        hcontainer.remove(this.main.sprite)
        vcontainer.remove(this.main.sprite)
        scene.remove(this.main.sprite)
        this.main.sprite=null
      }
      
      renderer.domElement.style.display="none"
      document.onkeydown = undefined

    next()
  },

  watch: {
    $route:function(){
      this.mainid=this.$route.params.id
      scene.remove(this.main.sprite)
      // this.main.sprite=null
    },
    maindata:function(){
      let that = this
      Vue.nextTick(function(){
        let element = that.$el.querySelector(".main-container");
        
        if(that.main !== null){
          scene.add(that.main.sprite)
          that.main.remove()
          that.main.sprite=null
        }
        // that.main.remove()
        let sprite = new THREE.CSS3DObject( element );
        scene.add(sprite)

        that.main=new MainFile(sprite,that.vertical.length,that.horizontal.length,0,0)
   
      })
    },
    vertical:function(){
      let that = this
      Vue.nextTick(function () {
        let vAngleBetween = (2*Math.PI)/(that.vertical.length+1)
        that.setUpVerticalCircle(that.rV,vAngleBetween,-Math.PI/2+vAngleBetween)
        while(that.maindata.length !== 0){
                that.maindata.pop()
              }
              
        that.maindata.push(that.tempMainData);
        
    })
    },
    horizontal:function(){
      let that = this
      Vue.nextTick(function () {
        let hAngleBetween = (2*Math.PI)/(that.horizontal.length+1)
         that.setUpHorizontalCircle(that.rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
         
         if(that.vFiles.length ===0){
          that.reloadVertical()
         }
         while (that.vertical.length!==0){
            that.vertical.pop()
          }

          // load vertical
         
         for(let i = 0; i<that.vFiles.length;i++){
          that.vertical.push(that.vFiles[i])
         }
         that.vFiles=[]

    })
    },
    mainid:function(){  
      console.log(this.mainid)
      this.clearEverything()
      //this.relations();
      this.hSprites=[]
      this.vSprites=[]
      this.rotationsRunning=0
      this.relations()


      
      
      // this.horizontal = ["1 code", "maybe"]''

    
    }
  },
  methods:{
    update:function(){
      let that = this
      while (that.horizontal.length!==0){
            that.horizontal.pop()
          }
      for(let i = 0; i<that.hFiles.length;i++){
          that.horizontal.push(that.hFiles[i])
         }
        this.hFiles=[]

    },
    setup:function(){
      // makes first element go in front and the rest in 
    let hAngleBetween = (2*Math.PI)/(this.horizontal.length+1) //+1 for main file
    let vAngleBetween = (2*Math.PI)/(this.vertical.length+1)

    this.setUpHorizontalCircle(this.rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
    this.setUpVerticalCircle(this.rV,vAngleBetween,-Math.PI/2+vAngleBetween)
    this.setUpMain()

    },
    reloadCircles:function(){
      let vAngleBetween = (2*Math.PI)/(this.vertical.length+1)
      this.setUpVerticalCircle(this.rV,vAngleBetween,-Math.PI/2+vAngleBetween)
      let hAngleBetween = (2*Math.PI)/(this.horizontal.length+1)  
      this.setUpHorizontalCircle(this.rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
    },
    setUpHorizontalCircle:function(r,angle,offsetAngle){
      let elements = this.$el.querySelectorAll(".hFileContainer")
      elements.forEach((item, i)=>{

        let sprite = new THREE.CSS3DObject( item );
        let x = r * Math.cos(offsetAngle)
        let z = -r * Math.sin(offsetAngle)

        offsetAngle+=angle
        sprite.position.set(x,0, z)

        hcontainer.add(sprite)
        this.hSprites.push(sprite)
      })
    },
    setUpVerticalCircle:function(r,angle,offsetAngle){
      let elements = this.$el.querySelectorAll(".vFileContainer")
      elements.forEach((item, i)=>{
        let sprite = new THREE.CSS3DObject( item );
        let y = r * Math.cos(offsetAngle)
        let z = -r * Math.sin(offsetAngle)
        offsetAngle+=angle
        sprite.position.set(0,y, z)
        vcontainer.add(sprite)
        this.vSprites.push(sprite)
      })

    },
    setUpMain:function(){
      let element = document.querySelector("#main-container");
      let sprite = new THREE.CSS3DObject( element );
      scene.add(sprite)

      this.main=new MainFile(sprite,this.vertical.length,this.horizontal.length,0,0)
    },
    reloadHorizontal:function(){
      let that = this
      Vue.nextTick(function () {
        let hAngleBetween = (2*Math.PI)/(that.horizontal.length+1)
         that.setUpHorizontalCircle(that.rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
         
         
         while (that.vertical.length!==0){
            that.vertical.pop()
          }

          // load vertical
         
         for(let i = 0; i<that.vFiles.length;i++){
          that.vertical.push(that.vFiles[i])
         }
         that.vFiles=[]

    })
    },
    reloadVertical:function(){
      let that = this
      Vue.nextTick(function () {
        let vAngleBetween = (2*Math.PI)/(that.vertical.length+1)
        that.setUpVerticalCircle(that.rV,vAngleBetween,-Math.PI/2+vAngleBetween)
        while(that.maindata.length !== 0){
                that.maindata.pop()
              }
              
        that.maindata.push(that.tempMainData);
        
    })
    },
    handleKeyEvent:function(e){
      let d = 300
      let that = this
      if(this.rotationsRunning !== 0){
        return
      }

      if(e.keyCode === RIGHT || e.keyCode === LEFT){
        let targetAngle = (2*Math.PI)/(that.horizontal.length+1)
       
        if(!this.main.horizontalRotateable() ){
          return
        }
        if(this.main.inFront()){
          this.toggleLock("v")
        }
         if(e.keyCode == LEFT){
          targetAngle*=-1
          this.main.hPos-=1
        }else{
          this.main.hPos+=1
        }
        this.main.updatePos()
        if(this.main.inFront()){
          this.toggleLock("v")
        }//vcontainer.children[0].element)
        if(hcontainer.children.indexOf(this.main.sprite)===-1){
          vcontainer.remove(this.main.sprite)
          hcontainer.add(this.main.sprite)
          this.main.sprite.position.z= this.rH//rH
          this.main.sprite.element.classList.remove("fadeIn")
        }
        this.animateRotation(this.hSprites, new THREE.Vector3(0,1,0), targetAngle, d )

      }
      else if(e.keyCode === UP || e.keyCode === DOWN){
        let targetAngle = (2*Math.PI)/(that.vertical.length+1)
        
        if(!this.main.verticalRotateable() ){
          return
        }
        //move after lock
        if(this.main.inFront()){
          this.toggleLock("h")
        }
        if(e.keyCode===UP){
          targetAngle*=-1
          this.main.vPos-=1
        }else{
          this.main.vPos+=1
        }
        this.main.updatePos()
        if(this.main.inFront()){
          this.toggleLock("h")
        }
        if(vcontainer.children.indexOf(this.main.sprite)===-1){
          hcontainer.remove(this.main.sprite)
          vcontainer.add(this.main.sprite)
          this.main.sprite.position.z= this.rV//rH
          this.main.sprite.element.classList.remove("fadeIn")
        }
        
        this.animateRotation(this.vSprites, new THREE.Vector3(1,0,0), targetAngle, d )
      }
    },
    toggleLock:function(direction){
      let elements;
      if("v" == direction){
        elements = this.vSprites
      }else{
        elements = this.hSprites
      }
      elements.forEach(function(item){
        item.element.classList.toggle("locked")
      })
    },
    animateRotation:function(elements, axis, targetAngle,duration){
      let tweenObject ={angle:0} //goes from 0 to target angle according to tweening function
        let that=this
        elements.forEach(function(item){
          that.rotationsRunning+=1
          new TWEEN.Tween(tweenObject)
            .to({angle:targetAngle}, duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(rotationFunction(item,axis,tweenObject))
            .onComplete(that.changeNumberOfAnimations(-1).bind(that))
            .start()
            
        })
        this.rotationsRunning+=1
        new TWEEN.Tween(tweenObject)
            .to({angle:targetAngle}, duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(rotationFunction(this.main.sprite,axis,tweenObject))
            .onComplete(that.changeNumberOfAnimations(-1).bind(that))
            .start()
    },
    changeNumberOfAnimations:function(val){
      return function(){
      this.rotationsRunning+=val
      }
      
    },

    setUpZoom(){
      let toggle = true
      let near = window.innerHeight/1.5
      let far = 2*window.innerHeight;
      let tweenAmount
      camera.position.z=far
      this.$el.querySelector("#zoomButton").onclick=function(){
        if(toggle){
          tweenAmount=near
        }else{
          tweenAmount=far
        }
        toggle = !toggle
        let tweenObject={z:camera.position.z}
        new TWEEN.Tween(tweenObject)
            .to({z:tweenAmount}, 500)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate(function(){
              camera.position.z=tweenObject.z;
              camera.updateProjectionMatrix()})
            .start()
      }
    },

    clearEverything:function(element){ //css3dobject
      
      // this.main.clear()
      let i = 0
      this.hSprites.forEach(function(item){
        hcontainer.remove(item)
        i++
      })
      i=0
      this.vSprites.forEach(function(item){
        vcontainer.remove(item)
        i++
      })
  },
    clearChildren:function(element){
      for( var i = element.children.length - 1; i >= 0; i--) { 
        
        element.remove(element.children[i])
      }
    },
    clearStage:function(){
      this.clearEverything()
      if(this.main !== null){
        hcontainer.remove(this.main.sprite)
        vcontainer.remove(this.main.sprite)
        scene.remove(this.main.sprite)
        this.main.sprite=null
      }
      
      
      
      
      this.$router.push("/")
      
      renderer.domElement.style.display="none"
      document.onkeydown = undefined

    },
    rotateBackToMainFile:function(){
      let d = 500
      if(this.main == null){
        return
      }
      if(Math.abs(this.main.hPos)>0){
        let targetAngle = (2*Math.PI)/(this.hSprites.length+1)
        let x = this.main.hPos
        this.animateRotation(this.hSprites, new THREE.Vector3(0,1,0), -x*targetAngle, d )
        this.main.clear(this.vSprites.length,this.hSprites.length)
        this.toggleLock("v")
        
      }else if(Math.abs(this.main.vPos)>0){
        let targetAngle = (2*Math.PI)/(this.vSprites.length+1)
        let x = this.main.vPos
        this.animateRotation(this.vSprites, new THREE.Vector3(1,0,0), -x*targetAngle, d )
        this.main.clear(this.vSprites.length,this.hSprites.length)
        this.toggleLock("h")
      }

    },

  

      relations:function(){
        let self = this;



            this.$http({url: 'http://localhost:3000/api/files/'+ self.mainid +'?rel=all', method: 'GET'}).then(function (response) {
           
              let hdata = [];
              console.log(response.body)
              
              let hrelations = response.body.horizontal;

              
              self.tempMainData = response.data.mainfile
              for(let i = 0; i < hrelations.length; i++){
                
                let hrelation = hrelations[i];
                
                if(hrelation._id != self.mainid){
                self.hFiles.push(hrelation);
                }
              }

              if(self.hFiles.length==0){ //force update
                self.reloadHorizontal()
              }

              

          

               let vdata = [];
                let vrelations = response.body.vertical;
                for(let j = 0; j < vrelations.length; j++){
                let vrelation = vrelations[j];
         
                if(vrelation._id != self.mainid){
                self.vFiles.push(vrelation)
                }
                
                }
                self.update()

               

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
.main-container #wrapper{
  border-left-style: solid;
  border-left-color: #6699ff;
  border-left-width: 20px;
  border-right-style: solid;
  border-right-color: #6699ff;
  border-right-width: 20px;
  
}

.locked{
  opacity: 0.8;
}
/*.main-container .btn{
  background-color: #ff00ff;
}*/
 .main-container .btn:hover {
    background-color: #000033!important;
  }
/*.fileContainer{
  background-color: red;
  position:absolute;
  transition: all 2s;
}*/
.hidden{
display: none;
}
.task-btn {
    /*background-color: #666699;*/
    background-color: #990000;
    cursor: pointer;
    color: #ffffff;
    font-family: Helvetica, Arial;
    font-size: 2vmin;
    padding: 1.5vmin 1.5vmin;
    text-decoration: none;
    /*position: absolute;*/
    top: 0px;
    left: 0px;
    z-index: 10;
  }
  .task-btn:hover{
    background-color: #660000!important;
  }

body{
  /*background-image: url("http://bennettfeely.com/gradients/img/gradient.jpg");*/
  background: #f0b7a1;
background: #efefef;
background: -moz-radial-gradient(center, ellipse cover,  #efefef 0%, #afafaf 100%);
background: -webkit-radial-gradient(center, ellipse cover,  #efefef 0%,#afafaf 100%);
background: radial-gradient(ellipse at center,  #efefef 0%,#afafaf 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#efefef', endColorstr='#afafaf',GradientType=1 );


  background-color: #0086b3;
 overflow: hidden;

}
.three-div{
    background: #BADA55;
    color: #E50000;
    font-family: Arial, Helvetica, Sans-serif;
    font-size: 2em; 
    padding: 2em;
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


</style>
