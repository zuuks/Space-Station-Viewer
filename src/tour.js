import * as THREE from "three";

export function createTour({ camera, controls, showTempInfo, stationBody, coreGroup, lab, hab, robotArm }) {
  const _tmpP = new THREE.Vector3();
  const _tmpCam = new THREE.Vector3();

  function makeTourPoint(name, obj, camOffset) {
    return {
      name,
      get: () => {
        obj.getWorldPosition(_tmpP);
        _tmpCam.copy(_tmpP).add(camOffset);
        return { cam: _tmpCam.clone(), target: _tmpP.clone() };
      },
    };
  }

  const tourPoints = [
    makeTourPoint("Cela stanica", stationBody, new THREE.Vector3(0, 35, 90)),
    makeTourPoint("Centralni modul", coreGroup, new THREE.Vector3(28, 10, 28)),
    makeTourPoint("Laboratorijski modul", lab, new THREE.Vector3(22, 8, 22)),
    makeTourPoint("Stambeni modul", hab, new THREE.Vector3(-22, 8, 22)),
    makeTourPoint("Robot ruka", robotArm, new THREE.Vector3(14, 10, 14)),
  ];

  let tourIndex = 0;
  const camLerp = {
    active: false,
    t: 0,
    fromPos: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
  };

  function goTo(i) {
    tourIndex = (i + tourPoints.length) % tourPoints.length;
    const tp = tourPoints[tourIndex];
    const { cam, target } = tp.get();

    camLerp.active = true;
    camLerp.t = 0;
    camLerp.fromPos.copy(camera.position);
    camLerp.toPos.copy(cam);
    camLerp.fromTarget.copy(controls.target);
    camLerp.toTarget.copy(target);

    showTempInfo(`Tour: <b>${tp.name}</b>`);
  }

  function animate(dt) {
    if (!camLerp.active) return;
    camLerp.t += dt * 0.6;
    const k = Math.min(camLerp.t, 1);
    camera.position.lerpVectors(camLerp.fromPos, camLerp.toPos, k);
    controls.target.lerpVectors(camLerp.fromTarget, camLerp.toTarget, k);
    if (k >= 1) camLerp.active = false;
  }

  return {
    goTo,
    prev: () => goTo(tourIndex - 1),
    next: () => goTo(tourIndex + 1),
    reset: () => goTo(0),
    animate,
  };
}
