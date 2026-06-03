# Agent Skill Packaging

Scaffold's Project Docs should remain the source of truth, with one agent skill distribution surface exposed to Codex, Claude Code, and Cursor through platform-specific Skill Wrappers. This keeps the Scaffold Baseline coherent across supported coding assistants while still allowing each platform to use its own metadata, command, rules, or install conventions.

## Considered Options

- Maintain separate hand-written skills for each coding assistant.
- Maintain the Project Docs as the source of truth, with generated or adapted Skill Wrappers for each assistant.

Separate hand-written skills were rejected because they would drift as the Scaffold Baseline changes.
