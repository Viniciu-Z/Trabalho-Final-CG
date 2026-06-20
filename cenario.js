export const sala = {
    vertices: [],
    quantidadeVertices: 0
};

export const objetos = {
    vertices: [],
    quantidadeVertices: 0
};

function face(a, b, c, d, normal, cor)
{
    return [
        ...a, ...cor, 0,1, ...normal,
        ...b, ...cor, 1,1, ...normal,
        ...c, ...cor, 1,0, ...normal,

        ...a, ...cor, 0,1, ...normal,
        ...c, ...cor, 1,0, ...normal,
        ...d, ...cor, 0,0, ...normal
    ];
}

export function adicionarParalelepipedo(largura, altura, comprimento, x, y, z, cor)
{
    const lx = largura / 2;
    const lz = comprimento / 2;

    const x0 = x - lx;
    const x1 = x + lx;

    const y0 = y;
    const y1 = y + altura;

    const z0 = z - lz;
    const z1 = z + lz;

    objetos.vertices.push(

        // Piso
        ...face(
            [x0,y0,z0],
            [x1,y0,z0],
            [x1,y0,z1],
            [x0,y0,z1],
            [0,-1,0],
            cor
        ),

        // Teto
        ...face(
            [x0,y1,z1],
            [x1,y1,z1],
            [x1,y1,z0],
            [x0,y1,z0],
            [0,1,0],
            cor
        ),

        // Frente
        ...face(
            [x0,y0,z1],
            [x1,y0,z1],
            [x1,y1,z1],
            [x0,y1,z1],
            [0,0,1],
            cor
        ),

        // Trás
        ...face(
            [x1,y0,z0],
            [x0,y0,z0],
            [x0,y1,z0],
            [x1,y1,z0],
            [0,0,-1],
            cor
        ),

        // Esquerda
        ...face(
            [x0,y0,z0],
            [x0,y0,z1],
            [x0,y1,z1],
            [x0,y1,z0],
            [-1,0,0],
            cor
        ),

        // Direita
        ...face(
            [x1,y0,z1],
            [x1,y0,z0],
            [x1,y1,z0],
            [x1,y1,z1],
            [1,0,0],
            cor
        )
    );
}

export function criarSala(largura, altura, comprimento)
{
    const x = largura;
    const y = altura;
    const z = comprimento;

    const piso = [0.7,0.7,0.7,1];
    const teto = [0.85,0.85,0.85,1];
    const parede = [1,1,1,1];
    const pedestal = [0.55,0.55,0.55,1];

    sala.vertices = [];
    objetos.vertices = [];

    sala.vertices.push(

        // Piso
        ...face(
            [-x,0,-z],
            [ x,0,-z],
            [ x,0, z],
            [-x,0, z],
            [0,1,0],
            piso
        ),

        // Teto
        ...face(
            [-x,y, z],
            [ x,y, z],
            [ x,y,-z],
            [-x,y,-z],
            [0,-1,0],
            teto
        ),

        // Parede Norte
        ...face(
            [-x,0,-z],
            [-x,y,-z],
            [ x,y,-z],
            [ x,0,-z],
            [0,0,-1],
            parede
        ),

        // Parede Sul
        ...face(
            [ x,0, z],
            [ x,y, z],
            [-x,y, z],
            [-x,0, z],
            [0,0,1],
            parede
        ),

        // Parede Oeste
        ...face(
            [-x,0, z],
            [-x,y, z],
            [-x,y,-z],
            [-x,0,-z],
            [-1,0,0],
            parede
        ),

        // Parede Leste
        ...face(
            [ x,0,-z],
            [ x,y,-z],
            [ x,y, z],
            [ x,0, z],
            [1,0,0],
            parede
        )
    );

    adicionarParalelepipedo(10,1.5,10,0,0,0,pedestal);
    adicionarParalelepipedo(10,1.5,10,0,0,-40,pedestal);
    adicionarParalelepipedo(10,1.5,10,0,0,40,pedestal);
    adicionarParalelepipedo(10,1.5,10,-40,0,0,pedestal);
    adicionarParalelepipedo(10,1.5,10,40,0,0,pedestal);

    sala.quantidadeVertices = sala.vertices.length / 12;
    objetos.quantidadeVertices = objetos.vertices.length / 12;
}