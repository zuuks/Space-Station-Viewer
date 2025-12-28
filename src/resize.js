export function setupResize({ camera, renderer, composer, cfg }) {
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.renderer.pixelRatioMax));
    composer?.setSize?.(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}
