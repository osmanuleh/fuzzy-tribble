/**
 * calculator.js
 * Interactive isentropic compression calculator for the NTS.
 *
 * Physics constants used:
 *   γ  (gamma)  = 1.3    heat capacity ratio for natural gas
 *   Cp          = 2220   specific heat at constant pressure, J/kg·K
 *   η  (eta)    = 0.82   isentropic efficiency (typical NTS centrifugal unit)
 *
 * Formulae:
 *   Isentropic outlet temp:  T2 = T1 × (P2/P1)^((γ-1)/γ)
 *   Isentropic shaft work:   W  = Cp × (T2 - T1)              [J/kg]
 *   Actual shaft power:      P  = W × massFlow / η / 1,000,000 [MW]
 *   After-cooler load:       Q  ≈ Cp × massFlow × ΔT × 0.55   [MW] (estimate)
 */

(function () {
  "use strict";

  // ── Constants ──────────────────────────────────────────────────
  const GAMMA = 1.3;
  const CP    = 2220;   // J/kg·K
  const ETA   = 0.82;   // isentropic efficiency

  // ── DOM references ──────────────────────────────────────────────
  const inputs = {
    p1: document.getElementById("p1"),
    t1: document.getElementById("t1"),
    cr: document.getElementById("cr"),
    mf: document.getElementById("mf"),
  };

  const displays = {
    p1: document.getElementById("p1v"),
    t1: document.getElementById("t1v"),
    cr: document.getElementById("crv"),
    mf: document.getElementById("mfv"),
  };

  const resultsEl = document.getElementById("results");

  // ── Core calculation ────────────────────────────────────────────
  function calculate() {
    const p1  = parseFloat(inputs.p1.value);   // bar
    const t1C = parseFloat(inputs.t1.value);   // °C
    const cr  = parseFloat(inputs.cr.value);   // dimensionless ratio
    const mf  = parseFloat(inputs.mf.value);   // kg/s

    // Update slider labels
    displays.p1.textContent = `${p1} bar`;
    displays.t1.textContent = `${t1C} °C`;
    displays.cr.textContent = `${cr.toFixed(2)} : 1`;
    displays.mf.textContent = `${mf} kg/s`;

    // Temperature conversion: always work in Kelvin for thermodynamics
    const t1K = t1C + 273.15;

    // Isentropic outlet temperature
    const exponent = (GAMMA - 1) / GAMMA;             // (γ-1)/γ ≈ 0.231
    const t2K      = t1K * Math.pow(cr, exponent);
    const t2C      = t2K - 273.15;
    const deltaT   = t2C - t1C;

    // Outlet pressure
    const p2 = p1 * cr;

    // Isentropic work per kg of gas
    const specificWorkIso   = CP * deltaT;             // J/kg
    const specificWorkActual = specificWorkIso / ETA;  // J/kg (actual, accounting for efficiency)

    // Total power
    const powerIsoMW    = (specificWorkIso    * mf) / 1e6;
    const powerShaftMW  = (specificWorkActual * mf) / 1e6;

    // After-cooler heat removal (rough estimate: ~55% of temperature rise is removed)
    const coolerLoadMW  = (CP * mf * deltaT * 0.55) / 1e6;

    // Fuel consumption estimate: gas turbines burn ~2.5% of throughput at typical load
    const fuelEstPct = ((powerShaftMW / (p1 * mf * 0.001)) * 2.5).toFixed(1);

    renderResults({
      p2, t2C, deltaT,
      powerIsoMW, powerShaftMW,
      specificWorkIso, coolerLoadMW,
    });
  }

  // ── Render output cards ────────────────────────────────────────
  function renderResults(r) {
    resultsEl.innerHTML = [
      { label: "Outlet pressure",       value: r.p2.toFixed(1),                   unit: "bar"            },
      { label: "Outlet temperature",    value: r.t2C.toFixed(1),                  unit: `°C (+${r.deltaT.toFixed(1)} °C)` },
      { label: "Isentropic power",      value: r.powerIsoMW.toFixed(2),           unit: "MW"             },
      { label: `Shaft power (η ${Math.round(ETA*100)}%)`, value: r.powerShaftMW.toFixed(2), unit: "MW" },
      { label: "Specific work",         value: (r.specificWorkIso/1000).toFixed(1), unit: "kJ / kg"      },
      { label: "After-cooler load",     value: r.coolerLoadMW.toFixed(2),         unit: "MW (est.)"      },
    ].map(item => `
      <div class="res">
        <div class="rl">${item.label}</div>
        <div class="rv">${item.value}</div>
        <div class="ru">${item.unit}</div>
      </div>
    `).join("");
  }

  // ── Attach listeners ────────────────────────────────────────────
  Object.values(inputs).forEach(input => {
    if (input) input.addEventListener("input", calculate);
  });

  // ── Run once on page load ───────────────────────────────────────
  calculate();

})();
