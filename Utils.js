// Obtém o contexto WebGL do canvas
export function getGL(canvas) {
    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {
        alert("WebGL não suportado.");
        return null;
    }

    return gl;
}

// Cria e compila um shader
export function createShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const compiled = gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
    );

    if (!compiled) {
        console.error("Erro ao compilar shader:");
        console.error(gl.getShaderInfoLog(shader));

        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Cria e linka um programa WebGL
export function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    const linked = gl.getProgramParameter(
        program,
        gl.LINK_STATUS
    );

    if (!linked) {
        console.error("Erro ao linkar programa:");
        console.error(gl.getProgramInfoLog(program));

        gl.deleteProgram(program);
        return null;
    }

    return program;
}