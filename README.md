# EPIC: The Musical — Pixel Odyssey

A 2D pixel platformer inspired by Homer's *Odyssey* and structured around the nine sagas of **EPIC: The Musical** by Jorge Rivera-Herrans.

## Phase 1

The first prototype implements:

- Crisp 320×180 pixel canvas scaled responsively.
- Title screen and playable game screen.
- Odysseus movement, gravity, jumping and platform collision.
- Directional attack.
- Enemy chase and defeat behavior.
- Player health, damage, invulnerability and restart.
- Goal and level completion.
- Procedural placeholder pixel art with no external asset dependency.
- Complete 9-saga / 40-song progression data model.

### Current playable level

**Troy Saga — The Horse and the Infant**

The prototype uses original gameplay text and does not bundle song lyrics or recordings. Licensed/user-provided music can be integrated later.

## Controls

- **A / D** or **Left / Right** — move
- **Space / W / Up** — jump
- **J** — attack
- **R** — restart

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

Because this uses JavaScript modules, serve the repository with a local HTTP server instead of opening the HTML file directly:

    python -m http.server 8000

Then open http://localhost:8000.

## Development rule

Each phase should leave the game playable. Later phases will replace procedural placeholder art with dedicated pixel assets, expand level systems, add story/cutscenes and audio hooks, introduce enemies/bosses, and implement the remaining song levels.
