import {camera, updateTarget} from "./camera.js";

const keys = {};

export function initInput(canvas)
{
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

function mouseMove(event)
{
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

export function updateMovement(){
    const yaw = camera.yaw * Math.PI / 180;
    const front = [Math.cos(yaw), 0, Math.sin(yaw)];
    const right = [-front[2], 0, front[0]];

    if(keys["w"]){
        camera.pos[0] += front[0] * camera.speed;
        camera.pos[2] += front[2] * camera.speed;
    }
    if(keys["s"]){
        camera.pos[0] -= front[0] * camera.speed;
        camera.pos[2] -= front[2] * camera.speed;
    }
    if(keys["a"]){
        camera.pos[0] -= right[0] * camera.speed;
        camera.pos[2] -= right[2] * camera.speed;
    }
    if(keys["d"]){
        camera.pos[0] += right[0] * camera.speed;
        camera.pos[2] += right[2] * camera.speed;
    }

    updateTarget();
}