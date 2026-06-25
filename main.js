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

// Iluminação
const lightPos = [0, 25, 0];
const lightDirection = [0, -1, 0];
const lightColor = [1.0, 1.0, 1.0];
const ambientColor = [0.35, 0.35, 0.35];

// Objetos do cenario
const listaDeModelos = [
    {
        path: "obj/Skull.obj",
        position: [0, 7, 0],
        scale: [0.25, 0.25, 0.25],
        texturePath: "img/T_Skull_AO.png"
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
        color: [0.35, 0.95, 0.75, 1.0]
    }
];


// Carrega e configura sequencialmente a lista de modelos do cenário.
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

    // Animação para o obj Skull
    if (obj.path && obj.path.includes("Skull")) {

        posicao[1] += Math.sin(tempoAnimacao) * 0.4;
        rotacao = rotationY(tempoAnimacao);
    }

    const T = translation(posicao[0], posicao[1], posicao[2]);
    const S = scaling(obj.scale[0], obj.scale[1], obj.scale[2]);

    let model;

    if(rotacao){
        model = multiply(T, multiply(rotacao, S));
    }else{
        model = multiply(T, S);
    }

    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "projection"), false, new Float32Array(proj));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "view"), false, new Float32Array(view));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "model"), false, new Float32Array(model));

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

    // Inicialização de shaders e programas
    const vtxShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById("vertex-shader").text);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("frag-shader").text);
    prog = createProgram(gl, vtxShader, fragShader);
    gl.useProgram(prog);

    // Cenario
    criarSala(50, 30, 100);
    wallTexture = loadTexture(gl, "img/Cinza.jpg");

    // Inicialização de buffers
    bufferSala = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sala.vertices), gl.STATIC_DRAW);

    bufferObjetos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objetos.vertices), gl.STATIC_DRAW);

    // Carregamento de modelos obj
    const modelosCarregados = await carregarModelosCenario(gl, listaDeModelos);
    modelos.push(...modelosCarregados);

    // Globais webgl e input
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    initInput(canvas);

    draw();
}

function enviarIluminacao(){
    gl.uniform3fv(gl.getUniformLocation(prog,"lightpos"), camera.pos);
    gl.uniform3fv(gl.getUniformLocation(prog,"lightDirection"), camera.front);
    gl.uniform3fv(gl.getUniformLocation(prog,"campos"), camera.pos);
    gl.uniform3fv(gl.getUniformLocation(prog,"lightColor"), [1,1,1]);
    gl.uniform3fv(gl.getUniformLocation(prog,"ambientColor"), ambientColor);
    gl.uniform1f(gl.getUniformLocation(prog,"cutOff"), Math.cos(15*Math.PI/180));
    gl.uniform1f(gl.getUniformLocation(prog,"outerCutOff"), Math.cos(20*Math.PI/180));
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

    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "projection"), false, new Float32Array(proj));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "view"), false, new Float32Array(view));
    gl.uniformMatrix4fv(gl.getUniformLocation(prog, "model"), false, new Float32Array(modelIdentity));

    enviarIluminacao();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Renderização da Sala
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSala);
    configurarAtributos();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.uniform1i(gl.getUniformLocation(prog, "tex"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 1);
    gl.drawArrays(gl.TRIANGLES, 0, sala.quantidadeVertices);

    // Renderização dos Pedestais 
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferObjetos);
    configurarAtributos();
    gl.uniform1i(gl.getUniformLocation(prog, "usarTextura"), 0);
    gl.uniform4fv(gl.getUniformLocation(prog, "objectColor"), new Float32Array([1.0, 1.0, 1.0, 1.0]));
    gl.drawArrays(gl.TRIANGLES, 0, objetos.quantidadeVertices);

    // Renderização dos obj
    for (const obj of modelos) {
        desenharOBJ(obj);
    }

    requestAnimationFrame(draw);
}

window.onload = init;