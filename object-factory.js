function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function do2dRotation(matrix,degree,xCenter,yCenter,xColumnIndex,yColumnIndex,x_speed,y_speed){
  var cos_t = Math.cos(degree)
  var sin_t = Math.sin(degree)
  for(var i = 0; i < matrix.length; i+=3){
    var x = matrix[i+xColumnIndex] - xCenter
    var y = matrix[i+yColumnIndex] - yCenter
    matrix[i+xColumnIndex] = x*cos_t - y*sin_t + xCenter
    matrix[i+yColumnIndex] = x*sin_t + y*cos_t + yCenter
  }
  var sx = x_speed
  var sy = y_speed
  x_speed = sx*cos_t - sy*sin_t
  y_speed = sx*sin_t + sy*cos_t
}

function do3dTranslation(object){
  
  object.x+=object.x_speed
  object.y+=object.y_speed
  object.z+=object.z_speed
  for(var i=0;i<object.positions.length;i+=3){
    object.positions[i]+=object.x_speed
    object.positions[i+1]+=object.y_speed
    object.positions[i+2]+=object.z_speed
  }
}

function getRandomRangeNumber(lower,upper){
  return (Math.random() * (upper - lower) + lower)
}

function ObjectFactory(GL,shaderManager){
  var gl = GL
  this.gl = gl

  this.shaderManager = shaderManager

  var hurufVertexPositionBuffer
  var hurufVertexColorBuffer
  var squareVertexPositionBuffer
  var squareVertexColorBuffer
  var squareTextureCoordBuffer
  var squareVertexIndexBuffer

  function handleLoadedTexture(textures) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    // Sampler 1
    gl.bindTexture(gl.TEXTURE_2D, textures[0])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[0].image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    // Sampler 2
    gl.bindTexture(gl.TEXTURE_2D, textures[1])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[1].image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    // Sampler 3
    gl.bindTexture(gl.TEXTURE_2D, textures[2])
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[2].image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  var crateTextures = Array()
  this.crateTextures = crateTextures
  function initTexture () {
    var crateImage = new Image()
    for (var i = 0; i < 3; i++) {
      var texture = gl.createTexture()
      texture.image = crateImage
      crateTextures.push(texture)
    }
    crateImage.onload = function () {
      handleLoadedTexture(crateTextures)
    }
    crateImage.src = 'Crate.jpg'
  }

  initTexture()

  var attrs = this
  var huruf = {
    positions:[],colors:[],
    x:0.0,y:0.0,z:0.0,
    x_speed:0.0,y_speed:0.0,z_speed:0.0,
    isClockWiseRotation:true,
    vec:[1,1,0]
  }
  huruf.positions = [
    0.4,0.5,-1.0,
    0.4,0.3,-1.0,
    -0.5,0.5,-1.0,
    -0.5,0.5,-1.0,
    -0.5,0.3,-1.0,
    0.4,0.3,-1.0,
    -0.5,0.3,-1.0,
    -0.25,0.3,-1.0,
    -0.5,-0.75,-1.0,
    -0.25,0.3,-1.0,
    -0.5,-0.75,-1.0,
    -0.25,-0.75,-1.0,
    -0.25,-0.05,-1.0,
    -0.25,-0.25,-1.0,
    0.3,-0.25,-1.0,
    0.3,-0.05,-1.0,
    0.3,-0.25,-1.0,
    -0.25,-0.05,-1.0,

    0.4,0.5,-1.2,
    0.4,0.3,-1.2,
    -0.5,0.5,-1.2,
    -0.5,0.5,-1.2,
    -0.5,0.3,-1.2,
    0.4,0.3,-1.2,
    -0.5,0.3,-1.2,
    -0.25,0.3,-1.2,
    -0.5,-0.75,-1.2,
    -0.25,0.3,-1.2,
    -0.5,-0.75,-1.2,
    -0.25,-0.75,-1.2,
    -0.25,-0.05,-1.2,
    -0.25,-0.25,-1.2,
    0.3,-0.25,-1.2,
    0.3,-0.05,-1.2,
    0.3,-0.25,-1.2,
    -0.25,-0.05,-1.2,

    0.4,0.5,-1.0,
    0.4,0.3,-1.0,
    0.4,0.3,-1.2,

    0.4,0.5,-1.0,
    0.4,0.5,-1.2,
    0.4,0.3,-1.2,

    -0.5,0.5,-1.0,
    0.4,0.5,-1.0,
    -0.5,0.5,-1.2,

    0.4,0.5,-1.0,
    -0.5,0.5,-1.2,
    0.4,0.5,-1.2,
    
    -0.5,0.3,-1.0,
    0.4,0.3,-1.0,
    -0.5,0.3,-1.2,

    0.4,0.3,-1.0,
    -0.5,0.3,-1.2,
    0.4,0.3,-1.2,

    -0.5,0.5,-1.0,
    -0.5,-0.75,-1.0,
    -0.5,0.5,-1.2,

    -0.5,0.5,-1.2,
    -0.5,-0.75,-1.0,
    -0.5,-0.75,-1.2,

    0.3,-0.05,-1.0,
    0.3,-0.25,-1.0,
    0.3,-0.05,-1.2,

    0.3,-0.05,-1.2,
    0.3,-0.25,-1.0,
    0.3,-0.25,-1.2,

    -0.25,0.3,-1.0,
    -0.25,-0.75,-1.0,
    -0.25,0.3,-1.2,

    -0.25,0.3,-1.2,
    -0.25,-0.75,-1.0,
    -0.25,-0.75,-1.2,

    -0.25,-0.05,-1.0,
    -0.25,-0.05,-1.2,
    0.3,-0.05,-1.0,

    -0.25,-0.05,-1.2,
    0.3,-0.05,-1.0,
    0.3,-0.05,-1.2,

    -0.25,-0.25,-1.0,
    -0.25,-0.25,-1.2,
    0.3,-0.25,-1.0,

    -0.25,-0.25,-1.2,
    0.3,-0.25,-1.0,
    0.3,-0.25,-1.2,

    -0.5,-0.75,-1.0,
    -0.5,-0.75,-1.2,
    -0.25,-0.75,-1.0,
    
    -0.5,-0.75,-1.2,
    -0.25,-0.75,-1.2,
    -0.25,-0.75,-1.0   
  ]

  huruf.x =-0.375       
  huruf.y = -0.125
  huruf.z = -1.1


  huruf.updatePosition = function(){
    this.x+=this.x_speed
    this.y+=this.y_speed
    this.z+=this.z_speed
  }

  huruf.checkCollision = function(){
    var positions = this.positions
    for(var i=0;i<positions.length;i+=3){
      if(positions[i] < -1.5 && this.x_speed < 0.0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"left"}
      }
      else if(positions[i] > 1.5 && this.x_speed > 0.0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"right"}
      }
      else if(positions[i+1] < -1.5 && this.y_speed < 0.0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"bottom"}
      }
      else if(positions[i+1] > 1.5 && this.y_speed > 0.0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"top"}
      }
      else if(positions[i+2] < -1.5 && this.z_speed < 0.0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"back"}
      }
      else if(positions[i+2] > 1.5 && this.z_speed > 0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"front"}
      }
    }
    return {collide:"none"}
  }
  
  var square = {positions:[],colors:[],x:0.0,y:0.0,z:0.0,x_speed:0.0,y_speed:0.0,z_speed:0.0,vec:[1.0,0.0,1.0]}

  huruf.x_speed = getRandomRangeNumber(-0.008,0.008)
  huruf.y_speed = getRandomRangeNumber(-0.008,0.008)
  huruf.z_speed = getRandomRangeNumber(-0.008,0.008)
  
  square.positions = [
    //x line
    -1.5,-1.5,-1.5,
    1.5,-1.5,-1.5,
    1.5,1.5,-1.5,
    -1.5,1.5,-1.5,
    //y line
    -1.5,-1.5,1.5,
    -1.5,-1.5,-1.5,
    -1.5,1.5,-1.5,
    -1.5,1.5,1.5,
    //z line
    1.5,-1.5,-1.5,
    1.5,-1.5,1.5,
    -1.5,-1.5,1.5,
    -1.5,-1.5,-1.5,
  ]
  square.z = 0

  
  this.initBuffers = function() {
    let shaderProgram = this.shaderManager.getAndSwitchShader('texture-shader')
    hurufVertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, hurufVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(huruf.positions), gl.STATIC_DRAW)
    hurufVertexPositionBuffer.itemSize = 3
    hurufVertexPositionBuffer.numItems = huruf.positions.length/3
    hurufVertexColorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, hurufVertexColorBuffer)
    huruf.colors = []
    for (var i=0; i < hurufVertexPositionBuffer.numItems; i++) {
      huruf.colors = huruf.colors.concat([232, 69, 4, 1.0])
    }
    hurufVertexColorBuffer.itemSize = 4
    hurufVertexColorBuffer.numItems = 18
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(huruf.colors), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, hurufVertexColorBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, hurufVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0)


    // shaderManager = this.shaderManager.getAndSwitchShader('texture-shader')

    squareVertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square.positions), gl.STATIC_DRAW)
    squareVertexPositionBuffer.itemSize = 3
    squareVertexPositionBuffer.numItems = square.positions.length/3
    
    squareTextureCoordBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordBuffer)
    var textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW)
    squareTextureCoordBuffer.itemSize = 2
    squareTextureCoordBuffer.numItems = 12

    // Cube Indices
    squareVertexIndexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer)
    var cubeVertexIndices = [
      0, 1, 2, 0, 2, 3,    // Front face
      4, 5, 6, 4, 6, 7,    // Back face
      8, 9, 10, 8, 10, 11  // Top face
    ]
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW)
    squareVertexIndexBuffer.itemSize = 1
    squareVertexIndexBuffer.numItems = 18

    attrs.hurufVertexPositionBuffer = hurufVertexPositionBuffer
    attrs.hurufVertexColorBuffer = hurufVertexColorBuffer

    attrs.squareVertexPositionBuffer = squareVertexPositionBuffer
    attrs.squareTextureCoordBuffer = squareTextureCoordBuffer
    attrs.squareVertexIndexBuffer = squareVertexIndexBuffer
  
    attrs.huruf = huruf
    attrs.square = square

  }

  this.update = function(){

    var collision = huruf.checkCollision().collide
    if(collision != "none"){
      switch(collision){
        case "left":
        case "right":
          huruf.x_speed*=-1       
          break
        case "top":
        case "bottom":
          huruf.y_speed*=-1       
          break
        case "front":
        case "back":
          huruf.z_speed*=-1       
          break
      }
    }

    do3dTranslation(huruf)
    do2dRotation(huruf.positions,toRadians(
      huruf.isClockWiseRotation?1:-1
    ),huruf.x,huruf.z,0,2,huruf.x_speed,huruf.y_speed)

  }
}