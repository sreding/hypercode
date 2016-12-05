<template id="main-template">
  <div id="app">
  <div id="stage"></div>
  
    <file-container :fileid="id1" class="fileContainer" id="no1"></file-container>
    <file-container :fileid="id2" class="fileContainer" id="no2"></file-container>
    <file-container :fileid="id3" class="fileContainer" id="no3"></file-container>

</template>

<script>

import FileContainer from './components/file-container.vue';

var Sprite3D = Sprite3D || {

  
  /********* [PUBLIC STATIC] isSupported() ***********/
  /*
  returns: Boolean
  This method is automatically called when we create the first element, 
  but you can call it earlier if you want to provide an alternative content 
  to unsupported browsers.
  */
  isSupported: function(){
    // init if needed
    if ( !this._isInit ) this._init();
    // return support value
    return this._isSupported;
  },
  
  /********* [PUBLIC STATIC] stage() ***********/
  /*
  Creates a root container for your 3D content.

  Usage 1 : 
    Sprite3D.stage()

  Creates and returns a new <div> element that is added to the page.
  The stage is centered, so the position (0,0,0) is in the center of the window.
  This is the easiest and most common way to start a project

  Usage 2 : 
    Sprite3D.stage( document.querySelector("#myContainer") )

  Uses an existing HTML element as root container. The element is only tweaked a bit,
  adjusting a few transform-related CSS properties, as well as setting the CSS "position"
  property to "relative" if it is "static".
  This method gives you more freedom, but more responsabilities :)
  
  */
  stage: function(element) {
    // init if needed
    if ( !this._isInit ) this._init();
    // tweak or create root element
    var c,s;
    if (element){
      c = element;
      s = element.style;
      if(s.position === "static" ) s.position = "relative";
    } else {
      c = document.createElement("div");
      s = c.style;
      s[this._browserPrefix+"PerspectiveOrigin"] = "0 0";
      s[this._browserPrefix+"TransformOrigin"] = "0 0";
      s.position = "absolute";
      s.top = "50%";
      s.left = "50%";
      s.margin = "0px";
      s.padding = "0px";
      document.body.appendChild(c);
    }
    s[this._browserPrefix+"Perspective"] = "800px";
    s[this._browserPrefix+"Transform"] = "translateZ(0px)";
    c = this.create(c);
    // fix for the glitch problems under Safari6 / Mountain Lion
    // (root container must NOT have its transform-style property set to "preserve-3d")
    s[this._browserPrefix+"TransformStyle"] = "flat";
    // end fix
    return c;
  },
  
  /********* [PUBLIC STATIC] create() ***********/
  /*
  Creates a new Sprite3D element

  Usage 1 :
    Sprite3D.create()

    Creates a <div> element and turn it into a 

  Usage 2 :
    Sprite3D.create( document.querySelector("#myElement") )

  Usage 3 :
    Sprite3D.create( "#id" )
    Sprite3D.create( "id" )

  Usage 4 : 
    Sprite3D.create( ".class" )
    Sprite3D.create( ".class1 class2" )

  */
  create: function(element){
    // init Sprite3D if needed
    if ( !this._isInit ) this._init();
    
    // create or tweak html element
    if ( arguments.length === 0 ) {
      element = document.createElement("div");
      element.style.margin = "0px";
      element.style.padding = "0px";
      element.style.position = "absolute";
    } else if ( typeof(element) === "string" ) {
      var str = element;
      element = document.createElement("div");
      element.style.margin = "0px";
      element.style.padding = "0px";
      element.style.position = "absolute";
      this._handleStringArgument(element,str);
    } else if ( element.style.position == "static" ) {
      element.style.position = "relative";
    }
    element.style[ this._browserPrefix + "TransformStyle" ] = "preserve-3d";
    element.style[ this._transformProperty ] = "translateZ(0px)";

    // extend element with 3D methods
    for(var prop in this._props) {
      if (this._props.hasOwnProperty(prop)){
        element[prop] = this._props[prop];
      }
    }
    
    // add private properties
    element._string = [
      "translate3d(", 0, "px,", 0, "px,", 0, "px) ", 
      "rotateX(", 0, "deg) ", 
      "rotateY(", 0, "deg) ", 
      "rotateZ(", 0, "deg) ", 
      "scale3d(", 1, ", ", 1, ", ", 1, ") "
    ];
    element._positions = [
       1,  3,  5, // x, y, z
       8, 11, 14, // rotationX, rotationY, rotationZ
      17, 19, 21 // scaleX, scaleY, scaleZ
    ];
    element._ox = 0;
    element._oy = 0;
    element._oz = 0;
    
    // return
    return element;
  },
  
  /********* [PUBLIC STATIC] box() ***********/
  box: function(width,height,depth,idOrClassName) {
    // init if needed
    if ( !this._isInit ) this._init();
    
    // create container element
    var box = this.create();
    
    if ( arguments.length === 1 ) {
      height = width;
      depth = width;
    } else if ( arguments.length === 2 && typeof(arguments[1]) === "string" ) { 
      this._handleStringArgument(box,arguments[1]);
      height = width;
      depth = width;
    } else if ( idOrClassName && typeof(idOrClassName) === "string" ) {
      this._handleStringArgument(box,idOrClassName);
    }
    
    // add faces
    var hwidth = width*.5,
      hheight = height*.5,
      hdepth = depth*.5;
      
    box.appendChild( Sprite3D.create(".front").position( -hwidth, -hheight, hdepth).size(width,height).update() );
    box.appendChild( Sprite3D.create(".back").position( -hwidth, -hheight, -hdepth).size(width,height).rotationY(180).update() );
    box.appendChild( Sprite3D.create(".left").position( -hwidth-hdepth, -hheight, 0).size(depth,height).rotationY(-90).update() );
    box.appendChild( Sprite3D.create(".right").position( hwidth-hdepth, -hheight, 0).size(depth,height).rotationY(90).update() );
    box.appendChild( Sprite3D.create(".bottom").position( -hwidth, hheight-hdepth, 0).size(width,depth).rotationX(-90).update() );
    box.appendChild( Sprite3D.create(".top").position( -hwidth, -hheight-hdepth, 0).size(width,depth).rotationX(90).update() );
    
    return box;
  },
  
  /********* [PUBLIC STATIC] prefix() ***********/
  prefix: function(cssPropertyName) {
    return Sprite3D._browserPrefix + cssPropertyName;
  },

  /********* [PRIVATE STATIC] library's global properties ***********/
  _isInit: false,
  _isSupported: false,
  _browserPrefix: "webkit",
  _transformProperty: "webkitTransform",

  /********* [PRIVATE STATIC] _init() ***********/  
  _init: function(){
    var d = document.createElement("div"), 
      prefixes = ["", "webkit", "Moz", "O", "ms" ],
      n = prefixes.length, i;
      
    Sprite3D._isInit = true;
    // check for 3D transforms
    for( i = 0; i < n; i++ ) {
      if ( ( prefixes[i] + "Perspective" ) in d.style ) {
        Sprite3D._transformProperty = prefixes[i] + "Transform";
        Sprite3D._isSupported = true;
        Sprite3D._browserPrefix = prefixes[i];
        if ( i==2 ) Sprite3D._props.update = Sprite3D._props.updateJoin;
        //console.log( "Sprite3D found support for 3D transforms using prefix: " + prefixes[i] );
        return true;
      }
    }

    // no transform support
    alert("Sorry, but your browser does not support CSS 3D transfroms.");
    return false;
  },
  
  /********* [PRIVATE STATIC] _handleStringArgument() ***********/
  _handleStringArgument: function( element, str ){
    switch( str[0] ) {
      case ".":
        element.className = str.substr(1);
        break;
      case "#":
        element.id = str.substr(1);
        break;
      default:
        element.id = str;
        break;
    }
  },
  
  /********* Sprite3D objects properties ***********/
  _props: {
    
      /////////////////////////////////////////////
     //////////// Position / absolute ////////////
    /////////////////////////////////////////////
    x : function(px) {
      if ( arguments.length ) {
        this._string[this._positions[0]] = px - this._ox;
        return this;
      } else {
        return this._string[this._positions[0]] + this._ox;
      }
    },
    y : function(py) {
      if ( arguments.length ) {
        this._string[this._positions[1]] = py - this._oy;
        return this;
      } else {
        return this._string[this._positions[1]] + this._oy;
      }
    },
    z : function(pz) {
      if ( arguments.length ) {
        this._string[this._positions[2]] = pz - this._oz;
        return this;
      } else {
        return this._string[this._positions[2]] + this._oz;
      }
    },
    position : function( px, py, pz) {
      this._string[this._positions[0]] = px - this._ox;
      this._string[this._positions[1]] = py - this._oy;
      if ( arguments.length >= 3 ) this._string[this._positions[2]] = pz - this._oz;
      return this;
    },
    
      /////////////////////////////////////////////
     //////////// Position / relative ////////////
    /////////////////////////////////////////////
    move : function(px,py,pz) {
      this._string[this._positions[0]] += px;
      this._string[this._positions[1]] += py;
      if ( arguments.length >= 3 ) this._string[this._positions[2]] += pz;
      return this;
    },
    
      /////////////////////////////////////////////
     //////////// Rotation / absolute ////////////
    /////////////////////////////////////////////
    rotationX : function(rx) {
      if ( arguments.length ) {
        this._string[this._positions[3]] = rx;
        return this;
      } else {
        return this._string[this._positions[3]];
      }
    },
    rotationY : function(ry) {
      if ( arguments.length ) {
        this._string[this._positions[4]] = ry;
        return this;
      } else {
        return this._string[this._positions[4]];
      }
    },
    rotationZ : function(rz) {
      if ( arguments.length ) {
        this._string[this._positions[5]] = rz;
        return this;
      } else {
        return this._string[this._positions[5]];
      }
    },
    rotation : function(rx,ry,rz) {
      this._string[this._positions[3]] = rx;
      this._string[this._positions[4]] = ry;
      this._string[this._positions[5]] = rz;
      return this;
    },
    
      /////////////////////////////////////////////
     //////////// Rotation / relative ////////////
    /////////////////////////////////////////////
    rotate : function(rx,ry,rz) {
      this._string[this._positions[3]] += rx;
      this._string[this._positions[4]] += ry;
      this._string[this._positions[5]] += rz;
      return this;
    },
    
      /////////////////////////////////////////////
     /////////////////   Scale  //////////////////
    /////////////////////////////////////////////
    scaleX : function(sx) {
      if ( arguments.length ) {
        this._string[this._positions[6]] = sx;
        return this;
      } else {
        return this._string[this._positions[6]];
      }
    },
    scaleY : function(sy) {
      if ( arguments.length ) {
        this._string[this._positions[7]] = sy;
        return this;
      } else {
        return this._string[this._positions[7]];
      }
    },
    scaleZ : function(sz) {
      if ( arguments.length ) {
        this._string[this._positions[8]] = sz;
        return this;
      } else {
        return this._string[this._positions[8]];
      }
    },
    scale : function(sx,sy,sz) {
      switch(arguments.length){
        case 0:
          return this._string[this._positions[6]];
        case 1: 
          this._string[this._positions[6]] = sx;
          this._string[this._positions[7]] = sx;
          this._string[this._positions[8]] = sx;
          return this;
        case 2:
          this._string[this._positions[6]] = sx;
          this._string[this._positions[7]] = sy;
          //this._string[this._positions[8]] = 1;
          return this;
        case 3:
          this._string[this._positions[6]] = sx;
          this._string[this._positions[7]] = sy;
          this._string[this._positions[8]] = sz;
          return this;
      }
      return this;
    },
    
      /////////////////////////////////////////////
     /////////////////  Origin  //////////////////
    /////////////////////////////////////////////
    origin : function(ox,oy,oz) {
      // failed attempt at auto-centering the registration point of the object
      if ( typeof(ox) === "string" ) {
        /*
        switch(ox){
          case "center":
            this._string[this._positions[0]] = -this.offsetWidth>>1;
            this._string[this._positions[1]] = -this.offsetHeight>>1;
            debugger
            console.log("centering");
            break;
        }
        */
        var cs = window.getComputedStyle(this,null);
        console.log(cs);
        console.log("w:"+ cs.getPropertyValue("width") + " || h: " + cs.height );
      } else {
        if (arguments.length<3) oz = 0;
        this._string[this._positions[0]] += this._ox - ox;
        this._string[this._positions[1]] += this._oy - oy;
        this._string[this._positions[2]] += this._oz - oz;
        this._ox = ox;
        this._oy = oy;
        this._oz = oz;
      }
      return this;
    },

      /////////////////////////////////////////////
     ////////////  Transform Origin  /////////////
    /////////////////////////////////////////////
    transformOrigin : function(tx,ty) {
      this.style[ Sprite3D._browserPrefix + "TransformOrigin" ] = (Number(tx)?tx+"px":tx) + " " + (Number(ty)?ty+"px":ty);
      return this;
    },
    
      /////////////////////////////////////////////
     ////////////  Transform String  /////////////
    /////////////////////////////////////////////
    transformString : function(s) {
      var parts = s.toLowerCase().split(" "),
        numParts = parts.length,
        i = 0,
        strings = [],
        positions = [ 0,0,0, 0,0,0, 0,0,0 ],
        n = 0;
        
      for(i;i<numParts;i++){
        switch( parts[i] ){
          case "p":
          case "position":
          case "translate":
          // todo: use rx ry rz (regPoint) when re-defining transform order
            n = strings.push( "translate3d(", this._string[this._positions[0]], "px,", this._string[this._positions[1]], "px,", this._string[this._positions[2]], "px) " );
            positions[0] = n-6; 
            positions[1] = n-4;
            positions[2] = n-2;
            break;
          case "rx":
          case "rotatex":
          case "rotationx":
            n = strings.push( "rotateX(", this._string[this._positions[3]], "deg) " );
            positions[3] = n-2;
            break;
          case "ry" :
          case "rotatey":
          case "rotationy":
            n = strings.push( "rotateY(", this._string[this._positions[4]], "deg) " );
            positions[4] = n-2;
            break;
          case "rz":
          case "rotatez":
          case "rotationz":
            n = strings.push( "rotateZ(", this._string[this._positions[5]], "deg) " );
            positions[5] = n-2;
            break;
          case "s":
          case "scale":
            n = strings.push( "scale3d(", this._string[this._positions[6]], ",", this._string[this._positions[7]], ",", this._string[this._positions[8]], ") " );
            positions[6] = n-6; 
            positions[7] = n-4;
            positions[8] = n-2;
            break;
        }
      }
      
      this._string = strings;
      this._positions = positions;
      
      return this;
    },
    
      /////////////////////////////////////////////
     /////////////////  Update  //////////////////
    ///////////////////////////////////////////// 
    updateJoin : function(){
      this.style[Sprite3D._transformProperty] = this._string.join("");
      return this;
    },

    update : function(){
      var s = "";
      this._string.every( function(value){ s += value; return true; } );
      this.style[Sprite3D._transformProperty] = s;
      return this;
    },

      /////////////////////////////////////////////
     ////////////  Helper Functions //////////////
    /////////////////////////////////////////////
  
    //////////// Perspective helper function ////////////
    perspective : function(value) {
      switch(arguments.length) {
        case 0:
          return this.style[Sprite3D._browserPrefix + "Perspective"];
    
        case 1:
          this.style[Sprite3D._browserPrefix + "Perspective"] = (typeof(value)==="string")?value:value+"px";
          return this;
      }
    },
  
    //////////// CSS helper function ////////////
    css : function(name, value) {
      switch(arguments.length) {
        case 0:
          return this.style;
        case 1:
          return this.style[name];
        case 2:
          this.style[name] = value;
          return this;
        case 3:
          this.style[Sprite3D._browserPrefix + name] = value;
          return this;
      }
    },
    
    //////////// Class names helper functions ////////////
    addClass : function(name) {
      this.classList.add(name);
      return this;
    },

    removeClass : function(name) {
      this.classList.remove(name);
      return this;
    },
    
    //////////// HTML helper function ////////////
    html : function(value) {
      if (arguments.length){
        this.innerHTML = value;
        return this;
      }else{
        return this.innerHTML;
      }
      return this;
    },
    
    //////////// SIZE helper function ////////////
    size: function(width, height){
      this.style.width = Number(width)?width+"px":width;
      this.style.height = Number(height)?height+"px":height;
      return this;
    },
    
    //////////// BIND helper function ////////////
    bind: function(events){
      if(typeof(events)==="object"){
        for( var i in events ){
          this.addEventListener( i, events[i], false );
        }
      } else if(arguments.length===2) {
        this.addEventListener( arguments[0], arguments[1], false );
      } else if(arguments.length===3) {
        this.addEventListener( arguments[0], arguments[1], arguments[2] );
      }
      return this;
    },
    
    //////////// UNBIND helper function ////////////
    unbind: function(events){
      if(typeof(events)==="object"){
        for( var i in events ){
          this.removeEventListener( i, events[i], false );
        }
      } else if(arguments.length===2) {
        this.removeEventListener( arguments[0], arguments[1], false );
      }
      return this;
    },
        
    //////////// Spritesheet helper functions ////////////
    tileWidth: 0,
    tileHeight: 0,
    tileSize : function(width, height) {
      this.tileWidth = width;
      this.tileHeight = height;
      return this;
    },
    tilePosition : function(tilePosX, tilePosY) {
      this.style.backgroundPosition = "-" + (tilePosX * this.tileWidth) + "px -" + (tilePosY * this.tileHeight) + "px";
      return this;
    },

    //////////// Generic setter for chaining ////////////
    set : function(name, value) {
      this[name] = value;
      return this;
    }
    
  }
};
// takes the first 3 elements and plaes them on a circle with 90 degres between
// centerX and centerY and centerZ are the position of the circle center relative to stage
function placeElementsOnCircle(sprites,radius, centerX, centerY, centerZ){
  let alpha = 0//3*Math.PI/2
  for(let i =0; i<3; i++){
    // console.log(Math.sin(Math.PI))
    let el =sprites[i]
    let y = centerY
    let x = radius*Math.cos(alpha)+centerX - el.offsetWidth/2
    let z = radius*Math.sin(alpha)+centerZ
    console.log(el)
    console.log(`x: ${x-centerX}  y:${y}  z:${z} `)
    el.position(x,y,z)
    .css("transform-origin",`${-radius*Math.cos(alpha)+el.offsetWidth/2}px ${centerY+el.offsetHeight/2}px ${-radius*Math.sin(alpha)}px`)
    .update()//css("transform-origin","-200px 100px 0px")

    alpha+=Math.PI/2
  }
}
function rotateElements(elements,deg){
    
}

