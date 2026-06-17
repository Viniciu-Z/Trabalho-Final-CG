export const cenario = {
    vertices: [],
    quantidadeVertices: 0
};

function face(a, b, c, d, cor)
{
    return [

        ...a, ...cor,
        ...b, ...cor,
        ...c, ...cor,

        ...a, ...cor,
        ...c, ...cor,
        ...d, ...cor
    ];
}

export function criarSala(
    largura,
    altura,
    comprimento
)
{
    const x = largura / 2;
    const y = altura;
    const z = comprimento / 2;

    const piso = [0.7,0.7,0.7,1];
    const teto = [0.85,0.85,0.85,1];
    const parede = [0.9,0.9,0.9,1];

    cenario.vertices = [

        //----------------------------------
        // Piso
        //----------------------------------

        ...face(
            [-x,0,-z],
            [ x,0,-z],
            [ x,0, z],
            [-x,0, z],
            piso
        ),

        //----------------------------------
        // Teto
        //----------------------------------

        ...face(
            [-x,y, z],
            [ x,y, z],
            [ x,y,-z],
            [-x,y,-z],
            teto
        ),

        //----------------------------------
        // Parede Norte
        //----------------------------------

        ...face(
            [-x,0,-z],
            [-x,y,-z],
            [ x,y,-z],
            [ x,0,-z],
            parede
        ),

        //----------------------------------
        // Parede Sul
        //----------------------------------

        ...face(
            [ x,0, z],
            [ x,y, z],
            [-x,y, z],
            [-x,0, z],
            parede
        ),

        //----------------------------------
        // Parede Oeste
        //----------------------------------

        ...face(
            [-x,0, z],
            [-x,y, z],
            [-x,y,-z],
            [-x,0,-z],
            parede
        ),

        //----------------------------------
        // Parede Leste
        //----------------------------------

        ...face(
            [ x,0,-z],
            [ x,y,-z],
            [ x,y, z],
            [ x,0, z],
            parede
        )
    ];

    cenario.quantidadeVertices =
        cenario.vertices.length / 7;
}