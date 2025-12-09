# Risk Assessment Pro 🛡️

A professional web platform for Risk Assessment and Management, designed for security professionals and facility managers.

## Features ✨

*   **Visual Mapping**: Organize assets and zones in a hierarchical tree.
*   **Intelligent Risk Calculation**: Automatic R = P x D (Probability x Damage) calculation.
*   **Status Tracking**: Track risk mitigation status (Open, In Progress, Resolved).
*   **Cloud Persistence**: Powered by Supabase for real-time data storage and security.
*   **Professional Reporting**: Generate HTML/PDF reports (client-side generation).

## Tech Stack 🛠️

*   **Frontend**: React, TypeScript, Vite
*   **Backend/DB**: Supabase (PostgreSQL + Auth)
*   **Deploy**: Vercel / Netlify

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up Supabase:
    *   Create a project.
    *   Run the migrations in `supa_migrations/`.
    *   Add your URL and Anon Key to `src/supabaseClient.ts` (or env vars).
4.  Run development server:
    ```bash
    npm run dev
    ```

## License

MIT License. See [LICENSE](LICENSE) file.
