# EPIC: The Musical — Pixel Odyssey

A 2D pixel platformer inspired by Homer's *Odyssey* and structured around the nine sagas of **EPIC: The Musical** by Jorge Rivera-Herrans.

## Phase 4 — Troy visual and combat polish

Added camera shake and brighter hit-particle feedback to make combat and hazards feel more responsive.

## Phase 3 — Troy story level

**Troy Saga — The Horse and the Infant** is now an authored multi-section level rather than a single prototype room.

Added:

- Original opening cinematic dialogue before gameplay.
- Four named Troy sections with progress transitions.
- Burning-floor hazards.
- Falling debris hazards.
- Soldier and archer enemy behaviors.
- Simple ranged projectiles.
- Mid-level checkpoint and respawn flow.
- Expanded ruined-city / battlefield procedural pixel scenery.
- Section-aware HUD messaging.
- Original story text only; no song lyrics or recordings are bundled.

## Controls

- **A / D** or **Left / Right** — move
- **Space / W / Up** — jump
- **J** or **K** — attack
- **Space / Enter** — advance story dialogue
- **R** — restart during gameplay

## Saga roadmap

1. Troy Saga — 5 songs
2. Cyclops Saga — 4 songs
3. Ocean Saga — 4 songs
4. Circe Saga — 4 songs
5. Underworld Saga — 3 songs
6. Thunder Saga — 5 songs
7. Wisdom Saga — 5 songs
8. Vengeance Saga — 5 songs
9. Ithaca Saga — 5 songs

**Total: 40 song-based levels.**

## Local run

Because this uses JavaScript modules, serve the repository with a local HTTP server:

    python -m http.server 8000

Then open http://localhost:8000.

Each development phase should leave the game playable. Dedicated pixel assets, audio hooks, bosses and the remaining song levels will be added in later phases.
