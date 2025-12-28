import * as THREE from "three";

export function addRing({ group, radius, tube, y, rotY = 0, MAT }) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 16, 48), MAT.darkHull);
  ring.position.y = y;
  ring.rotation.y = rotY;
  group.add(ring);
  return ring;
}

export function addEndCap({ group, radius, y, flip = false, MAT }) {
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    MAT.darkHull
  );

  // Overlap da nema seam/rupe
  const overlap = 0.18;
  cap.position.y = flip ? (y + overlap) : (y - overlap);
  cap.rotation.x = flip ? Math.PI : 0;

  cap.material.polygonOffset = true;
  cap.material.polygonOffsetFactor = 1;
  cap.material.polygonOffsetUnits = 1;

  group.add(cap);
  return cap;
}

export function addWindowsBand({ group, radius, y, count = 14, MAT }) {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const ang = (i / count) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.06), MAT.glass);
    w.position.set(Math.cos(ang) * (radius + 0.02), y, Math.sin(ang) * (radius + 0.02));
    w.rotation.y = -ang;
    g.add(w);
  }
  group.add(g);
  return g;
}

export function addDockPort({ group, y, dir = 1, MAT }) {
  const port = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 24, 1, true), MAT.hull);
  tube.rotation.z = Math.PI / 2;
  tube.position.set(dir * 6.8, y, 0);
  port.add(tube);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.12, 14, 36), MAT.darkHull);
  ring.rotation.y = Math.PI / 2;
  ring.position.set(dir * 8.1, y, 0);
  port.add(ring);

  group.add(port);
  return port;
}
