/**
 * stations.js
 * Renders the 21 NTS compressor station pills into #station-grid.
 *
 * Data is kept here as a plain array so it's easy to update
 * without touching the HTML. Featured stations are the three
 * receiving National Gas's £350m 2025 investment.
 */

(function () {
  "use strict";

  const STATIONS = [
    { name: "Aberdeen",          featured: false },
    { name: "Alrewas",           featured: false },
    { name: "Avonbridge",        featured: false },
    { name: "Aylesbury",         featured: false },
    { name: "Bishop Auckland",   featured: false },
    { name: "Cambridge",         featured: false },
    { name: "Carnforth",         featured: false },
    { name: "Chelmsford",        featured: false },
    { name: "Churchover",        featured: false },
    { name: "Diss",              featured: false },
    { name: "Felindre",          featured: false },
    { name: "Hatton",            featured: false },
    { name: "Huntingdon",        featured: false },
    { name: "Kings Lynn",        featured: false },
    { name: "Kirriemuir",        featured: false },
    { name: "Lockerley",         featured: false },
    { name: "Nether Kellet",     featured: false },
    { name: "Peterborough",      featured: true  },  // 2025 investment
    { name: "St Fergus",         featured: true  },  // 2025 investment
    { name: "Wisbech",           featured: false },
    { name: "Wormington",        featured: true  },  // 2025 investment
  ];

  function renderStations() {
    const grid = document.getElementById("station-grid");
    if (!grid) return;

    grid.innerHTML = STATIONS.map(s => `
      <div class="station-pill${s.featured ? " featured" : ""}"
           title="${s.featured ? "Receiving new compressors — 2025 investment" : ""}">
        <span class="station-dot" aria-hidden="true"></span>
        ${s.name}
      </div>
    `).join("");
  }

  renderStations();

})();
