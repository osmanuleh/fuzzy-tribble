/**
 * map.js
 * Builds and injects the SVG pipeline schematic into #pipeline-map.
 *
 * Why a separate JS file for SVG?
 * - Keeps index.html readable (SVG markup is verbose)
 * - Makes it easy to swap in a real map library later
 * - Lets us use JS template literals for clean string building
 */

(function () {
  "use strict";

  // ── Data ───────────────────────────────────────────────────────
  // Each entry terminals has an [x, y] position in SVG coordinate space
  const terminals = [
    { label: "St Fergus",  x: 175, y: 72  },
    { label: "Easington",  x: 298, y: 160 },
    { label: "Bacton",     x: 300, y: 225 },
  ];

  // Compressor stations shown on the map (a representative selection)
  const mapStations = [
    { label: "Kirriemuir / Aberdeen",        x: 170, y: 85  },
    { label: "Bishop Auckland / Wooler",      x: 212, y: 132 },
    { label: "Carnforth · Nether Kellet",     x: 205, y: 165 },
    { label: "Churchover · Alrewas",          x: 220, y: 202 },
    { label: "Peterborough · Huntingdon",     x: 240, y: 238 },
    { label: "Lockerley · Wormington",        x: 225, y: 270 },
    { label: "Felindre",                      x: 190, y: 230 },
  ];

  // ── SVG builder ────────────────────────────────────────────────
  function buildSVG() {
    // Arrow marker definition
    const defs = `
      <defs>
        <marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#c0392b"
                stroke-width="1.5" stroke-linecap="round"/>
        </marker>
      </defs>`;

    // GB outline — simplified schematic shape, not geographically accurate
    const gbOutline = `
      <path d="M180 20 L220 15 L260 30 L290 50 L300 80 L285 120
               L290 155 L300 190 L295 230 L275 265 L250 295
               L220 315 L200 320 L185 300 L195 270 L200 240
               L190 205 L178 170 L165 140 L160 110 L162 75 L170 45 Z"
        fill="rgba(192,57,43,0.04)"
        stroke="var(--border)" stroke-width="1" stroke-linejoin="round"/>
      <path d="M165 120 L155 95 L160 70 L170 55 L183 40
               L195 35 L200 50 L192 65 L188 85 L180 100 L175 115 Z"
        fill="rgba(192,57,43,0.04)"
        stroke="var(--border)" stroke-width="1" stroke-linejoin="round"/>`;

    // Pipeline routes (schematic)
    const pipelineStatic = `
      <path d="M178 72 L195 110 L218 140 L228 175 L230 210 L240 245 L250 275"
        fill="none" stroke="var(--border)" stroke-width="3" stroke-linecap="round"/>
      <path d="M228 175 L265 178 L298 160"
        fill="none" stroke="var(--border)" stroke-width="2" stroke-linecap="round"/>
      <path d="M240 245 L270 242 L300 225"
        fill="none" stroke="var(--border)" stroke-width="2" stroke-linecap="round"/>`;

    // Animated gas flow overlay — same paths, dashed and animated via CSS class
    const pipelineFlow = `
      <path class="gas-flow"
        d="M178 72 L195 110 L218 140 L228 175 L230 210 L240 245 L250 275"
        fill="none" stroke="#c0392b" stroke-width="1.5"
        stroke-dasharray="6 8" stroke-linecap="round" opacity="0.6"/>
      <path class="gas-flow"
        d="M228 175 L265 178 L298 160"
        fill="none" stroke="#c0392b" stroke-width="1.2"
        stroke-dasharray="5 7" stroke-linecap="round" opacity="0.5"/>
      <path class="gas-flow"
        d="M240 245 L270 242 L300 225"
        fill="none" stroke="#c0392b" stroke-width="1.2"
        stroke-dasharray="5 7" stroke-linecap="round" opacity="0.5"/>`;

    // Entry terminal markers (red dots)
    const terminalMarkers = terminals
      .map(t => `
        <circle cx="${t.x}" cy="${t.y}" r="6" fill="#c0392b" opacity="0.85"/>
        <text x="${t.x + 10}" y="${t.y + 4}"
              font-size="10" fill="var(--ink2)"
              font-family="'DM Mono',monospace">${t.label}</text>`)
      .join("");

    // Compressor station markers (blue squares)
    const stationMarkers = mapStations
      .map(s => `
        <rect x="${s.x}" y="${s.y}" width="14" height="14" rx="3"
              fill="#1d4e89" stroke="#dbeafe" stroke-width="1"/>
        <text x="${s.x + 18}" y="${s.y + 10}"
              font-size="9" fill="var(--ink3)"
              font-family="'DM Sans',sans-serif">${s.label}</text>`)
      .join("");

    // Legend box
    const legend = `
      <rect x="560" y="20" width="280" height="120" rx="8"
            fill="var(--bg2)" stroke="var(--border)" stroke-width="1"/>
      <text x="578" y="42" font-size="11" font-weight="600"
            fill="var(--ink)" font-family="'DM Sans',sans-serif">Legend</text>
      <circle cx="578" cy="60" r="5" fill="#c0392b"/>
      <text x="590" y="64" font-size="10" fill="var(--ink2)"
            font-family="'DM Sans',sans-serif">Entry terminal (gas enters NTS)</text>
      <rect x="573" y="76" width="10" height="10" rx="2"
            fill="#1d4e89" stroke="#dbeafe" stroke-width="1"/>
      <text x="590" y="84" font-size="10" fill="var(--ink2)"
            font-family="'DM Sans',sans-serif">Compressor station</text>
      <line x1="573" y1="100" x2="590" y2="100"
            stroke="var(--border)" stroke-width="2.5" stroke-linecap="round"/>
      <text x="596" y="104" font-size="10" fill="var(--ink2)"
            font-family="'DM Sans',sans-serif">NTS high-pressure pipeline</text>
      <line x1="573" y1="118" x2="590" y2="118"
            stroke="#c0392b" stroke-width="1.5"
            stroke-dasharray="5 4" stroke-linecap="round"/>
      <text x="596" y="122" font-size="10" fill="var(--ink2)"
            font-family="'DM Sans',sans-serif">Gas flow (animated)</text>`;

    // Info box
    const infoBox = `
      <rect x="560" y="155" width="280" height="165" rx="8"
            fill="var(--bg2)" stroke="var(--border)" stroke-width="1"/>
      <text x="578" y="177" font-size="11" font-weight="600"
            fill="var(--ink)" font-family="'DM Sans',sans-serif">NTS at a glance</text>
      <text x="578" y="197" font-size="10" fill="var(--ink2)"
            font-family="'DM Sans',monospace">Owner: National Gas Transmission plc</text>
      <text x="578" y="213" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Pipeline: ~7,660 km of steel pipe</text>
      <text x="578" y="229" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Pressure: up to 85 bar</text>
      <text x="578" y="245" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Gas speed: up to 25 mph</text>
      <text x="578" y="261" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Compressor units: 60+</text>
      <text x="578" y="277" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Stations: 21 across GB</text>
      <text x="578" y="293" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Regulator: Ofgem (RIIO-GT3)</text>
      <text x="578" y="309" font-size="10" fill="var(--ink2)"
            font-family="'DM Mono',monospace">Control: National Control Centre</text>`;

    const disclaimer = `
      <text x="350" y="330" text-anchor="middle"
            font-size="10" fill="var(--ink3)"
            font-family="'DM Mono',monospace">
        Schematic only — not to scale or geographically precise
      </text>`;

    return `
      <svg viewBox="0 0 860 340" width="100%"
           xmlns="http://www.w3.org/2000/svg"
           role="img"
           aria-label="Schematic map of the National Transmission System showing pipeline routes and compressor station locations across Great Britain">
        ${defs}
        ${gbOutline}
        ${pipelineStatic}
        ${pipelineFlow}
        ${terminalMarkers}
        ${stationMarkers}
        ${legend}
        ${infoBox}
        ${disclaimer}
      </svg>`;
  }

  // ── Inject into the page ────────────────────────────────────────
  const container = document.getElementById("pipeline-map");
  if (container) {
    container.innerHTML = buildSVG();
  }

})();
