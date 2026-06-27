import { Page } from '@playwright/test';

/** Default instance settings returned by the public settings endpoint */
export const DEFAULT_INSTANCE_SETTINGS = {
    title: 'Hemmelig',
    disableUsers: false,
    requireRegisteredUser: false,
    allowRegistration: true,
    requireInviteCode: true,
    enableAnalytics: false,
    disableEmailPasswordSignup: false,
    maxSecretsPerUser: null,
    instanceName: '',
    instanceDescription: '',
    instanceLogo: '',
    allowPasswordProtection: true,
    allowIpRestriction: true,
    allowFileUpload: true,
    maxFileSize: 10,
};

/** Mock user used in authenticated tests */
export const MOCK_USER = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@hemmelig.local',
    username: 'testuser',
    role: 'admin',
    isAdmin: true,
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    banned: false,
};

export const MOCK_SESSION = {
    id: 'test-session-id',
    userId: MOCK_USER.id,
    token: 'test-token',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

/**
 * Suppress the Vite dev-server error overlay that appears when the backend
 * has module-load errors (e.g. missing Prisma generated client).  The overlay
 * is a custom element injected via WebSocket by /@vite/client; we intercept
 * customElements.define before any page script runs and replace it with a
 * harmless no-op element so it never blocks pointer events.
 */
export async function suppressViteOverlay(page: Page) {
    await page.addInitScript(() => {
        const _define = window.customElements.define.bind(window.customElements);
        window.customElements.define = function (
            name: string,
            constructor: CustomElementConstructor,
            options?: ElementDefinitionOptions
        ) {
            if (name === 'vite-error-overlay') {
                return _define(
                    name,
                    class extends HTMLElement {
                        connectedCallback() {
                            this.style.display = 'none';
                            this.remove();
                        }
                    },
                    options
                );
            }
            return _define(name, constructor, options);
        };
    });
}

/**
 * Mock the core API endpoints needed for the app to load.
 * Call this before navigating to any page.
 */
export async function mockCoreAPIs(page: Page, options: { authenticated?: boolean } = {}) {
    // Suppress the Vite dev-server error overlay first
    await suppressViteOverlay(page);
    // Setup status - app is already set up
    await page.route('**/api/setup/status', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ needsSetup: false }),
        });
    });

    // Public instance settings
    await page.route('**/api/instance/settings/public', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(DEFAULT_INSTANCE_SETTINGS),
        });
    });

    // Auth session endpoint (better-auth)
    await page.route('**/api/auth/get-session**', async (route) => {
        if (options.authenticated) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    session: MOCK_SESSION,
                    user: MOCK_USER,
                }),
            });
        } else {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(null),
            });
        }
    });

    // Analytics - 403 for non-admin in some tests, ignore for most
    await page.route('**/api/analytics**', async (route) => {
        await route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Forbidden' }),
        });
    });
}

/**
 * Mock authenticated dashboard API calls
 */
export async function mockDashboardAPIs(page: Page) {
    // Secrets list
    await page.route('**/api/secrets', async (route) => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        } else {
            route.continue();
        }
    });

    // Account info
    await page.route('**/api/account', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                username: MOCK_USER.username,
                email: MOCK_USER.email,
                name: MOCK_USER.name,
                twoFactorEnabled: false,
            }),
        });
    });

    // Instance settings (admin)
    await page.route('**/api/instance/settings', async (route) => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    ...DEFAULT_INSTANCE_SETTINGS,
                    managed: false,
                }),
            });
        } else {
            route.continue();
        }
    });

    // Instance managed
    await page.route('**/api/instance/managed', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ managed: false }),
        });
    });

    // Users list
    await page.route('**/api/user**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                users: [MOCK_USER],
                total: 1,
                page: 1,
                pageSize: 10,
                totalPages: 1,
            }),
        });
    });

    // Invites
    await page.route('**/api/invites', async (route) => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([]),
            });
        } else {
            route.continue();
        }
    });

    // Secret requests
    await page.route('**/api/secret-requests**', async (route) => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [], meta: { total: 0, page: 1, totalPages: 0 } }),
            });
        } else {
            route.continue();
        }
    });

    // Analytics
    await page.route('**/api/analytics/visitors/daily**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
        });
    });
}
