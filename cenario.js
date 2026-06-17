export const cenario = {vertices: [], quantidadeVertices: 0};

function face(a, b, c, d, cor){
    return [

        ...a, ...cor,
        ...b, ...cor,
        ...c, ...cor,

        ...a, ...cor,
        ...c, ...cor,
        ...d, ...cor
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

    cenario.vertices.push(

        // Piso
        ...face(
            [x0,y0,z0],
            [x1,y0,z0],
            [x1,y0,z1],
            [x0,y0,z1],
            cor
        ),

        // Teto
        ...face(
            [x0,y1,z1],
            [x1,y1,z1],
            [x1,y1,z0],
            [x0,y1,z0],
            cor
        ),

        // Frente
        ...face(
            [x0,y0,z1],
            [x1,y0,z1],
            [x1,y1,z1],
            [x0,y1,z1],
            cor
        ),

        // Trás
        ...face(
            [x1,y0,z0],
            [x0,y0,z0],
            [x0,y1,z0],
            [x1,y1,z0],
            cor
        ),

        // Esquerda
        ...face(
            [x0,y0,z0],
            [x0,y0,z1],
            [x0,y1,z1],
            [x0,y1,z0],
            cor
        ),

        // Direita
        ...face(
            [x1,y0,z1],
            [x1,y0,z0],
            [x1,y1,z0],
            [x1,y1,z1],
            cor
        )
    );
}

export function criarSala(largura, altura, comprimento){
    const x = largura;
    const y = altura;
    const z = comprimento;

    const piso = [0.7,0.7,0.7,1];
    const teto = [0.85,0.85,0.85,1];
    const parede = [0.9,0.9,0.9,1];
    const pedestal = [0.55,0.55,0.55,1];

    cenario.vertices = [

        // Piso
        ...face(
            [-x,0,-z],
            [ x,0,-z],
            [ x,0, z],
            [-x,0, z],
            piso
        ),

        // Teto
        ...face(
            [-x,y, z],
            [ x,y, z],
            [ x,y,-z],
            [-x,y,-z],
            teto
        ),

        // Parede Norte
        ...face(
            [-x,0,-z],
            [-x,y,-z],
            [ x,y,-z],
            [ x,0,-z],
            parede
        ),

        // Parede Sul
        ...face(
            [ x,0, z],
            [ x,y, z],
            [-x,y, z],
            [-x,0, z],
            parede
        ),

        // Parede Oeste
        ...face(
            [-x,0, z],
            [-x,y, z],
            [-x,y,-z],
            [-x,0,-z],
            parede
        ),

        // Parede Leste
        ...face(
            [ x,0,-z],
            [ x,y,-z],
            [ x,y, z],
            [ x,0, z],
            parede
        )
    ];

    adicionarParalelepipedo(10,1.5,10,0,0,0,pedestal);
    adicionarParalelepipedo(10,1.5,10,0,0,-40,pedestal);
    adicionarParalelepipedo(10,1.5,10,0,0,40,pedestal);
    adicionarParalelepipedo(10,1.5,10,-40,0,0,pedestal);
    adicionarParalelepipedo(10,1.5,10,40,0,0,pedestal);

    cenario.quantidadeVertices = cenario.vertices.length / 7;
}