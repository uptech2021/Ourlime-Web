import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
	projectId: process.env.CYPRESS_PROJECT_ID,
	e2e: {
		setupNodeEvents(
			on: Cypress.PluginEvents,
			config: Cypress.PluginConfigOptions
		): Cypress.PluginConfigOptions {
			// Add the image snapshot plugin
			addMatchImageSnapshotPlugin(on, config);

			// Handle test failures
			on('after:screenshot', (details) => {
				console.log('Screenshot taken:', details);
			});

			// Define a custom task
			on('task', {
				log(message: string) {
					console.log(message);
					return null;
				},
			});

			// Modify configuration
			 config.baseUrl = process.env.CYPRESS_BASE_URL || 'http://localhost:3000';

            // Load environment variables into Cypress config
            config.env.USERNAME = process.env.CYPRESS_USERNAME;
            config.env.EMAIL = process.env.CYPRESS_EMAIL;
            config.env.PASSWORD = process.env.CYPRESS_PASSWORD;
            config.env.ADMIN_EMAIL = process.env.CYPRESS_ADMIN_EMAIL;
            config.env.ADMIN_PASSWORD = process.env.CYPRESS_ADMIN_PASSWORD;
            config.env.PHONE = process.env.CYPRESS_PHONE;
            config.env.FIRST_NAME = process.env.CYPRESS_FIRST_NAME;
            config.env.LAST_NAME = process.env.CYPRESS_LAST_NAME;
            config.env.COUNTRY = process.env.CYPRESS_COUNTRY;

			return config;
		},
		baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000', // Update this to match your development server URL
	},
});
