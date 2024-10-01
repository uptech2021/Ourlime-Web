/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
Cypress.Commands.add('adminLogin', () => {
	cy.visit('/login');
	cy.get('input[placeholder="Email Address"]').type(Cypress.env('ADMIN_EMAIL'));
	cy.get('input[placeholder="Password"]').type(Cypress.env('ADMIN_PASSWORD'));
	cy.log('admin password', Cypress.env('ADMIN_PASSWORD'));
	cy.get('button[type="submit"]').click();
	cy.wait(2000)
	cy.url().should('not.include', '/login');
});

Cypress.Commands.add('login', () => {
	cy.visit('/login');
	cy.get('input[placeholder="Email Address"]').type(Cypress.env('EMAIL'));
	cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'));
	cy.get('button[type="submit"]').click();
	cy.wait(2000)
	cy.url().should('not.include', '/login');
});

Cypress.Commands.add('signOut', () => {
	const baseUrl = Cypress.config('baseUrl');
	cy.get('.nav-arrow').click();
	cy.get('li').contains('Sign Out').click();
	cy.wait(2000)
	cy.url().should('eq', `${baseUrl}/login`);
});