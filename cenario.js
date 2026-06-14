export function criarCenario(gl, prog, df)
{
    const vertices = new Float32Array([

        // Frente
        -0.5, -0.5, 0.5, 1,0,0,1,
         0.5, -0.5, 0.5, 0,1,0,1,
         0.5,  0.5, 0.5, 0,0,1,1,

        -0.5, -0.5, 0.5, 1,0,0,1,
         0.5,  0.5, 0.5, 0,0,1,1,
        -0.5,  0.5, 0.5, 1,1,0,1,

        // Fundo
        -0.5, -0.5,-0.5, 1,0,1,1,
         0.5,  0.5,-0.5, 0,1,1,1,
         0.5, -0.5,-0.5, 0,1,0,1,

        -0.5, -0.5,-0.5, 1,0,1,1,
        -0.5,  0.5,-0.5, 1,1,1,1,
         0.5,  0.5,-0.5, 0,1,1,1
    ]);

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // POSITION
    const position = gl.getAttribLocation(prog, "position");

    gl.enableVertexAttribArray(position);

    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 7 * 4, 0);

    // COLOR
    const color = gl.getAttribLocation(prog, "color");

    gl.enableVertexAttribArray(color);

    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 7 * 4, 3 * 4);

    // DF
    const dfPtr =gl.getUniformLocation(prog, "df");

    gl.uniform1f(dfPtr, df);

    return {quantidadeVertices: 12};
}