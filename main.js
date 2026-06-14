import {getGL, createShader, createProgram} from "./utils.js";
import {criarCenario} from "./cenario.js";

let gl;
let prog;

let angle = 0;
let df = 2.0;

let cenario;

function init()
{
    const canvas = document.getElementById("glcanvas1");

    gl = getGL(canvas);

    if (!gl)
        return;

    // SHADERS
    const vertexSource = document.getElementById("vertex-shader").text;
    const fragmentSource = document.getElementById("frag-shader").text;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER,fragmentSource);
    prog = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(prog);

    // WEBGL
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 1);

    gl.enable(gl.DEPTH_TEST);

    // CENÁRIO
    cenario = criarCenario(gl, prog, df);

    requestAnimationFrame(draw);
}

function draw()
{
    const rad = angle * Math.PI / 180;

    const matrizRotacao = [

        Math.cos(rad),
        0,
        -Math.sin(rad),
        0,

        0,
        1,
        0,
        0,

        Math.sin(rad),
        0,
        Math.cos(rad),
        0,

        0,
        0,
        0,
        1
    ];

    const transf = gl.getUniformLocation(prog, "transf");

    gl.uniformMatrix4fv(transf, false, matrizRotacao);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, cenario.quantidadeVertices);

    angle++;

    requestAnimationFrame(draw);
}

window.onload = init;