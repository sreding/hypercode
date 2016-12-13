<template id="main-template">
<div id="context-view">
<div class="hidden">
<!-- <template id="horizontalTemplate" v-for="(item,index) in horizontal"> -->
  <file-container v-for="(item,index) in horizontal"   :key="Math.random()*40000" class="hFileContainer" >{{index}}</file-container>
  <!-- <div class="hFileContainer three-div" contenteditable="true">asdfasdfasdfasdfasdf</div> -->
<!-- </template> -->
<file-container  id="main-container" ></file-container>
<!-- <template id="verticalTemplate" v-for="(item,index) in vertical"> -->
  <file-container v-for="(item,index) in vertical"   :key="Math.random()*40000" class="vFileContainer" >{{index}}</file-container>

  <!-- <div class="vFileContainer three-div" contenteditable="true">asasdfasdfasdfasdfdf</div> -->
<!-- </template> -->
</div>
<input type="button" id="zoomButton"  value="zoom" style="position:relative;z-index: 10;">
<input type="button" id="clearButton"  value="clear" style="position:absolute;z-index: 10;">

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

/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin  / http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga  / http://lantiga.github.io
 */

THREE.TrackballControls = function ( object, domElement ) {

  var _this = this;
  var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

  this.object = object;
  this.domElement = ( domElement !== undefined ) ? domElement : document;

  // API

  this.enabled = true;

  this.screen = { left: 0, top: 0, width: 0, height: 0 };

  this.rotateSpeed = 1.0;
  this.zoomSpeed = 1.2;
  this.panSpeed = 0.3;

  this.noRotate = false;
  this.noZoom = false;
  this.noPan = false;

  this.staticMoving = false;
  this.dynamicDampingFactor = 0.2;

  this.minDistance = 0;
  this.maxDistance = Infinity;

  this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

  // internals

  this.target = new THREE.Vector3();

  var EPS = 0.000001;

  var lastPosition = new THREE.Vector3();

  var _state = STATE.NONE,
  _prevState = STATE.NONE,

  _eye = new THREE.Vector3(),

  _movePrev = new THREE.Vector2(),
  _moveCurr = new THREE.Vector2(),

  _lastAxis = new THREE.Vector3(),
  _lastAngle = 0,

  _zoomStart = new THREE.Vector2(),
  _zoomEnd = new THREE.Vector2(),

  _touchZoomDistanceStart = 0,
  _touchZoomDistanceEnd = 0,

  _panStart = new THREE.Vector2(),
  _panEnd = new THREE.Vector2();

  // for reset

  this.target0 = this.target.clone();
  this.position0 = this.object.position.clone();
  this.up0 = this.object.up.clone();

  // events

  var changeEvent = { type: 'change' };
  var startEvent = { type: 'start' };
  var endEvent = { type: 'end' };


  // methods

  this.handleResize = function () {

    if ( this.domElement === document ) {

      this.screen.left = 0;
      this.screen.top = 0;
      this.screen.width = window.innerWidth;
      this.screen.height = window.innerHeight;

    } else {

      var box = this.domElement.getBoundingClientRect();
      // adjustments come from similar code in the jquery offset() function
      var d = this.domElement.ownerDocument.documentElement;
      this.screen.left = box.left + window.pageXOffset - d.clientLeft;
      this.screen.top = box.top + window.pageYOffset - d.clientTop;
      this.screen.width = box.width;
      this.screen.height = box.height;

    }

  };

  this.handleEvent = function ( event ) {

    if ( typeof this[ event.type ] == 'function' ) {

      this[ event.type ]( event );

    }

  };

  var getMouseOnScreen = ( function () {

    var vector = new THREE.Vector2();

    return function getMouseOnScreen( pageX, pageY ) {

      vector.set(
        ( pageX - _this.screen.left ) / _this.screen.width,
        ( pageY - _this.screen.top ) / _this.screen.height
      );

      return vector;

    };

  }() );

  var getMouseOnCircle = ( function () {

    var vector = new THREE.Vector2();

    return function getMouseOnCircle( pageX, pageY ) {

      vector.set(
        ( ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / ( _this.screen.width * 0.5 ) ),
        ( ( _this.screen.height + 2 * ( _this.screen.top - pageY ) ) / _this.screen.width ) // screen.width intentional
      );

      return vector;

    };

  }() );

  this.rotateCamera = ( function() {

    var axis = new THREE.Vector3(),
      quaternion = new THREE.Quaternion(),
      eyeDirection = new THREE.Vector3(),
      objectUpDirection = new THREE.Vector3(),
      objectSidewaysDirection = new THREE.Vector3(),
      moveDirection = new THREE.Vector3(),
      angle;

    return function rotateCamera() {

      moveDirection.set( _moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0 );
      angle = moveDirection.length();

      if ( angle ) {

        _eye.copy( _this.object.position ).sub( _this.target );

        eyeDirection.copy( _eye ).normalize();
        objectUpDirection.copy( _this.object.up ).normalize();
        objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize();

        objectUpDirection.setLength( _moveCurr.y - _movePrev.y );
        objectSidewaysDirection.setLength( _moveCurr.x - _movePrev.x );

        moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );

        axis.crossVectors( moveDirection, _eye ).normalize();

        angle *= _this.rotateSpeed;
        quaternion.setFromAxisAngle( axis, angle );

        _eye.applyQuaternion( quaternion );
        _this.object.up.applyQuaternion( quaternion );

        _lastAxis.copy( axis );
        _lastAngle = angle;

      } else if ( ! _this.staticMoving && _lastAngle ) {

        _lastAngle *= Math.sqrt( 1.0 - _this.dynamicDampingFactor );
        _eye.copy( _this.object.position ).sub( _this.target );
        quaternion.setFromAxisAngle( _lastAxis, _lastAngle );
        _eye.applyQuaternion( quaternion );
        _this.object.up.applyQuaternion( quaternion );

      }

      _movePrev.copy( _moveCurr );

    };

  }() );


  this.zoomCamera = function () {

    var factor;

    if ( _state === STATE.TOUCH_ZOOM_PAN ) {

      factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
      _touchZoomDistanceStart = _touchZoomDistanceEnd;
      _eye.multiplyScalar( factor );

    } else {

      factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

      if ( factor !== 1.0 && factor > 0.0 ) {

        _eye.multiplyScalar( factor );
        
      }

      if ( _this.staticMoving ) {

        _zoomStart.copy( _zoomEnd );

      } else {

        _zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

      }

    }

  };

  this.panCamera = ( function() {

    var mouseChange = new THREE.Vector2(),
      objectUp = new THREE.Vector3(),
      pan = new THREE.Vector3();

    return function panCamera() {

      mouseChange.copy( _panEnd ).sub( _panStart );

      if ( mouseChange.lengthSq() ) {

        mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

        pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
        pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

        _this.object.position.add( pan );
        _this.target.add( pan );

        if ( _this.staticMoving ) {

          _panStart.copy( _panEnd );

        } else {

          _panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

        }

      }

    };

  }() );

  this.checkDistances = function () {

    if ( ! _this.noZoom || ! _this.noPan ) {

      if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

        _this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );
        _zoomStart.copy( _zoomEnd );

      }

      if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

        _this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );
        _zoomStart.copy( _zoomEnd );

      }

    }

  };

  this.update = function () {

    _eye.subVectors( _this.object.position, _this.target );

    if ( ! _this.noRotate ) {

      _this.rotateCamera();

    }

    if ( ! _this.noZoom ) {

      _this.zoomCamera();

    }

    if ( ! _this.noPan ) {

      _this.panCamera();

    }

    _this.object.position.addVectors( _this.target, _eye );

    _this.checkDistances();

    _this.object.lookAt( _this.target );

    if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

      _this.dispatchEvent( changeEvent );

      lastPosition.copy( _this.object.position );

    }

  };

  this.reset = function () {

    _state = STATE.NONE;
    _prevState = STATE.NONE;

    _this.target.copy( _this.target0 );
    _this.object.position.copy( _this.position0 );
    _this.object.up.copy( _this.up0 );

    _eye.subVectors( _this.object.position, _this.target );

    _this.object.lookAt( _this.target );

    _this.dispatchEvent( changeEvent );

    lastPosition.copy( _this.object.position );

  };

  // listeners

  function keydown( event ) {

    if ( _this.enabled === false ) return;

    window.removeEventListener( 'keydown', keydown );

    _prevState = _state;

    if ( _state !== STATE.NONE ) {

      return;

    } else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && ! _this.noRotate ) {

      _state = STATE.ROTATE;

    } else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && ! _this.noZoom ) {

      _state = STATE.ZOOM;

    } else if ( event.keyCode === _this.keys[ STATE.PAN ] && ! _this.noPan ) {

      _state = STATE.PAN;

    }

  }

  function keyup( event ) {

    if ( _this.enabled === false ) return;

    _state = _prevState;

    window.addEventListener( 'keydown', keydown, false );

  }

  function mousedown( event ) {

    if ( _this.enabled === false ) return;

    event.preventDefault();
    event.stopPropagation();

    if ( _state === STATE.NONE ) {

      _state = event.button;

    }

    if ( _state === STATE.ROTATE && ! _this.noRotate ) {

      _moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );
      _movePrev.copy( _moveCurr );

    } else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

      _zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
      _zoomEnd.copy( _zoomStart );

    } else if ( _state === STATE.PAN && ! _this.noPan ) {

      _panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
      _panEnd.copy( _panStart );

    }

    document.addEventListener( 'mousemove', mousemove, false );
    document.addEventListener( 'mouseup', mouseup, false );

    _this.dispatchEvent( startEvent );

  }

  function mousemove( event ) {

    if ( _this.enabled === false ) return;

    event.preventDefault();
    event.stopPropagation();

    if ( _state === STATE.ROTATE && ! _this.noRotate ) {

      _movePrev.copy( _moveCurr );
      _moveCurr.copy( getMouseOnCircle( event.pageX, event.pageY ) );

    } else if ( _state === STATE.ZOOM && ! _this.noZoom ) {

      _zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

    } else if ( _state === STATE.PAN && ! _this.noPan ) {

      _panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

    }

  }

  function mouseup( event ) {

    if ( _this.enabled === false ) return;

    event.preventDefault();
    event.stopPropagation();

    _state = STATE.NONE;

    document.removeEventListener( 'mousemove', mousemove );
    document.removeEventListener( 'mouseup', mouseup );
    _this.dispatchEvent( endEvent );

  }

  function mousewheel( event ) {

    if ( _this.enabled === false ) return;

    event.preventDefault();
    event.stopPropagation();

    _zoomStart.y -= event.deltaY * 0.01;

    _this.dispatchEvent( startEvent );
    _this.dispatchEvent( endEvent );

  }

  function touchstart( event ) {

    if ( _this.enabled === false ) return;

    switch ( event.touches.length ) {

      case 1:
        _state = STATE.TOUCH_ROTATE;
        _moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
        _movePrev.copy( _moveCurr );
        break;

      default: // 2 or more
        _state = STATE.TOUCH_ZOOM_PAN;
        var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
        var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
        _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

        var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
        var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
        _panStart.copy( getMouseOnScreen( x, y ) );
        _panEnd.copy( _panStart );
        break;

    }

    _this.dispatchEvent( startEvent );

  }

  function touchmove( event ) {

    if ( _this.enabled === false ) return;

    event.preventDefault();
    event.stopPropagation();

    switch ( event.touches.length ) {

      case 1:
        _movePrev.copy( _moveCurr );
        _moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
        break;

      default: // 2 or more
        var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
        var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
        _touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

        var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
        var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
        _panEnd.copy( getMouseOnScreen( x, y ) );
        break;

    }

  }

  function touchend( event ) {

    if ( _this.enabled === false ) return;

    switch ( event.touches.length ) {

      case 0:
        _state = STATE.NONE;
        break;

      case 1:
        _state = STATE.TOUCH_ROTATE;
        _moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
        _movePrev.copy( _moveCurr );
        break;

    }

    _this.dispatchEvent( endEvent );

  }

  function contextmenu( event ) {

    event.preventDefault();

  }

  this.dispose = function() {

    this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
    this.domElement.removeEventListener( 'mousedown', mousedown, false );
    this.domElement.removeEventListener( 'wheel', mousewheel, false );

    this.domElement.removeEventListener( 'touchstart', touchstart, false );
    this.domElement.removeEventListener( 'touchend', touchend, false );
    this.domElement.removeEventListener( 'touchmove', touchmove, false );

    document.removeEventListener( 'mousemove', mousemove, false );
    document.removeEventListener( 'mouseup', mouseup, false );

    window.removeEventListener( 'keydown', keydown, false );
    window.removeEventListener( 'keyup', keyup, false );

  };

  this.domElement.addEventListener( 'contextmenu', contextmenu, false );
  this.domElement.addEventListener( 'mousedown', mousedown, false );
  this.domElement.addEventListener( 'wheel', mousewheel, false );

  this.domElement.addEventListener( 'touchstart', touchstart, false );
  this.domElement.addEventListener( 'touchend', touchend, false );
  this.domElement.addEventListener( 'touchmove', touchmove, false );

  window.addEventListener( 'keydown', keydown, false );
  window.addEventListener( 'keyup', keyup, false );

  this.handleResize();

  // force an update at start
  this.update();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;

