// ── Orange circle top-right, gradient fade + film grain ──
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

const BG     = '#0d0a2e';
const RADIUS = 320;

let grainCache = null;
let grainTick  = 0;

function buildGrain(w, h) {
    const gc   = document.createElement('canvas');
    gc.width   = w;
    gc.height  = h;
    const gctx = gc.getContext('2d');
    const img  = gctx.createImageData(w, h);
    const d    = img.data;
    for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255 | 0;
        d[i]   = v;
        d[i+1] = v;
        d[i+2] = v;
        d[i+3] = 38; // ~15% opacity
    }
    gctx.putImageData(img, 0, 0);
    return gc;
}

function draw() {
    const W  = canvas.width;
    const H  = canvas.height;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const cx = W - RADIUS * 0.55;
    const cy =     RADIUS * 0.05;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
    ctx.clip();

    const grad = ctx.createLinearGradient(cx, cy - RADIUS, cx, cy + RADIUS);
    grad.addColorStop(0,    'rgba(244, 99, 54, 1)');
    grad.addColorStop(0.55, 'rgba(244, 99, 54, 0.45)');
    grad.addColorStop(1,    'rgba(244, 99, 54, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - RADIUS, cy - RADIUS, RADIUS * 2, RADIUS * 2);

    // Film grain — refresh every 3 frames for flickering analog feel
    if (!grainCache || grainTick % 3 === 0) {
        grainCache = buildGrain(RADIUS * 2, RADIUS * 2);
    }
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(grainCache, cx - RADIUS, cy - RADIUS);
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();

    grainTick++;
    requestAnimationFrame(draw);
}

function rebuild() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    grainCache    = null;
}

rebuild();
window.addEventListener('resize', rebuild);
requestAnimationFrame(draw);
