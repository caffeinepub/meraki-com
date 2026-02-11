MERAKI INDIA - CODEBASE EXPORT
================================

This ZIP archive contains the complete source code for the Meraki India spiritual services website.

DOWNLOAD ARTIFACTS
------------------

This export process creates TWO ZIP files for redundancy:

1. Primary:   meraki-codebase-export.zip
   Standard filename for easy identification and sharing.

2. Secondary: meraki-codebase-export-[timestamp].zip
   Timestamped backup created automatically alongside the primary file.
   Use this if the primary file is unavailable or if you need to keep
   multiple versions.

Both files contain identical content. If a download link fails, look for
either file in your project root directory.

FALLBACK DOWNLOAD OPTION
------------------------

If the web-based download link is unavailable or fails validation:

1. Open a terminal in your project root directory
2. Run: node frontend/scripts/export-codebase-zip.mjs
3. Locate the generated ZIP files in your project root:
   - meraki-codebase-export.zip (primary)
   - meraki-codebase-export-[timestamp].zip (timestamped backup)

Both files contain identical content and can be used interchangeably.

DIRECTORY STRUCTURE
-------------------

frontend/
  Contains the React + TypeScript web application.
  - frontend/src/          React components, pages, and hooks
  - frontend/public/       Static assets including images and icons
  - frontend/index.html    HTML entry point
  - frontend/package.json  Frontend dependencies

backend/
  Contains the Motoko smart contract code that runs on the Internet Computer.
  - backend/main.mo        Main canister logic
  - backend/authorization/ Access control system

Root Configuration Files:
  - dfx.json              Internet Computer project configuration
  - package.json          Root project scripts
  - README.md             Project documentation (if present)

IMPORTANT NOTES
---------------

1. INQUIRIES STORAGE
   When visitors submit the "Book Your Consultation" form, their details are stored
   in the Internet Computer canister backend (backend/main.mo).
   
   NO EMAIL IS SENT by default. Form submissions are accessible only through the
   owner-only Inquiries Dashboard (requires Internet Identity login).

2. CONTACT INFORMATION
   Default contact details are:
   - Email: meetrishabmehta@gmail.com
   - Phone: 9990093666
   
   These can be updated by the admin through the Site Settings page.

3. AUTHENTICATION
   The site uses Internet Identity for admin authentication. Only authenticated
   admins can:
   - View submitted inquiries
   - Update site settings
   - Access the admin dashboard
   - Generate project exports

4. SERVICES
   The site showcases four spiritual services:
   - Numerology
   - Vaastu Shastra
   - Aura Reading
   - Reiki Healing

5. IMAGES AND ASSETS
   All images are located in frontend/public/assets/generated/
   - meraki-logo.dim_1024x1024.png (site logo)
   - meraki-hero-bg.dim_1920x1080.png (hero background)
   - meraki-pattern.dim_1200x1200.png (decorative pattern)
   - icon-numerology.dim_256x256.png (service icon)
   - icon-vaastu.dim_256x256.png (service icon)
   - icon-aura.dim_256x256.png (service icon)
   - icon-reiki.dim_256x256.png (service icon)

GETTING STARTED
---------------

To run this project locally:

1. Install dependencies:
   npm install
   cd frontend && npm install

2. Start the Internet Computer local replica:
   dfx start --background

3. Deploy the backend canister:
   dfx deploy backend

4. Start the frontend development server:
   cd frontend && npm start

5. Open http://localhost:3000 in your browser

For production deployment to the Internet Computer mainnet, refer to the
Internet Computer documentation at https://internetcomputer.org/docs

TECHNOLOGY STACK
----------------

Frontend:
  - React 19
  - TypeScript
  - Tailwind CSS
  - TanStack Router
  - TanStack Query (React Query)
  - Shadcn/ui components

Backend:
  - Motoko (Internet Computer smart contract language)
  - Internet Computer Protocol (ICP)

Authentication:
  - Internet Identity (decentralized authentication)

TROUBLESHOOTING
---------------

If you encounter issues:

1. Ensure all dependencies are installed (npm install in both root and frontend/)
2. Check that dfx is installed and running (dfx --version)
3. Verify Node.js version is 18+ (node --version)
4. Clear caches if needed: rm -rf .dfx frontend/node_modules frontend/dist

SUPPORT
-------

This codebase was built using Caffeine.ai
For questions about the Internet Computer platform, visit https://internetcomputer.org

For questions about this specific implementation, refer to the code comments
and the Internet Computer developer documentation.

================================
Built with love using caffeine.ai
https://caffeine.ai
