import * as THREE from "three";

export function setupInteraction({ camera, infoEl, modules }) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(modules, true);
    if (!hits.length) return;

    let obj = hits[0].object;
    while (obj && !obj.userData?.name) obj = obj.parent;

    if (obj?.userData?.name) {
      infoEl.style.display = "block";
      infoEl.innerHTML = `<b>${obj.userData.name}</b><br/>${obj.userData.desc}<br/><small>${obj.userData.dims}</small>`;
      clearTimeout(infoEl._t);
      infoEl._t = setTimeout(() => (infoEl.style.display = "none"), 4500);
    }
  }

  window.addEventListener("pointerdown", onPointerDown);

  return () => window.removeEventListener("pointerdown", onPointerDown);
}
