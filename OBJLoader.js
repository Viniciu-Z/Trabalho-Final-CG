import {translation} from "./math.js";
import {loadTexture} from "./Texture.js";

export async function loadOBJ(gl, caminho){
    const resposta = await fetch(caminho);
    const texto = await resposta.text();

    const posicoes = [];
    const texCoords = [];
    const normais = [];
    const vertices = [];

    const linhas = texto.split("\n");

    for (let linha of linhas){
        linha = linha.trim();

        if (linha.length === 0 || linha.startsWith("#"))
            continue;

        const partes = linha.split(/\s+/);

        switch (partes[0]){
            // Vértices
            case "v":
                posicoes.push([
                    parseFloat(partes[1]),
                    parseFloat(partes[2]),
                    parseFloat(partes[3])
                ]);
                break;

            // UV
            case "vt":
                texCoords.push([
                    parseFloat(partes[1]),
                    1.0 - parseFloat(partes[2])
                ]);
                break;

            // Normal
            case "vn":
                normais.push([
                    parseFloat(partes[1]),
                    parseFloat(partes[2]),
                    parseFloat(partes[3])
                ]);
                break;

            // Face
            case "f":
                let face = [];

                for (let i = 1; i < partes.length; i++){
                    face.push(partes[i]);
                }

                // Triângulo
                if (face.length == 3){
                    adicionarTriangulo(
                        face[0],
                        face[1],
                        face[2]
                    );
                }

                // Quad
                else if (face.length == 4){
                    adicionarTriangulo(
                        face[0],
                        face[1],
                        face[2]
                    );

                    adicionarTriangulo(
                        face[0],
                        face[2],
                        face[3]
                    );
                }

                break;
        }
    }

    // Buffer
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);

    return {
        buffer,
        vertices,
        quantidadeVertices: vertices.length / 12,

        position: [0,0,0],
        rotation: [0,0,0],
        scale: [1,1,1],

        texture: null,
        color: [1, 1, 1, 1] 
    };

    // Função interna
    function adicionarTriangulo(a,b,c){
        adicionarVertice(a);
        adicionarVertice(b);
        adicionarVertice(c);
    }

    function adicionarVertice(indice){
        const dados = indice.split("/");
        const v = posicoes[parseInt(dados[0]) - 1];

        let vt = [0,0];

        if(dados.length > 1 && dados[1] !== ""){
            vt = texCoords[parseInt(dados[1]) - 1];
        }

        let vn = [0,1,0];

        if(dados.length > 2 && dados[2] !== ""){
            vn = normais[parseInt(dados[2]) - 1];
        }

        // posição
        vertices.push(v[0], v[1], v[2]);

        // cor branca
        vertices.push(1, 1, 1, 1);

        // textura
        vertices.push(vt[0], vt[1]);

        // normal
        vertices.push(vn[0], vn[1], vn[2]);
    }
}

export async function carregarModelos(gl, lista) {
    const carregados = [];
    
    for (const config of lista) {
        // Carrega o arquivo OBJ geométrico
        const obj = await loadOBJ(gl, config.path);
        
        // Aplica as propriedades customizadas
        obj.position = config.position || [0, 0, 0];
        
        if (config.texturePath) {
            obj.texture = loadTexture(gl, config.texturePath);
        } else if (config.color) {
            obj.color = config.color;
        }
        
        carregados.push(obj);
    }
    
    return carregados;
}
