import {perspective, lookAt} from "./math.js";

export const camera = {
    pos: [-20, 5, 0],
    yaw: 0,
    pitch: 0,
    target: [5, 5, 0],
    up: [0, 1, 0],
    speed: 0.5
};

export function getViewProjection(canvas)
{
    const proj = perspective(45, canvas.width/canvas.height, 0.1, 100);

    const view = lookAt(camera.pos, camera.target, camera.up);

    return {proj, view};
}

export function updateTarget()
{
    const yaw = camera.yaw * Math.PI / 180;
    const pitch = camera.pitch * Math.PI / 180;

    const x = Math.cos(pitch) * Math.cos(yaw);
    const y = Math.sin(pitch);
    const z = Math.cos(pitch) * Math.sin(yaw);

    camera.target = [
        camera.pos[0] + x,
        camera.pos[1] + y,
        camera.pos[2] + z
    ];
}