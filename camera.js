import {perspective, lookAt} from "./math.js";

export const camera = {pos: [5,0,0], target: [0,0,0], up: [0,1,0]};

export function getViewProjection(canvas)
{
    const proj = perspective(45, canvas.width/canvas.height, 0.1, 100);

    const view = lookAt(camera.pos, camera.target, camera.up);

    return {proj, view};
}