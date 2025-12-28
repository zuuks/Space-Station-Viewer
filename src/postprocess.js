import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export function createPostprocessing({ renderer, scene, camera, cfg }) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    cfg.bloom.strength,
    cfg.bloom.radius,
    cfg.bloom.threshold
  );
  composer.addPass(bloomPass);

  let bloomEnabled = true;

  function toggleBloom() {
    bloomEnabled = !bloomEnabled;
    return bloomEnabled;
  }

  function render() {
    if (bloomEnabled) composer.render();
    else renderer.render(scene, camera);
  }

  function resize() {
    composer.setSize(window.innerWidth, window.innerHeight);
  }

  return { composer, render, toggleBloom, get bloomEnabled() { return bloomEnabled; }, resize };
}
