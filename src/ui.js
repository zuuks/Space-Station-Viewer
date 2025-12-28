// Simple DOM UI + error handling
export function createUI() {
  const app = document.getElementById("app");
  if (!app) throw new Error('#app element not found');

  const el = (tag, attrs = {}, html = "") => {
    const e = document.createElement(tag);
    Object.assign(e, attrs);
    if (html) e.innerHTML = html;
    return e;
  };

  const ui = el("div", { id: "ui" }, `
    <button id="tourPrev"><- Model</button>
    <button id="tourNext">Model -></button>
    <button id="resetCam">Reset kamera</button>
    <button id="toggleOrbit">On/Off orbita</button>
    <button id="toggleBloom">Bloom: ON</button>
  `);
  document.body.appendChild(ui);

  const hint = el("div", { id: "hint" }, `
    <b>Kontrole</b><br/>
    Mis: Rotacija | Scroll: Zoom | Desni klik: Slobodna kamera<br/>
    Model dugma: fokus na modele stanice<br/>
    Klik na modul: informacije o modelu
  `);
  document.body.appendChild(hint);

  const info = el("div", { id: "info" });
  document.body.appendChild(info);

  const errBox = el("div", { id: "error" });
  document.body.appendChild(errBox);

  function showError(e) {
    errBox.style.display = "block";
    errBox.textContent = `Greška: ${e?.message ?? e}\n\n${e?.stack ?? ""}`;
    // eslint-disable-next-line no-console
    console.error(e);
  }
  window.addEventListener("error", (e) => showError(e.error || e.message));
  window.addEventListener("unhandledrejection", (e) => showError(e.reason));

  function showTempInfo(html, ms = 1600) {
    info.style.display = "block";
    info.innerHTML = html;
    clearTimeout(showTempInfo._t);
    showTempInfo._t = setTimeout(() => (info.style.display = "none"), ms);
  }

  return {
    app,
    info,
    uiRoot: ui,
    showTempInfo,
    buttons: {
      tourPrev: ui.querySelector("#tourPrev"),
      tourNext: ui.querySelector("#tourNext"),
      resetCam: ui.querySelector("#resetCam"),
      toggleOrbit: ui.querySelector("#toggleOrbit"),
      toggleBloom: ui.querySelector("#toggleBloom"),
    },
  };
}
