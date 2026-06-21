import { getGL, createShader, createProgram } from "./Utils.js";
import { sala, objetos, criarSala } from "./cenario.js";
import { getViewProjection, camera } from "./camera.js";
import { initInput, updateMovement } from "./input.js";
import { loadTexture } from "./Texture.js";
import { multiply } from "./math.js";

let gl;
let prog;

let bufferSala;
let bufferObjetos;

let wallTexture;

// Luz
const lightPos = [0, 25, 0];
const lightDirection = [0, -1, 0];
const lightColor = [1.0, 1.0, 1.0];

function configurarAtributos()
{
    const stride = 12 * 4;

    // posição
    const position =
        gl.getAttribLocation(prog, "position");

    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(position);

    // cor
    const color = gl.getAttribLocation(prog, "color");
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(color);

    // textura
    const texCoord = gl.getAttribLocation(prog, "texCoord");
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, stride, 7 * 4);
    gl.enableVertexAttribArray(texCoord);

    // normal
    const normal = gl.getAttribLocation(prog, "normal");
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, stride, 9 * 4);
    gl.enableVertexAttribArray(normal);
}

function init()
{
    const canvas = document.getElementById("glcanvas1");

    gl = getGL(canvas);

    if (!gl)
        return;

    const vtxShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById("vertex-shader").text);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("frag-shader").text);

    prog = createProgram(gl, vtxShader, fragShader);
    gl.useProgram(prog);

    // cria sala
    criarSala(50, 30, 100);

    // textura
    wallTexture =loadTexture(gl, "img/madeira.jpeg");

    // buffer sala
    bufferSala = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sala.vertices), gl.STATIC_DRAW);

    // buffer objetos
    bufferObjetos = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objetos.vertices), gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0.1, 0.1, 0.1, 1);
    initInput(canvas);

    draw();
}

function enviarIluminacao()
{
    // posição da luz
    gl.uniform3fv(gl.getUniformLocation(prog, "lightpos"), new Float32Array(lightPos));
    // direção
    gl.uniform3fv(gl.getUniformLocation(prog, "lightDirection"), new Float32Array(lightDirection));
    // cor
    gl.uniform3fv(gl.getUniformLocation(prog, "lightColor"), new Float32Array(lightColor));
    // posição da câmera
    gl.uniform3fv(gl.getUniformLocation(prog, "campos"), new Float32Array(camera.pos));
}

function draw()
{
    updateMovement();

    const { proj, view } = getViewProjection(gl.canvas);

    const model =
    [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    const transforma = multiply(proj, multiply(view, model));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "transf"), false, new Float32Array(transforma));

    enviarIluminacao();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Sala
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);
    configurarAtributos();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.uniform1i(gl.getUniformLocation(prog,"tex"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 1);
    gl.drawArrays(gl.TRIANGLES, 0, sala.quantidadeVertices);

    // Pedestais
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);
    configurarAtributos();
    gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 0);
    gl.drawArrays(gl.TRIANGLES, 0, objetos.quantidadeVertices);

    requestAnimationFrame(draw);
}

window.onload = init;