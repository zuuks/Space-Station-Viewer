import * as THREE from "three";

export function startLoop({
  cfg,
  controls,
  post,
  tour,
  stationState,
  earth,
}) {
  const clock = new THREE.Clock();

  function tick() {
    const dt = clock.getDelta();

    // station rotation/orbit
    stationState.station.rotation.y += cfg.motion.stationSelfRot;
    if (stationState.orbitEnabled) stationState.orbitPivot.rotation.y += cfg.motion.stationOrbit;

    // solar animation
    for (const s of [stationState.solarLeft, stationState.solarRight]) {
      const u = s.hinge.userData;
      u.phase += dt * u.speed;
      const desired = u.base + Math.sin(u.phase) * u.amp;
      const maxAngle = THREE.MathUtils.degToRad(60);
      s.hinge.rotation.y = THREE.MathUtils.clamp(desired, -maxAngle, maxAngle);
    }

    // earth spin
    if (earth) earth.rotation.y += cfg.motion.earthSpin;

    // antenna spin
    if (stationState.antenna?.userData?.rotSpeed) {
      stationState.antenna.rotation.y += stationState.antenna.userData.rotSpeed * dt;
    }

    // robot arm movement
    stationState.robotArm.userData.t += stationState.robotArm.userData.moveSpeed * dt;
    const t = stationState.robotArm.userData.t;
    stationState.robotArm.rotation.y = Math.sin(t) * 0.55;
    stationState.robotArm.rotation.z = Math.sin(t * 0.7) * 0.12;
    stationState.joint.rotation.x = Math.sin(t * 1.4) * 0.85;

    // camera lerp (tour)
    tour.animate(dt);

    controls.update();
    post.render();

    requestAnimationFrame(tick);
  }

  tick();
}
