import * as THREE from "three";
import { addRing, addEndCap, addWindowsBand, addDockPort } from "./helpers.js";

export function buildStation({ scene, MAT }) {
  const modules = []; 

  const station = new THREE.Group();
  scene.add(station);

  const orbitPivot = new THREE.Group();
  orbitPivot.add(station);
  scene.add(orbitPivot);

  const stationBody = new THREE.Group();
  station.add(stationBody);

  // CENTRALNI MODUL
  const coreGroup = new THREE.Group();
  stationBody.add(coreGroup);

  const core = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.1, 18, 40, 1, false), MAT.hull);
  coreGroup.add(core);

  addRing({ group: coreGroup, radius: 4.32, tube: 0.12, y: -6.2, MAT });
  addRing({ group: coreGroup, radius: 4.32, tube: 0.12, y: 0.0, rotY: Math.PI / 8, MAT });
  addRing({ group: coreGroup, radius: 4.32, tube: 0.12, y: 6.2, MAT });
  addEndCap({ group: coreGroup, radius: 4.15, y: -9.0, flip: true, MAT });
  addEndCap({ group: coreGroup, radius: 4.15, y: 9.0, flip: false, MAT });
  addWindowsBand({ group: coreGroup, radius: 3.8, y: -2.2, count: 16, MAT });
  addWindowsBand({ group: coreGroup, radius: 3.8, y: 2.2, count: 16, MAT });

  coreGroup.userData = {
    name: "Centralni modul",
    desc: "Jezgro stanice (životna podrška, komunikacije, sistemi).",
    dims: "Cilindar r~4.2, dužina~18 + detalji",
  };
  modules.push(coreGroup);

  // TRUSS
  const truss = new THREE.Group();
  stationBody.add(truss);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(24, 1.0, 1.0), MAT.truss);
  truss.add(beam);

  for (let i = -10; i <= 10; i += 2) {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.8, 0.6), MAT.truss);
    cross.position.set(i, 0, 0);
    truss.add(cross);

    const diag1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.22, 0.22), MAT.truss);
    diag1.position.set(i + 0.9, 1.1, 0.35);
    diag1.rotation.z = Math.PI / 4;
    truss.add(diag1);

    const diag2 = diag1.clone();
    diag2.position.set(i + 0.9, -1.1, -0.35);
    diag2.rotation.z = -Math.PI / 4;
    truss.add(diag2);
  }

  // SIDE MODULES
  function makeSideModule(name, desc, xOffset) {
    const g = new THREE.Group();

    const body = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.1, 12.5, 36, 1, false), MAT.hull);
    g.add(body);

    addRing({ group: g, radius: 3.32, tube: 0.10, y: -4.6, MAT });
    addRing({ group: g, radius: 3.32, tube: 0.10, y: 4.6, MAT });
    addEndCap({ group: g, radius: 3.12, y: -6.5, flip: true, MAT });
    addEndCap({ group: g, radius: 3.12, y: 6.5, flip: false, MAT });
    addWindowsBand({ group: g, radius: 2.8, y: 0.0, count: 12, MAT });

    const bay = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 2.0), MAT.darkHull);
    bay.position.set(0, 0, 3.0);
    g.add(bay);

    g.position.x = xOffset;
    g.userData = { name, desc, dims: "Cilindar r~3.2, dužina~12.5" };
    modules.push(g);
    return g;
  }

  const lab = makeSideModule("Laboratorijski modul", "Eksperimenti i analiza uzoraka.", 16.5);
  const hab = makeSideModule("Stambeni modul", "Kabine, odmor, osnovne životne funkcije.", -16.5);
  stationBody.add(lab, hab);

  // CONNECTORS
  function makeConnector(x1, x2) {
    const g = new THREE.Group();

    const len = Math.abs(x2 - x1);
    const midX = (x1 + x2) / 2;

    const tunnelR = 0.95;
    const adapterR1 = 1.35;
    const adapterR2 = 1.05;
    const adapterLen = 1.25;
    const collarR = 1.55;
    const collarTh = 0.18;

    const tunnel = new THREE.Mesh(
      new THREE.CylinderGeometry(tunnelR, tunnelR, len - 2 * adapterLen, 28, 1, true),
      MAT.hull
    );
    tunnel.rotation.z = Math.PI / 2;
    tunnel.position.set(midX, 0, 0);
    g.add(tunnel);

    function addAdapter(atX, flip = false) {
      const geo = flip
        ? new THREE.CylinderGeometry(adapterR2, adapterR1, adapterLen, 28, 1, true)
        : new THREE.CylinderGeometry(adapterR1, adapterR2, adapterLen, 28, 1, true);

      const m = new THREE.Mesh(geo, MAT.darkHull);
      m.rotation.z = Math.PI / 2;
      m.position.set(atX, 0, 0);
      g.add(m);

      const collar = new THREE.Mesh(new THREE.TorusGeometry(collarR, collarTh, 16, 42), MAT.truss);
      collar.rotation.y = Math.PI / 2;
      collar.position.set(atX + (flip ? -0.55 : 0.55), 0, 0);
      g.add(collar);

      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.2, 2.2), MAT.truss);
      plate.position.set(atX + (flip ? -0.25 : 0.25), 0, 0);
      g.add(plate);
    }

    const leftX = Math.min(x1, x2);
    const rightX = Math.max(x1, x2);
    addAdapter(leftX + adapterLen / 2, false);
    addAdapter(rightX - adapterLen / 2, true);

    for (const off of [-len * 0.15, 0, len * 0.15]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.11, 14, 36), MAT.truss);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(midX + off, 0, 0);
      g.add(ring);
    }

    const cableLen = len - 1.2;
    const cableGeo = new THREE.CylinderGeometry(0.06, 0.06, cableLen, 10);

    function addCable(y, z) {
      const c = new THREE.Mesh(cableGeo, MAT.truss);
      c.rotation.z = Math.PI / 2;
      c.position.set(midX, y, z);
      g.add(c);
    }
    addCable(0.9, 0.9);
    addCable(-0.9, -0.9);

    return g;
  }

  stationBody.add(makeConnector(8.9, 10.35));
  stationBody.add(makeConnector(-8.9, -10.35));
  addDockPort({ group: stationBody, y: 0, dir: 1, MAT });
  addDockPort({ group: stationBody, y: 0, dir: -1, MAT });

  // ANTENNA (on HAB)
  const antenna = new THREE.Group();
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.0, 12), MAT.truss);
  mast.position.y = 2.0;
  antenna.add(mast);

  const dish = new THREE.Mesh(new THREE.SphereGeometry(1.1, 20, 18, 0, Math.PI), MAT.hull);
  dish.material = dish.material.clone();
  dish.material.side = THREE.DoubleSide;
  dish.material.needsUpdate = true;
  dish.rotation.z = Math.PI;
  dish.position.y = 4.2;
  antenna.add(dish);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), MAT.beacon);
  beacon.position.set(0.2, 4.8, 0.2);
  antenna.add(beacon);

  antenna.position.set(0.0, 6.9, 0.0);
  antenna.userData = {
    rotSpeed: 1.0,
    name: "Antena",
    desc: "Komunikacioni sistem (dish + beacon) za link sa Zemljom i satelitima.",
    dims: "Mast ~4, dish ~1.1",
  };
  hab.add(antenna);

  // ROBOT ARM (on CORE)
  const robotArm = new THREE.Group();
  const armMat = new THREE.MeshStandardMaterial({ color: 0xb8c0c9, metalness: 0.85, roughness: 0.35 });

  const mount = new THREE.Group();
  const mountPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.2), MAT.truss);
  mount.add(mountPlate);

  const mountPost = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 2.0, 16), MAT.truss);
  mountPost.position.y = 1.0;
  mount.add(mountPost);

  const mountBracket = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.9), MAT.truss);
  mountBracket.position.set(0, 2.0, 0.25);
  mount.add(mountBracket);

  robotArm.add(mount);

  const seg1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.7), armMat);
  seg1.position.set(0, 2.0, 0.25);
  robotArm.add(seg1);

  const joint = new THREE.Group();
  joint.position.set(0, 3.6, 0.25);
  robotArm.add(joint);

  const seg2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.8, 0.6), armMat);
  seg2.position.y = 1.4;
  joint.add(seg2);

  const claw = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 1.1), armMat);
  claw.position.y = 3.1;
  joint.add(claw);

  robotArm.position.set(-1.6, 11.2, 0.0);
  robotArm.rotation.set(0, 0, Math.PI / 2);
  robotArm.userData = {
    t: 0,
    moveSpeed: 1.8,
    name: "Robot ruka",
    desc: "Servisna ruka za popravke, hvatanje tereta i manipulaciju opremom.",
    dims: "2 segmenta + claw",
  };
  coreGroup.add(robotArm);

  // SOLAR ARMS
  const solarRoot = new THREE.Group();
  stationBody.add(solarRoot);

  function makeSolarArm(sideX = 1) {
    const arm = new THREE.Group();

    const coreRadius = 4.6;
    const armLength = 28;
    const armThickness = 0.25;
    const hingeExtra = 1.2;

    const panelW = 10;
    const panelH = 5;

    arm.position.set(sideX * coreRadius, 0, 0);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(armThickness, armThickness, armLength, 12), MAT.truss);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(sideX * (armLength / 2), 0, 0);
    arm.add(rod);

    const baseClamp = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.8), MAT.darkHull);
    baseClamp.position.set(sideX * 0.2, 0, 0);
    arm.add(baseClamp);

    const hinge = new THREE.Group();
    hinge.position.set(sideX * (armLength + hingeExtra), 0, 0);
    arm.add(hinge);

    const hingeHead = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.1, 16), MAT.truss);
    hingeHead.rotation.x = Math.PI / 2;
    hinge.add(hingeHead);

    const panelZ = sideX > 0 ? 6.2 : -6.2;

    const strutLen = Math.abs(panelZ);
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, strutLen, 12), MAT.truss);
    strut.rotation.x = Math.PI / 2;

    const gapFix = sideX > 0 ? 0.25 : -0.25;
    strut.position.set(0, 0, panelZ / 2 + gapFix);
    hinge.add(strut);

    const hingeDrop = -0.3;
    const hingePlateA = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.8), MAT.truss);
    hingePlateA.position.set(0.45, hingeDrop, 0);
    hinge.add(hingePlateA);
    const hingePlateB = hingePlateA.clone();
    hingePlateB.position.set(-0.45, hingeDrop, 0);
    hinge.add(hingePlateB);

    const panelGroup = new THREE.Group();
    panelGroup.position.set(0, 0, panelZ);
    hinge.add(panelGroup);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(panelW + 0.6, 0.22, panelH + 0.6), MAT.truss);
    panelGroup.add(frame);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(panelW, 0.18, panelH), MAT.solar);
    panel.position.y = 0.03;
    panelGroup.add(panel);

    for (let i = -4; i <= 4; i += 2) {
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, panelH + 0.2), MAT.truss);
      rib.position.set(i * 1.0, 0.12, 0);
      panelGroup.add(rib);
    }

    hinge.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.9,
      base: sideX > 0 ? 0.2 : -0.2,
      amp: THREE.MathUtils.degToRad(25),
    };

    return { arm, hinge };
  }

  const solarLeft = makeSolarArm(-1);
  const solarRight = makeSolarArm(1);
  solarRoot.add(solarLeft.arm, solarRight.arm);

  return {
    modules,
    station,
    orbitPivot,
    stationBody,
    coreGroup,
    lab,
    hab,
    antenna,
    robotArm,
    joint,
    solarLeft,
    solarRight,
  };
}
