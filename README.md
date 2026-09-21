# NTS Compressor Stations — National Gas

An educational website about gas compressors on the UK's National Transmission System (NTS), operated by National Gas Transmission plc. Covers the physics, engineering design, and real infrastructure behind the machines that move Britain's gas.

---

## What's in this site

| Section | What it covers |
|---|---|
| **The Network** | Overview of the NTS, all 21 compressor stations, schematic pipeline map |
| **How It Works** | Step-by-step walkthrough of a single compressor station |
| **Physics** | Isentropic temperature rise, shaft work, Darcy–Weisbach pressure drop |
| **Turbines** | Rolls-Royce Avon fleet, 2025 investment (Siemens Energy, Baker Hughes, Solar Turbines) |
| **Future** | FutureGrid Compression hydrogen programme, MCPD compliance timeline |
| **Calculator** | Interactive isentropic compression calculator with real physics |
| **Visual** | Separate deep-dive interactive diagram (see `assets/compressor-visual.html`) |

---

## File structure

```
nts-compressors/
├── index.html                  ← Main website
├── README.md                   ← This file
│
├── css/
│   └── style.css               ← All styles (variables, layout, components, dark mode)
│
├── js/
│   ├── map.js                  ← Builds and injects the SVG pipeline schematic
│   ├── stations.js             ← Renders the 21 station pills from a data array
│   └── calculator.js           ← Isentropic compression calculator logic
│
└── assets/
    └── compressor-visual.html  ← Standalone deep-dive interactive visual
                                   (station diagram, P–V diagram, pressure profile)
```

---

## The interactive visual

Open `assets/compressor-visual.html` separately for the full engineering diagram. It has three views:

- **Station View** — animated schematic of a complete compressor station; click any component for a detailed engineering explanation
- **P–V Diagram** — pressure–volume diagram showing isentropic vs isothermal compression, with shaded work area
- **Pressure Profile** — how pressure falls along the pipeline and is restored at a compressor station

Use the sliders in the right panel to change operating conditions — all views update live.

---

## Physics used

All calculations use real isentropic thermodynamics for natural gas:

```
γ  = 1.3      (heat capacity ratio)
Cp = 2220 J/kg·K
η  = 0.82     (isentropic efficiency, typical NTS centrifugal unit)

Outlet temperature:  T₂ = T₁ × (P₂/P₁)^((γ−1)/γ)
Shaft work per kg:   W  = Cp × (T₂ − T₁) / η
Total shaft power:   P  = W × ṁ  [watts]
```

---


## Sources

- [National Gas Transmission](https://www.nationalgas.com)
- Ofgem RIIO-GT3 price control documentation
- FutureGrid Compression Progress Report 2024
- Rolls-Royce Industrial Avon technical specifications
- Medium Combustion Plant Directive (2015/2193/EU)

---

## Licence

Educational use. All engineering data is sourced from publicly available materials.
