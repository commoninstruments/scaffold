# Scaffold

Opinionated documentation scaffold for starting a new Howells project.

This repo is intentionally docs-first. It captures the shared baseline that is already emerging across recent active projects such as `materia`, `siteinspire`, `stow`, `designround`, `sorrel`, `kinecho`, `patternmode`, `materialgraph`, plus the shared config repos `arc`, `lint`, `typescript-config`, and `turbo-config`.

The current defaults are grounded in the direct manifest inventory from `2026-05-17`: 102 touched projects with dependency manifests, 595 direct manifests, and 2,105 unique direct dependency packages after ignoring generated directories, Composer `vendor`, and legacy PHP/Craft surfaces.

Start with [docs/README.md](docs/README.md).

## Skill

This repo also contains an installable Codex skill at `skills/scaffold`. Use it when an agent should apply these defaults to a new or existing project.
