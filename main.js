import {getGL, createShader, createProgram} from "./utils.js";
import {criarCenario} from "./cenario.js";
import {getViewProjection} from "./camera.js";
import {multiply, rotationX, rotationY, rotationZ} from "./math.js";
import {initInput, updateMovement} from "./input.js";

let gl;
let prog;
let angle = 0;
let cenario;

function init()
{
    const canvas = document.getElementById("glcanvas1");

    gl = getGL(canvas);
    initInput(canvas);

    if (!gl)
        return;


    // SHADERS
    const vertexSource = document.getElementById("vertex-shader").text;
    const fragmentSource = document.getElementById("frag-shader").text;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    prog = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(prog);

    // CONFIGURAÇÃO WEBGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // CENÁRIO
    cenario = criarCenario(gl, prog);

    // LOOP
    requestAnimationFrame(draw);
}

function draw()
{
    updateMovement();
    // MATRIZES DA CÂMERA
    const {proj, view} = getViewProjection(gl.canvas);

    // ROTAÇÕES
    const rad = angle * Math.PI / 180.0;

    const rotX = rotationX(rad);

    const rotY = rotationY(rad);

    const rotZ = rotationZ(rad);

    // MODEL MATRIX
    let model = multiply(rotY, rotX);

    model = multiply(rotZ, model);

    // MVP
    let transforma = multiply(view, model);
    transforma = multiply(proj, transforma);

    // ENVIA MATRIZ AO SHADER
    const transfPtr = gl.getUniformLocation(prog, "transf");

    gl.uniformMatrix4fv(transfPtr, false, new Float32Array(transforma));

    // LIMPA TELA
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // DESENHA CENÁRIO

    gl.drawArrays(gl.TRIANGLES, 0, cenario.quantidadeVertices);

    // ANIMAÇÃO
    angle += 1;
    requestAnimationFrame(draw);
}

window.onload = init;