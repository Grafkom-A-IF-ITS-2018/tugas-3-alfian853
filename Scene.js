function Scene(factory) {
  var factory = factory
  var mvMatrix = mat4.create()
  var mvMatrixStack = []
  var pMatrix = mat4.create()
  var gl = factory.gl

  this.mvMatrix = mvMatrix
  this.pMatrix = pMatrix
  this.factory = factory
  

  function mvPushMatrix() {
    var copy = mat4.create()
    mat4.copy(copy, mvMatrix)
    mvMatrixStack.push(copy)
  }
  function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Tumpukan matriks kosong"
    }
    mvMatrix = mvMatrixStack.pop()
  }
  function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix)
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix)
  }
  
  this.defaultDrawScene = function(){
    gl.bindBuffer(gl.ARRAY_BUFFER, factory.hurufVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(factory.huruf.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, factory.hurufVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
    setMatrixUniforms()
    gl.drawArrays(gl.TRIANGLES, 0, factory.hurufVertexPositionBuffer.numItems)

    gl.bindBuffer(gl.ARRAY_BUFFER, factory.squareVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(factory.square.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, factory.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
    setMatrixUniforms()
    gl.drawArrays(gl.LINES, 0, factory.squareVertexPositionBuffer.numItems)
  }

  this.setGlViewPort = function(sx,sy,w,h){
    gl.scissor(sx,sy,w,h)
    gl.viewport(sx,sy,w,h)
  }
    //please override this
  this.drawScene = function(sx,sy,w,h){
    this.setGlViewPort(sx,sy,w,h)
    this.defaultDrawScene()
  }

}

