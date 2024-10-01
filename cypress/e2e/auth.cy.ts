/* This Cypress test suite verifies the authentication flow of the application.
	 It includes tests for:
	 1. Redirecting to the login page when visiting the home page without being logged in.
	 2. Displaying the home page after logging in as a regular user.
	 3. Redirecting to the home page when visiting the delete user page without being an admin.
	 4. Displaying the delete user form when visiting the delete user page as an admin.
	 5. Redirecting to the home page when visiting the login page while already logged in.
*/
	
describe('Authentication Tests', () => {
	const baseUrl = Cypress.config('baseUrl');

	beforeEach(() => {
		cy.clearCookies();
		cy.clearLocalStorage();
	});

	it('should redirect to login when visiting home page without being logged in', () => {
		cy.visit('/');
		cy.url().should('include', '/login');
	});

	it('should display home page after logging in', () => {
		cy.login();
		// cy.visit('/');
		cy.url().should('eq', `${baseUrl}/`);
		cy.signOut();
	});

	it('should redirect to home when visiting deleteuser without being admin', () => {
		cy.login();
		cy.visit('/deleteuser');
		cy.wait(2000);
		cy.url().should('eq', `${baseUrl}/`);
		cy.wait(2000);
		cy.signOut();
	});

	it('should display delete user form when visiting deleteuser as admin', () => {
		cy.adminLogin();
		cy.visit('/deleteuser');
		cy.url().should('eq', `${baseUrl}/deleteuser`);
		cy.get('input[placeholder="Email Address"]').should('be.visible');
		cy.visit('/')
		cy.signOut();
	});

	it('should redirect to home when visiting login page while logged in', () => {
		cy.login();
		cy.visit('/login');
		cy.get('input[type="email"]').should('not.exist');
		cy.url().should('eq', `${baseUrl}/`);
		cy.signOut();
	});

	it('should display login page when not logged in', () => {
		cy.visit('/login');
		cy.url().should('include', '/login');
		cy.get('input[placeholder="Email Address"]').should('exist');
		cy.contains('Welcome back'); // Replace with actual content check
	});
});
