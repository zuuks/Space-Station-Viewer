import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { makeStarfieldTexture } from "./background.js";

export function createWorld({ app, cfg }) {
  const scene = new THREE.Scene();
  scene.background = makeStarfieldTexture(2048, 2048, 2000);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.renderer.pixelRatioMax));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = cfg.renderer.exposure;
  app.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    cfg.camera.fov,
    window.innerWidth / window.innerHeight,
    cfg.camera.near,
    cfg.camera.far
  );
  camera.position.copy(cfg.camera.startPos);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = cfg.controls.dampingFactor;
  controls.minDistance = cfg.controls.minDistance;
  controls.maxDistance = cfg.controls.maxDistance;
  controls.target.set(0, 0, 0);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const sun = new THREE.DirectionalLight(0xffffff, 3.2);
  sun.position.set(70, 80, 40);
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0x88aaff, 0.45);
  rim.position.set(-70, 20, -90);
  scene.add(rim);

  return { scene, renderer, camera, controls };
}
