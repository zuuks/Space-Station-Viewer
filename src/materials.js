import * as THREE from "three";

export function createMaterials() {
  const tex = new THREE.TextureLoader();

  function loadTex(url, { srgb = true, repeat = 1 } = {}) {
    const t = tex.load(url);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    return t;
  }

  const MAT = {
    hull: new THREE.MeshStandardMaterial({ color: 0xaab3be, metalness: 0.85, roughness: 0.28 }),
    darkHull: new THREE.MeshStandardMaterial({ color: 0x6e7782, metalness: 0.9, roughness: 0.35 }),
    truss: new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.9, roughness: 0.45 }),
    solar: new THREE.MeshStandardMaterial({
      color: 0x1f3b78,
      metalness: 0.25,
      roughness: 0.75,
      emissive: 0x0a1533,
      emissiveIntensity: 0.35,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x7fb0ff,
      metalness: 0.2,
      roughness: 0.1,
      emissive: 0x2a6cff,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.65,
    }),
    beacon: new THREE.MeshStandardMaterial({
      color: 0xff3b3b,
      emissive: 0xff3b3b,
      emissiveIntensity: 1.0,
      roughness: 0.2,
      metalness: 0.0,
    }),
  };

  // Metal maps
  const metalMap = loadTex("/textures/metal_basecolor.png", { srgb: true, repeat: 2 });
  const metalNormal = loadTex("/textures/metal_normal.png", { srgb: false, repeat: 2 });
  const metalRough = loadTex("/textures/metal_roughness.png", { srgb: false, repeat: 2 });

  // Solar maps
  const solarMap = loadTex("/textures/solar_basecolor.png", { srgb: true, repeat: 1 });
  const solarNormal = loadTex("/textures/solar_normal.png", { srgb: false, repeat: 1 });

  for (const m of [MAT.hull, MAT.darkHull, MAT.truss]) {
    m.map = metalMap;
    m.normalMap = metalNormal;
    m.roughnessMap = metalRough;
    m.needsUpdate = true;
  }
  MAT.solar.map = solarMap;
  MAT.solar.normalMap = solarNormal;
  MAT.solar.needsUpdate = true;

  return { MAT, texLoader: tex };
}
