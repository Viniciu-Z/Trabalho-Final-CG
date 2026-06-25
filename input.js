import {camera, updateTarget} from "./camera.js";
import { pedestais } from "./cenario.js";

const keys = {};
const LIMITE_X = 50;
const LIMITE_Z = 100;
const RAIO = 1.0;

export function initInput(canvas){
    document.addEventListener(
        "keydown",
        (e) => keys[e.key.toLowerCase()] = true
    );

    document.addEventListener(
        "keyup",
        (e) => keys[e.key.toLowerCase()] = false
    );

    canvas.addEventListener(
        "click",
        () => canvas.requestPointerLock()
    );

    document.addEventListener("mousemove", mouseMove);
}

function mouseMove(event){
    if(document.pointerLockElement === document.getElementById("glcanvas1")){
        camera.yaw += event.movementX * 0.1;
        camera.pitch -= event.movementY * 0.1;

        if(camera.pitch > 89)
            camera.pitch = 89;

        if(camera.pitch < -89)
            camera.pitch = -89;

        updateTarget();
    }
}

export function updateMovement() {
    const yaw = camera.yaw * Math.PI / 180;
    const front = [Math.cos(yaw), 0, Math.sin(yaw)];
    const right = [-front[2], 0, front[0]];

    let dx = 0;
    let dz = 0;

    if (keys["w"]) {
        dx += front[0] * camera.speed;
        dz += front[2] * camera.speed;
    }

    if (keys["s"]) {
        dx -= front[0] * camera.speed;
        dz -= front[2] * camera.speed;
    }

    if (keys["a"]) {
        dx -= right[0] * camera.speed;
        dz -= right[2] * camera.speed;
    }

    if (keys["d"]) {
        dx += right[0] * camera.speed;
        dz += right[2] * camera.speed;
    }

    aplicarColisao(dx, dz);
    updateTarget();
}

function aplicarColisao(dx, dz) {

    const novoX = camera.pos[0] + dx;
    const novoZ = camera.pos[2] + dz;

    // testa X separadamente
    if (novoX >= -LIMITE_X + RAIO &&
        novoX <= LIMITE_X - RAIO &&
        !colideComPedestal(novoX, camera.pos[2])
    ){
        camera.pos[0] = novoX;
    }

    // testa Z separadamente
    if(novoZ >= -LIMITE_Z + RAIO &&
        novoZ <= LIMITE_Z - RAIO &&
        !colideComPedestal(camera.pos[0], novoZ)
    ){
        camera.pos[2] = novoZ;
    }
}

function colideComPedestal(x, z) {

    for (const p of pedestais) {
        if (x + RAIO > p.x - p.largura / 2 &&
            x - RAIO < p.x + p.largura / 2 &&
            z + RAIO > p.z - p.comprimento / 2 &&
            z - RAIO < p.z + p.comprimento / 2
        ){
            return true;
        }
    }

    return false;
}