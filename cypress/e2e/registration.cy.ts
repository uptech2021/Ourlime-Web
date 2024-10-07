describe('Registration Multi-Step Form That Deletes User On Cleanup', () => {
	it.only('should complete the registration process', () => {
		cy.visit('/register');
		// Debugging: Log environment variables
		// Step 1
		cy.get('input[placeholder="Username"]').type(Cypress.env('USERNAME'));
		cy.get('input[placeholder="Email Address"]').type(Cypress.env('EMAIL'));
		cy.get('.PhoneInputInput').type(Cypress.env('PHONE'));
		cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'));
		cy.get('input[placeholder="Confirm Password"]').type(
			Cypress.env('PASSWORD')
		);
		cy.contains('Next Step!').click();

		cy.get(`img[src="/images/register/realisticAvatarWhiteMan.svg"]`).click();

		// Step 2
		cy.contains('Next Step!').click();

		// Step 3
		cy.get('input[placeholder="First Name"]').type(Cypress.env('FIRST_NAME'));
		cy.get('input[placeholder="Last Name"]').type(Cypress.env('LAST_NAME'));
		cy.get('input[placeholder="Country"]').type(Cypress.env('COUNTRY'));

		cy.contains('Gender').click();
		cy.get('li').contains('Male').click();

		cy.get('button').eq(1).click();
		cy.get('span').contains('5').click();

		cy.contains('Register!').click();

		// Verify registration success
		cy.wait(5000);
		cy.url().should('include', '/login');
	});

	it('should login the user', () => {
		cy.visit('/login');

		cy.get('input[placeholder="Email Address"]').type(Cypress.env('EMAIL'));
		cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'));
		cy.contains('Login').click();

		cy.contains('Please verify your email before logging in.').should(
			'be.visible'
		); 
	});

	it('should delete the user', () => {
		cy.adminLogin()
		cy.visit('/deleteuser');

		cy.get('input[type="email"]').type(Cypress.env('EMAIL'));
		cy.get('input[type="password"]').type(Cypress.env('PASSWORD'));
		cy.get('button').first().click();

		// Verify deletion success
		cy.wait(2000);
		cy.contains('User deleted successfully.').should('be.visible');
	});
});