export function loadTexture(gl, src) {
    const texture = gl.createTexture();
    const image = new Image();

    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Configurações da textura
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    image.src = src;

    return texture;
}