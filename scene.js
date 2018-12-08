function Scene(factory) {
  var factory = factory
  var gl = factory.gl
  var mvMatrix = mat4.create()
  var mvMatrixStack = []
  var pMatrix = mat4.create()

  this.mvMatrix = mvMatrix
  this.pMatrix = pMatrix

  this.factory = factory
  var shaderManager = factory.shaderManager

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
  function setMatrixUniforms(shaderProgram,n) {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix)
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix)  
  }
  
  var shaderProgram = shaderManager.getAndSwitchShader('texture-shader')
  this.defaultDrawScene = function(){
    var colorLoc = gl.getAttribLocation(shaderProgram,"aVertexColor");
    var texcoordLoc = gl.getAttribLocation(shaderProgram,"aTextureCoord");
    
    mvPushMatrix()
    gl.disableVertexAttribArray(colorLoc);
    gl.vertexAttrib4f(colorLoc, 1, 1, 1, 1);
    gl.enableVertexAttribArray(texcoordLoc)

    gl.bindBuffer(gl.ARRAY_BUFFER, factory.squareVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(factory.square.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, factory.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, factory.squareTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, factory.squareTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, factory.crateTextures[2])
    gl.uniform1i(shaderProgram.samplerUniform, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, factory.squareVertexIndexBuffer)
    setMatrixUniforms(shaderProgram)

    gl.drawElements(gl.TRIANGLES, factory.squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)
    mvPopMatrix()
    
    let whiteTex = gl.createTexture();
    gl.disableVertexAttribArray(texcoordLoc);
    gl.bindTexture(gl.TEXTURE_2D, whiteTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1, 1, 1, 1]));

    gl.enableVertexAttribArray(colorLoc);
    
    mvPushMatrix()
    gl.bindBuffer(gl.ARRAY_BUFFER, factory.hurufVertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(factory.huruf.positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, factory.hurufVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    setMatrixUniforms(shaderProgram)
    gl.drawArrays(gl.TRIANGLES, 0, factory.hurufVertexPositionBuffer.numItems)
    mvPopMatrix()

  }


  this.setGlViewPort = function(sx,sy,w,h){
    gl.viewport(sx,sy,w,h)
  }
  //please override this  
  this.drawScene = function(sx,sy,w,h){
    this.setGlViewPort(sx,sy,w,h)
    this.defaultDrawScene()
  }

}

