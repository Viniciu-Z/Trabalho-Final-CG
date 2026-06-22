import { getGL, createShader, createProgram } from "./Utils.js";
import { sala, objetos, criarSala } from "./cenario.js";
import { getViewProjection, camera } from "./camera.js";
import { initInput, updateMovement } from "./input.js";
import { loadTexture } from "./Texture.js";
import { multiply, translation, scaling, rotationX, rotationY } from "./math.js";
import { loadOBJ } from "./OBJLoader.js"; 

let gl;
let prog;

let bufferSala;
let bufferObjetos;
let wallTexture;

let tempoAnimacao = 0;

const modelos = [];

// Configurações de Iluminação
const lightPos = [0, 25, 0];
const lightDirection = [0, -1, 0];
const lightColor = [1.0, 1.0, 1.0];

// Dicionário/Lista Central de Objetos do Cenário
const listaDeModelos = [
    {
        path: "obj/Skull.obj",
        position: [0, 10, 0],
        scale: [0.5, 0.5, 0.5],
        texturePath: "img/T_Skull_Albedo.png"
    },{
        path: "obj/mammoth.obj",
        position: [30, 2, 5],
        scale: [4, 4, 4],
        texturePath: "img/mammoth.png"
    },{
        path: "obj/dinosaur.obj",
        position: [-30, 2, 80],
        scale: [10, 10, 10],
        color: [1, 1, 1, 1]
    },{
        path: "obj/torso_bronze.obj",
        position: [30, 2, -80],
        scale: [5, 5, 5],
        texturePath: "img/torso_bronze.jpeg"
    },{
        path: "obj/sword.obj",
        position: [-30, 10, -80],
        scale: [5, 5, 5],
        color: [0.0, 0.61, 0.43, 1.0]
    }
];

/**
 * Carrega e configura sequencialmente a lista de modelos do cenário.
 */
async function carregarModelosCenario(gl, lista) {
    const carregados = [];
    
    for (const config of lista) {
        const obj = await loadOBJ(gl, config.path);
        obj.path = config.path;
        
        // Aplica transformações e propriedades base
        obj.position = config.position || [0, 0, 0];
        obj.scale = config.scale || [1, 1, 1];
        
        // Trata textura ou cor sólida de forma exclusiva
        if (config.texturePath) {
            obj.texture = loadTexture(gl, config.texturePath);
        } else if (config.color) {
            obj.color = config.color;
        }
        
        carregados.push(obj);
    }
    
    return carregados;
}

function configurarAtributos() {
    const stride = 12 * 4;

    // Posição
    const position = gl.getAttribLocation(prog, "position");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(position);

    // Cor
    const color = gl.getAttribLocation(prog, "color");
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, stride, 3 * 4);
    gl.enableVertexAttribArray(color);

    // Textura
    const texCoord = gl.getAttribLocation(prog, "texCoord");
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, stride, 7 * 4);
    gl.enableVertexAttribArray(texCoord);

    // Normal
    const normal = gl.getAttribLocation(prog, "normal");
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, stride, 9 * 4);
    gl.enableVertexAttribArray(normal);
}

function desenharOBJ(obj) {
    const { proj, view } = getViewProjection(gl.canvas);

    let posicao = [...obj.position];
    let rotacao = null;

    // Apenas a Skull será animada
    if (obj.path && obj.path.includes("Skull")) {

        // movimento de sobe e desce
        posicao[1] += Math.sin(tempoAnimacao) * 0.4;

        // rotação contínua
        rotacao = rotationY(tempoAnimacao);
    }

    const T = translation(
        posicao[0],
        posicao[1],
        posicao[2]
    );

    const S = scaling(
        obj.scale[0],
        obj.scale[1],
        obj.scale[2]
    );

    let model;

    if(rotacao){
        model = multiply(T, multiply(rotacao, S));
    }else{
        model = multiply(T, S);
    }

    const transforma = multiply(proj, multiply(view, model));

    gl.uniformMatrix4fv(
        gl.getUniformLocation(prog, "transf"),
        false,
        new Float32Array(transforma)
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    configurarAtributos();

    if (obj.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, obj.texture);
        gl.uniform1i(gl.getUniformLocation(prog, "tex"), 0);
        gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 1);
    } else {
        gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 0);
        const corSolida = obj.color || [1.0, 1.0, 1.0, 1.0]; 
        gl.uniform4fv(
            gl.getUniformLocation(prog, "objectColor"),
            new Float32Array(corSolida)
        );
    }

    gl.drawArrays(gl.TRIANGLES, 0, obj.quantidadeVertices);
}

async function init() {
    const canvas = document.getElementById("glcanvas1");
    gl = getGL(canvas);

    if (!gl) return;

    // Inicialização de Shaders e Programa
    const vtxShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById("vertex-shader").text);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("frag-shader").text);
    prog = createProgram(gl, vtxShader, fragShader);
    gl.useProgram(prog);

    // Construção do Cenário Estático
    criarSala(50, 30, 100);
    wallTexture = loadTexture(gl, "img/madeira.jpeg");

    // Inicialização de Buffers Fixos
    bufferSala = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sala.vertices), gl.STATIC_DRAW);

    bufferObjetos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objetos.vertices), gl.STATIC_DRAW);

    // Carregamento Dinâmico de Modelos Complexos (OBJ)
    const modelosCarregados = await carregarModelosCenario(gl, listaDeModelos);
    modelos.push(...modelosCarregados);

    // Configurações Globais do WebGL e Input
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    initInput(canvas);

    draw();
}

function enviarIluminacao() {
    gl.uniform3fv(gl.getUniformLocation(prog, "lightpos"), new Float32Array(lightPos));
    gl.uniform3fv(gl.getUniformLocation(prog, "lightDirection"), new Float32Array(lightDirection));
    gl.uniform3fv(gl.getUniformLocation(prog, "lightColor"), new Float32Array(lightColor));
    gl.uniform3fv(gl.getUniformLocation(prog, "campos"), new Float32Array(camera.pos));
}

function draw() {
    updateMovement();
    tempoAnimacao += 0.02;

    const { proj, view } = getViewProjection(gl.canvas);
    const modelIdentity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    const transforma = multiply(proj, multiply(view, modelIdentity));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "transf"), false, new Float32Array(transforma));

    enviarIluminacao();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 1. Renderização da Sala
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);
    configurarAtributos();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.uniform1i(gl.getUniformLocation(prog, "tex"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 1);
    gl.drawArrays(gl.TRIANGLES, 0, sala.quantidadeVertices);

    // 2. Renderização dos Pedestais (Objetos da Sala)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);
    configurarAtributos();
    gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 0);
    gl.uniform4fv(gl.getUniformLocation(prog, "objectColor"), new Float32Array([1.0, 1.0, 1.0, 1.0]));
    gl.drawArrays(gl.TRIANGLES, 0, objetos.quantidadeVertices);

    // 3. Renderização dos Modelos Dinâmicos/Lista
    for (const obj of modelos) {
        desenharOBJ(obj);
    }

    requestAnimationFrame(draw);
}

window.onload = init;