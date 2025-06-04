// Custom command for login (example)
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password') => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Custom command for API requests
Cypress.Commands.add('apiRequest', (method, url, body = {}) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

// Custom command for seeding data
Cypress.Commands.add('seedDatabase', () => {
  cy.task('db:seed');
});

// Custom command for cleaning data
Cypress.Commands.add('clearDatabase', () => {
  cy.task('db:clear');
});

// Custom command for waiting for page to load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.document().should('have.property', 'readyState', 'complete');
});