var Vue = require('vue');
var VueResource = require('vue-resource');
Vue.use(VueResource);

export default {
  name: 'app',
  components: {
    'file-container': FileContainer
  },
  mounted: function () {
  let s = this.$el.querySelector("#stage")
  let fileContainers=this.$el.querySelectorAll(".fileContainer")
  let that = this;
  let stage = Sprite3D.stage(this.$el.querySelector("#stage"));
  stage.css("transform-style", "preserve-3d")

  fileContainers.forEach(function(item){
    let wrapper = document.createElement("div")
   
    wrapper.style.width = item.offsetWidth+"px"
    wrapper.style.height = item.offsetHeight+"px"//item.offsetHeight

    wrapper.className="contentWrapper"
    wrapper.appendChild(Sprite3D.create(item))

    that.sprites.push(stage.appendChild(Sprite3D.create(wrapper)))
  })
  
  placeElementsOnCircle(this.sprites, 600, s.offsetWidth/2,100,-600)
  this.setUpButtons(that)
  // window.onclick=function(){
  //   console.log("clicked")
  //   that.sprites.forEach(function(item){
  //     item.rotate(0,90,0).update();
  //     item.firstChild.rotate(0,-90,0).update()
  //   })
  // }

  this.list();
  },
  created: function (){
      this.mainFile = "none";
      
  },
  data () {
    return {
      sprites:[],
      stage:{},
      id1 : "none",
      id2 : "none",
      id3 : "none",
    }
  },
  methods:{
    setUpButtons:function(that){
      let buttons = this.$el.querySelectorAll(".next-btn")
      buttons.forEach(function(item){
        item.onclick=function(){
          that.sprites.forEach(function(item){
          item.rotate(0,-90,0).update();
          item.firstChild.rotate(0,90,0).update()
        })
        }
      })
      buttons = this.$el.querySelectorAll(".prev-btn")
      buttons.forEach(function(item){
        item.onclick=function(){
          that.sprites.forEach(function(item){
          item.rotate(0,90,0).update();
          item.firstChild.rotate(0,-90,0).update()
        })
        }
      })

    },
    rotateStuff:function(that){
      that.sprites.forEach(function(item){
      item.rotate(0,90,0).update();
      item.firstChild.rotate(0,-90,0).update()
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
.fileContainer{
  background-color: red;
  position:absolute;
  transition: all 2s;
}
</style>
