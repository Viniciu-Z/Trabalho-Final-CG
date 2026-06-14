export function getGL(canvas)
{
    let gl = canvas.getContext("webgl");

    if(gl)
        return gl;
    gl = canvas.getContext("experimental-webgl");

    if(gl)
        return gl;

    alert("WebGL não suportado.");
    return null;
}

export function createShader(gl, shaderType, shaderSrc)
{
    const shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);

    return null;
}

export function createProgram(gl, vtxShader, fragShader)
{
    const prog = gl.createProgram();

    gl.attachShader(prog, vtxShader);
    gl.attachShader(prog, fragShader);

    gl.linkProgram(prog);

    if(gl.getProgramParameter(prog, gl.LINK_STATUS))
        return prog;

    console.error(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);

    return null;
}