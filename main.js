import {
    getGL,
    createShader,
    createProgram
} from "./Utils.js";

import {
    cenario,
    criarSala
}
from "./cenario.js";

import {
    rotationX,
    rotationY,
    rotationZ,
    multiply
}
from "./math.js";

import {
    getViewProjection
}
from "./camera.js";

import {
    initInput,
    updateMovement
}
from "./input.js";

let gl;
let prog;

function init()
{
    const canvas =
        document.getElementById(
            "glcanvas1"
        );

    gl = getGL(canvas);

    if(!gl)
        return;

    const vtxShader =
    createShader(
        gl,
        gl.VERTEX_SHADER,
        document.getElementById("vertex-shader").text
    );

    const fragShader =
        createShader(
            gl,
            gl.FRAGMENT_SHADER,
            document.getElementById("frag-shader").text
        );

    prog =
        createProgram(
            gl,
            vtxShader,
            fragShader
        );

    gl.useProgram(prog);

    //----------------------------------
    // Sala
    //----------------------------------

    criarSala(
        50,
        15,
        50
    );

    //----------------------------------
    // Buffer
    //----------------------------------

    const buffer =
        gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
            cenario.vertices
        ),
        gl.STATIC_DRAW
    );

    //----------------------------------
    // Posição
    //----------------------------------

    const position =
        gl.getAttribLocation(
            prog,
            "position"
        );

    gl.vertexAttribPointer(
        position,
        3,
        gl.FLOAT,
        false,
        7 * 4,
        0
    );

    gl.enableVertexAttribArray(
        position
    );

    //----------------------------------
    // Cor
    //----------------------------------

    const color =
        gl.getAttribLocation(
            prog,
            "color"
        );

    gl.vertexAttribPointer(
        color,
        4,
        gl.FLOAT,
        false,
        7 * 4,
        3 * 4
    );

    gl.enableVertexAttribArray(
        color
    );

    //----------------------------------

    gl.enable(
        gl.DEPTH_TEST
    );

    gl.clearColor(
        0.1,
        0.1,
        0.1,
        1
    );

    initInput(canvas);

    draw();
}

function draw()
{
    updateMovement();

    const {
        proj,
        view
    } =
    getViewProjection(
        gl.canvas
    );

    //----------------------------------
    // Sem rotação
    //----------------------------------

    const model = [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];

    let transforma =
        multiply(
            view,
            model
        );

    transforma =
        multiply(
            proj,
            transforma
        );

    const transf =
        gl.getUniformLocation(
            prog,
            "transf"
        );

    gl.uniformMatrix4fv(
        transf,
        false,
        new Float32Array(
            transforma
        )
    );

    gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        cenario.quantidadeVertices
    );

    requestAnimationFrame(
        draw
    );
}

window.onload = init;