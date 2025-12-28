import "./style.css";

import { CFG } from "./config.js";
import { createUI } from "./ui.js";
import { createWorld } from "./threeSetup.js";
import { createMaterials } from "./materials.js";
import { buildStation } from "./station/buildStation.js";
import { addEarth } from "./earth.js";
import { createTour } from "./tour.js";
import { setupInteraction } from "./interaction.js";
import { createPostprocessing } from "./postprocess.js";
import { setupResize } from "./resize.js";
import { startLoop } from "./animate.js";

const ui = createUI();
const world = createWorld({ app: ui.app, cfg: CFG });
const { MAT, texLoader } = createMaterials();

// Models
const stationState = buildStation({ scene: world.scene, MAT });
const earth = addEarth({ scene: world.scene, texLoader });

// Postprocessing
const post = createPostprocessing({ renderer: world.renderer, scene: world.scene, camera: world.camera, cfg: CFG });

// Tour
const tour = createTour({
  camera: world.camera,
  controls: world.controls,
  showTempInfo: ui.showTempInfo,
  stationBody: stationState.stationBody,
  coreGroup: stationState.coreGroup,
  lab: stationState.lab,
  hab: stationState.hab,
  robotArm: stationState.robotArm,
});

// UI wiring
stationState.orbitEnabled = true;

ui.buttons.tourPrev.addEventListener("click", () => tour.prev());
ui.buttons.tourNext.addEventListener("click", () => tour.next());
ui.buttons.resetCam.addEventListener("click", () => tour.reset());

ui.buttons.toggleOrbit.addEventListener("click", () => {
  stationState.orbitEnabled = !stationState.orbitEnabled;
  ui.showTempInfo(stationState.orbitEnabled ? "Orbita: <b>ON</b>" : "Orbita: <b>OFF</b>");
});

ui.buttons.toggleBloom.addEventListener("click", () => {
  const enabled = post.toggleBloom();
  ui.buttons.toggleBloom.textContent = enabled ? "Bloom: ON" : "Bloom: OFF";
});

// Interaction
setupInteraction({ camera: world.camera, infoEl: ui.info, modules: stationState.modules });

// Resize
setupResize({ camera: world.camera, renderer: world.renderer, composer: post.composer, cfg: CFG });

// Start
tour.reset();
startLoop({
  cfg: CFG,
  controls: world.controls,
  post,
  tour,
  stationState,
  earth,
});
