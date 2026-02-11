# Specification

## Summary
**Goal:** Generate a fresh ZIP export of the current project codebase and provide a new direct download link.

**Planned changes:**
- Create a new ZIP archive export from the current project state, including frontend/, backend/, static assets, and required root configuration files.
- Produce and return a direct download URL for the newly generated ZIP.
- Validate the primary download link is reachable and serves a ZIP payload before returning it.
- If the primary host/domain is unreachable, provide at least one alternative way to download the same ZIP along with clear English fallback instructions.

**User-visible outcome:** The user receives a working, newly generated ZIP download link (with a verified ZIP payload) and a fallback download option with instructions if the primary link is unavailable.
