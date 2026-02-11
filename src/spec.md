# Specification

## Summary
**Goal:** Replace the site’s Meraki logo with the user-provided `logo.png` everywhere the logo is used (header, footer, and Open Graph metadata).

**Planned changes:**
- Update/replace the existing static logo asset `frontend/public/assets/generated/meraki-logo.dim_1024x1024.png` to match the uploaded `logo.png` (optimized for web use).
- Ensure the header logo reference in `frontend/src/features/landing/HeaderNav.tsx` displays the updated logo asset.
- Ensure the footer logo reference in `frontend/src/features/landing/Footer.tsx` displays the updated logo asset.
- Keep the Open Graph meta tag in `frontend/index.html` pointing to `/assets/generated/meraki-logo.dim_1024x1024.png` so social shares render the new logo.

**User-visible outcome:** The site shows the new “MERAKI INDIA” logo in the header and footer, and link previews use the updated logo image.
