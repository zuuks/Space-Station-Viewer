import * as THREE from "three";

export function addEarth({ scene, texLoader }) {
  const earthDay = texLoader.load("/textures/earth/earth_atmos_2048.jpg");
  earthDay.colorSpace = THREE.SRGBColorSpace;

  const earthNormal = texLoader.load("/textures/earth/earth_normal_2048.jpg");

  // kept if you want later (currently unused)
  texLoader.load("/textures/earth/earth_specular_2048.jpg");

  const earthNight = texLoader.load("/textures/earth/earth_lights_2048.png");
  earthNight.colorSpace = THREE.SRGBColorSpace;

  const earthMat = new THREE.MeshStandardMaterial({
    map: earthDay,
    normalMap: earthNormal,
    roughness: 1.0,
    metalness: 0.0,
    emissiveMap: earthNight,
    emissiveIntensity: 0.65,
    emissive: new THREE.Color(0xffffff),
  });

  const earth = new THREE.Mesh(new THREE.SphereGeometry(110, 64, 64), earthMat);
  earth.position.set(-420, -120, -680);
  scene.add(earth);

  return earth;
}
