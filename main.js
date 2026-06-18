import { getGL, createShader, createProgram } from "./Utils.js";
import { sala, objetos, criarSala } from "./cenario.js";
import { getViewProjection } from "./camera.js";
import { initInput, updateMovement } from "./input.js";
import { loadTexture } from "./Texture.js";
import { multiply } from "./math.js";

let gl;
let prog;

let bufferSala;
let bufferObjetos;

let wallTexture;

function configurarAtributos()
{
    // Posição
    const position = gl.getAttribLocation(prog, "position");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 9 * 4, 0);
    gl.enableVertexAttribArray(position);

    // Cor
    const color = gl.getAttribLocation(prog, "color");
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 9 * 4, 3 * 4);
    gl.enableVertexAttribArray(color);

    // Coordenadas de textura
    const texCoord = gl.getAttribLocation(prog, "texCoord");
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 9 * 4, 7 * 4);
    gl.enableVertexAttribArray(texCoord);
}

function init()
{
    const canvas = document.getElementById("glcanvas1");

    gl = getGL(canvas);

    if (!gl)
        return;

    const vtxShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        document.getElementById("vertex-shader").text
    );

    const fragShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        document.getElementById("frag-shader").text
    );

    prog = createProgram(gl, vtxShader, fragShader);

    gl.useProgram(prog);

    // Cria a sala
    criarSala(50, 15, 50);

    // Carrega textura das paredes
    wallTexture = loadTexture(gl, "img/textura_parede.jpeg");

    //----------------------------
    // Buffer da sala
    //----------------------------
    bufferSala = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(sala.vertices),
        gl.STATIC_DRAW
    );

    //----------------------------
    // Buffer dos objetos
    //----------------------------
    bufferObjetos = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(objetos.vertices),
        gl.STATIC_DRAW
    );

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.1, 0.1, 1);

    initInput(canvas);

    draw();
}

function draw()
{
    updateMovement();

    const { proj, view } = getViewProjection(gl.canvas);

    const model = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    const transforma = multiply(
        proj,
        multiply(view, model)
    );

    gl.uniformMatrix4fv(
        gl.getUniformLocation(prog, "transf"),
        false,
        new Float32Array(transforma)
    );

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //------------------------------------
    // DESENHA A SALA (COM TEXTURA)
    //------------------------------------

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);

    configurarAtributos();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);

    gl.uniform1i(
        gl.getUniformLocation(prog, "tex"),
        0
    );

    // Diz ao shader para usar textura
    gl.uniform1i(
        gl.getUniformLocation(prog, "usarTextura"),
        1
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        sala.quantidadeVertices
    );

    //------------------------------------
    // DESENHA OS PEDESTAIS (SEM TEXTURA)
    //------------------------------------

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);

    configurarAtributos();

    // Diz ao shader para IGNORAR a textura
    gl.uniform1i(
        gl.getUniformLocation(prog, "usarTextura"),
        0
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        objetos.quantidadeVertices
    );

    requestAnimationFrame(draw);
}

window.onload = init;