let Vue = require('vue');
let VueResource = require('vue-resource');
Vue.use(VueResource);
let scene,camera,renderer,hcontainer,vcontainer,controls;

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
        // controls.update();
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

//TODO: make it its own thing
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


}

export default {
  name: 'context-view',
  components: {
    'file-container': FileContainer
  },
  mounted: function () {

    // this.list()
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        render();
      }
    window.addEventListener("resize",onWindowResize)
    
    scene = new THREE.Scene();
    let rH = 2000
    let rV = 800
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    camera.position.set(0, 0,2*window.innerHeight);
    scene.add(camera)
    
    hcontainer = new THREE.CSS3DObject(document.createElement("div"));
    vcontainer = new THREE.CSS3DObject(document.createElement("div"));

    vcontainer.position.z=-this.rV //makes the main content always be in the z=0 plane
    hcontainer.position.z=-this.rH //makes the main content always be in the z=0 plane

    scene.add(hcontainer)
    scene.add(vcontainer)


    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.body.appendChild(renderer.domElement);

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener( 'change', render );

    // makes first element go in front and the rest in 
    // let hAngleBetween = (2*Math.PI)/(this.horizontal.length+1) //+1 for main file
    // let vAngleBetween = (2*Math.PI)/(this.vertical.length+1)

    // this.setUpHorizontalCircle(rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
    // this.setUpVerticalCircle(rV,vAngleBetween,-Math.PI/2+vAngleBetween)
    
    // this.setUpMain();

    let that = this;
    document.addEventListener("keydown", this.handleKeyEvent.bind(this));
  
    renderer.render( scene, camera );
    requestAnimationFrame(animate)

    this.setUpZoom()
    this.setup()

    this.$el.querySelector("#clearButton").onclick=function(){
      // that.clearEverything(vcontainer);
      that.mainid={id:"asdf"}

      // that.vertical.push("asf")
  }

    
  },
  created: function (){
      this.mainFile = "none";

  },
  data () {
    return {
      rH:2000,
      rV:800,
      hSprites:[],
      vSprites:[],
      mainid: null,
      sync:0,//used to call a function after both vertical and horizontal heve been called
      main:{},
      stage:{},
      rotationsRunning:0,
      horizontal:[],//["1 code", "maybe","id", "a"],
      // vertical:["one","two","threee"]
      vertical:[]
    }
  },
  watch: {
    vertical:function(){
      let that = this
      Vue.nextTick(function () {
        let vAngleBetween = (2*Math.PI)/(that.vertical.length+1)
        that.setUpVerticalCircle(that.rV,vAngleBetween,-Math.PI/2+vAngleBetween)
        that.main.clear(that.vertical.length,that.horizontal.length)
    })
    },
    horizontal:function(){
      let that = this
      Vue.nextTick(function () {
        let hAngleBetween = (2*Math.PI)/(that.horizontal.length+1)
         that.setUpHorizontalCircle(that.rH,hAngleBetween,-Math.PI/2 +hAngleBetween)
         
         while (that.vertical.length!==0){
            that.vertical.pop()
          }
         let a =[Math.random(),Math.random(),Math.random()]
         for(let i = 0; i<a.length;i++){
          that.vertical.push(a[i])
         }

    })
    },
    mainid:function(){  
      this.clearEverything()


      this.hSprites=[]
      this.vSprites=[]
      this.rotationsRunning=0
      
      // this.horizontal = ["1 code", "maybe"]''
      let that = this
      while (that.horizontal.length!==0){
            that.horizontal.pop()
          }
      this.horizontal.push("asdf","asf")
    
    }
  },
  methods:{
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
      let element = this.$el.querySelector("#main-container");
      let sprite = new THREE.CSS3DObject( element );
      scene.add(sprite)
      // this.list()
      this.main=new MainFile(sprite,this.vertical.length,this.horizontal.length,0,0)
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
        if(hcontainer.children.indexOf(this.main.sprite)===-1){
          vcontainer.remove(this.main.sprite)
          hcontainer.add(this.main.sprite)
          this.main.sprite.position.z= 2000//rH
        }
         if(e.keyCode == LEFT){
          targetAngle*=-1
          this.main.hPos-=1
        }else{
          this.main.hPos+=1
        }
       
        this.animateRotation(this.hSprites, new THREE.Vector3(0,1,0), targetAngle, d )
      }
      else if(e.keyCode === UP || e.keyCode === DOWN){
        let targetAngle = (2*Math.PI)/(that.vertical.length+1)
        
        if(!this.main.verticalRotateable() ){
          return
        }
        if(vcontainer.children.indexOf(this.main.sprite)===-1){
          hcontainer.remove(this.main.sprite)
          vcontainer.add(this.main.sprite)
          this.main.sprite.position.z= 800//rH
        }
        if(e.keyCode===UP){
          targetAngle*=-1
          this.main.vPos-=1
        }else{
          this.main.vPos+=1
        }
        
        this.animateRotation(this.vSprites, new THREE.Vector3(1,0,0), targetAngle, d )
      }
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
      scene.add(this.main.sprite)
      this.main.clear()
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
      // this.clearChildren(vcontainer);
      // this.clearChildren(hcontainer);
      // scene.remove(vcontainer)
      // scene.remove(hcontainer)

      // hcontainer = new THREE.CSS3DObject(document.createElement("div"));
      // vcontainer = new THREE.CSS3DObject(document.createElement("div"));

      // vcontainer.position.z=-this.rV //makes the main content always be in the z=0 plane
      // hcontainer.position.z=-this.rH //makes the main content always be in the z=0 plane
      
      // scene.add(hcontainer)
      // scene.add(vcontainer)
      
      
  },
    clearChildren:function(element){
      for( var i = element.children.length - 1; i >= 0; i--) { 
        
        element.remove(element.children[i])
      }
    },
    //Ajax calls 
      list: function(){
          let self = this;
         this.$http({url: 'http://localhost:3000/api/files/', method: 'GET'}).then(function (response) {
         self.mainid = response.body[0]._id;
         self.relations();

      }, function (response) {

      // error callback   
  });

      },

      relations:function(){
        let self = this;
          
            console.log("Load horizontal:" + this.mainid);

            this.$http({url: 'http://localhost:3000/api/files/'+ this.mainid +'?rel=1', method: 'GET'}).then(function (response) {
              console.log(response.body.relations);
            self.horizontal = [self.mainid].concat(response.body.relations);
            
            let subid = response.body.relations[1]; 

          console.log("Load vertical:" + subid);
            this.$http({url: 'http://localhost:3000/api/files/'+ subid +'?rel=1', method: 'GET'}).then(function (response) {
    
              self.vertical = [subid].concat(response.body.relations);
 
  
  }, function (response) {
      // error callback   
  }); 
  
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
#main-container{
  background-color: red;
}
/*.fileContainer{
  background-color: red;
  position:absolute;
  transition: all 2s;
}*/
.hidden{
display: none;
}
body{
  background-color: #27292d;
  overflow: hidden;
}
.three-div{
    background: #BADA55;
    color: #E50000;
    font-family: Arial, Helvetica, Sans-serif;
    font-size: 2em;
    padding: 2em;
}
</style>
