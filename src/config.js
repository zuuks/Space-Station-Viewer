import * as THREE from "three";

export const CFG = {
  renderer: {
    exposure: 2.65,
    pixelRatioMax: 2,
  },
  camera: {
    fov: 60,
    near: 0.1,
    far: 2500,
    startPos: new THREE.Vector3(0, 35, 90),
  },
  controls: {
    dampingFactor: 0.06,
    minDistance: 15,
    maxDistance: 220,
  },
  motion: {
    stationSelfRot: 0.0,
    stationOrbit: 0.0006,
    earthSpin: 0.00015,
  },
  bloom: {
    strength: 1.25,
    radius: 0.35,
    threshold: 0.25,
  },
};
