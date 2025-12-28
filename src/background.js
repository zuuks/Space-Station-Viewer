import * as THREE from "three";

export function makeStarfieldTexture(w = 2048, h = 2048, count = 2000) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.6;
    const a = 0.35 + Math.random() * 0.65;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 0.6 + Math.random() * 1.1;
    ctx.fillStyle = `rgba(160,190,255,${0.25 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
