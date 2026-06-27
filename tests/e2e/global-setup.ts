import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
    // The live app at http://localhost:4000 is already running.
    // All API calls are mocked inside each individual test via page.route().
    // No additional global setup is required.
}

export default globalSetup;
