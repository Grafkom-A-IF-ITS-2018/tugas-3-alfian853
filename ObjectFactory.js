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

function ObjectFactory(GL){
  var gl = GL
  this.gl = gl
  var hurufVertexPositionBuffer
  var hurufVertexColorBuffer
  var squareVertexPositionBuffer
  var squareVertexColorBuffer

  var attrs = this
  var huruf = {
    positions:[],colors:[],
    x:0.0,y:0.0,z:0.0,
    x_speed:0.0,y_speed:0.0,z_speed:0.0,
    isClockWiseRotation:true,
    vec:[1,1,0]
  }
  huruf.positions = [
  0.4,0.5,-5,
  0.4,0.3,-5,
  -0.5,0.5,-5,
  -0.5,0.5,-5,
  -0.5,0.3,-5,
  0.4,0.3,-5,
  -0.5,0.3,-5,
  -0.25,0.3,-5,
  -0.5,-0.75,-5,
  -0.25,0.3,-5,
  -0.5,-0.75,-5,
  -0.25,-0.75,-5,
  -0.25,-0.05,-5,
  -0.25,-0.25,-5,
  0.3,-0.25,-5,
  0.3,-0.05,-5,
  0.3,-0.25,-5,
  -0.25,-0.05,-5,
  0.4,0.5,-5.2,
  0.4,0.3,-5.2,
  -0.5,0.5,-5.2,
  -0.5,0.5,-5.2,
  -0.5,0.3,-5.2,
  0.4,0.3,-5.2,
  -0.5,0.3,-5.2,
  -0.25,0.3,-5.2,
  -0.5,-0.75,-5.2,
  -0.25,0.3,-5.2,
  -0.5,-0.75,-5.2,
  -0.25,-0.75,-5.2,
  -0.25,-0.05,-5.2,
  -0.25,-0.25,-5.2,
  0.3,-0.25,-5.2,
  0.3,-0.05,-5.2,
  0.3,-0.25,-5.2,
  -0.25,-0.05,-5.2,
  0.4,0.5,-5.0,
  0.4,0.3,-5.0,
  0.4,0.3,-5.2,
  0.4,0.5,-5.0,
  0.4,0.5,-5.2,
  0.4,0.3,-5.2,
  -0.5,0.5,-5.0,
  0.4,0.5,-5.0,
  -0.5,0.5,-5.2,
  0.4,0.5,-5.0,
  -0.5,0.5,-5.2,
  0.4,0.5,-5.2,
  -0.5,0.3,-5.0,
  0.4,0.3,-5.0,
  -0.5,0.3,-5.2,
  0.4,0.3,-5.0,
  -0.5,0.3,-5.2,
  0.4,0.3,-5.2,
  -0.5,0.5,-5.0,
  -0.5,-0.75,-5.0,
  -0.5,0.5,-5.2,
  -0.5,0.5,-5.2,
  -0.5,-0.75,-5.0,
  -0.5,-0.75,-5.2,
  0.3,-0.05,-5.0,
  0.3,-0.25,-5.0,
  0.3,-0.05,-5.2,
  0.3,-0.05,-5.2,
  0.3,-0.25,-5.0,
  0.3,-0.25,-5.2,
  -0.25,0.3,-5.0,
  -0.25,-0.75,-5.0,
  -0.25,0.3,-5.2,
  -0.25,0.3,-5.2,
  -0.25,-0.75,-5.0,
  -0.25,-0.75,-5.2,
  -0.25,-0.05,-5.0,
  -0.25,-0.05,-5.2,
  0.3,-0.05,-5.0,
  -0.25,-0.05,-5.2,
  0.3,-0.05,-5.0,
  0.3,-0.05,-5.2,
  -0.25,-0.25,-5.0,
  -0.25,-0.25,-5.2,
  0.3,-0.25,-5.0,
  -0.25,-0.25,-5.2,
  0.3,-0.25,-5.0,
  0.3,-0.25,-5.2,
  -0.5,-0.75,-5.0,
  -0.5,-0.75,-5.2,
  -0.25,-0.75,-5.0,
  -0.5,-0.75,-5.2,
  -0.25,-0.75,-5.2,
  -0.25,-0.75,-5.0   
  ]

  huruf.x =-0.375       
  huruf.y = -0.125
  huruf.z = -5.1


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
      else if(positions[i+2] < -7 && this.z_speed < 0.0){
        this.isClockWiseRotation = !this.isClockWiseRotation
        return {collide:"back"}
      }
      else if(positions[i+2] > -4 && this.z_speed > 0){
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
    -1.5,-1.5,-7,
    1.5,-1.5,-7,
    1.5,1.5,-7,
    -1.5,1.5,-7,
    -1.5,-1.5,-4,
    1.5,-1.5,-4,
    1.5,1.5,-4,
    -1.5,1.5,-4,
    //y line
    -1.5,-1.5,-7,
    -1.5,1.5,-7,
    1.5,-1.5,-7,
    1.5,1.5,-7,
    1.5,-1.5,-4,
    1.5,1.5,-4,
    -1.5,1.5,-4,
    -1.5,-1.5,-4,
    //z line
    1.5,-1.5,-7,
    1.5,-1.5,-4,
    -1.5,-1.5,-7,
    -1.5,-1.5,-4,
    1.5,1.5,-7,
    1.5,1.5,-4,
    -1.5,1.5,-7,
    -1.5,1.5,-4
  ]
  square.z = -5.5

  
  this.initBuffers = function() {
    hurufVertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, hurufVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(huruf.positions), gl.STATIC_DRAW)
    hurufVertexPositionBuffer.itemSize = 3
    hurufVertexPositionBuffer.numItems = huruf.positions.length/3
    hurufVertexColorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, hurufVertexColorBuffer)
    huruf.colors = []
    for (var i=0; i < hurufVertexPositionBuffer.numItems; i++) {
      huruf.colors = huruf.colors.concat([Math.random(),Math.random(),Math.random(), 1.0])
    }
    hurufVertexColorBuffer.itemSize = 4
    hurufVertexColorBuffer.numItems = 18
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(huruf.colors), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, hurufVertexColorBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, hurufVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0)


    squareVertexPositionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square.positions), gl.STATIC_DRAW)
    squareVertexPositionBuffer.itemSize = 3
    squareVertexPositionBuffer.numItems = 24
    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    square.colors = [];
    for (var i=0; i < squareVertexPositionBuffer.numItems; i++) {
      square.colors = square.colors.concat([Math.random(),Math.random(),Math.random(), 1.0])
    }
    squareVertexColorBuffer.itemSize = 4
    squareVertexColorBuffer.numItems= 24

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square.colors), gl.STATIC_DRAW);

    attrs.hurufVertexPositionBuffer = hurufVertexPositionBuffer
    attrs.hurufVertexColorBuffer = hurufVertexColorBuffer
    attrs.squareVertexPositionBuffer = squareVertexPositionBuffer
    attrs.squareVertexColorBuffer = squareVertexColorBuffer
    attrs.huruf = huruf
    attrs.square = square

  }

  var rTri = 0
  var rSquare = 0
  var triSixty = 0
  var rSQSixty = 0

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
