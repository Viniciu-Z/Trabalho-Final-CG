export function subtract(a, b){ 
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function norm(v){
    return Math.sqrt( v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function normalize(v){
    const n = norm(v);
    return [v[0] / n, v[1] / n, v[2] / n];
}

export function cross(a, b){
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

export function translation(tx, ty, tz){
    return [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        tx,ty,tz,1
    ];
}

export function scaling(sx, sy, sz){
    return [
        sx,0,0,0,
        0,sy,0,0,
        0,0,sz,0,
        0,0,0,1
    ];
}

export function identity(){
    return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
}

export function multiply(a, b){
    const out = new Array(16);
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            out[j * 4 + i] =
                a[0 * 4 + i] * b[j * 4 + 0] +
                a[1 * 4 + i] * b[j * 4 + 1] +
                a[2 * 4 + i] * b[j * 4 + 2] +
                a[3 * 4 + i] * b[j * 4 + 3];
        }
    }
    return out;
}

export function perspective(fovy, aspect, near,far){
    const f = 1.0 / Math.tan( fovy * Math.PI / 360.0);
    return [
        f / aspect,0,0,0,
        0,f,0,0,
        0,0,(far + near)/(near - far),-1,
        0,0,(2 * far * near)/(near - far),0
    ];
}

export function lookAt(eye, target,up){
    const z = normalize(subtract(eye, target));
    const x = normalize(cross(up, z));
    const y =cross(z, x);
    return [
        x[0], y[0], z[0], 0,
        x[1], y[1], z[1], 0,
        x[2], y[2], z[2], 0,

        -(x[0]*eye[0] + x[1]*eye[1] + x[2]*eye[2]),
        -(y[0]*eye[0] + y[1]*eye[1] + y[2]*eye[2]),
        -(z[0]*eye[0] + z[1]*eye[1] + z[2]*eye[2]),
        1
    ];
}

export function rotationX(angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
        1,0,0,0,
        0,c,-s,0,
        0,s,c,0,
        0,0,0,1
    ];
}

export function rotationY(angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
         c,0,-s,0,
         0,1,0,0,
         s,0,c,0,
         0,0,0,1
    ];
}

export function rotationZ(angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return [
        c,-s,0,0,
        s,c,0,0,
        0,0,1,0,
        0,0,0,1
    ];
}