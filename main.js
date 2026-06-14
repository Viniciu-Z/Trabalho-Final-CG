import {getGL, createShader, createProgram} from "./utils.js";

function init()
{
    const canvas = document.getElementById("glcanvas1");
    const gl = getGL(canvas);

    if(!gl)
        return;


    const vertexSource = document.getElementById("vertex-shader").text;
    const fragmentSource = document.getElementById("frag-shader").text;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);


    // TRIÂNGULO
    const vertices = new Float32Array([
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.0,  0.5, 0.0
        ]);

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");

    gl.enableVertexAttribArray(position);

    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

    // DESENHO
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

window.onload = init;