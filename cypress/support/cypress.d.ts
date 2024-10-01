// cypress/support/cypress.d.ts
declare namespace Cypress {
	interface Chainable<Subject = any> {
		adminLogin(): Chainable<void>;
		login(): Chainable<void>;
		signOut(): Chainable<void>;
	}
}