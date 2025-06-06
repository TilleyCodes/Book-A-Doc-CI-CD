describe('Homepage Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage without errors', () => {
    cy.url().should('include', '/');
    cy.get('body').should('be.visible');
    // Check if the main heading is there - updated to match actual content
    cy.contains('Book a Doc').should('be.visible');
  });

  it('should have working navigation', () => {
    // Test basic navigation - checking for actual content
    cy.get('body').should('contain.text', 'Book a Doc');
    
    // Check for common navigation elements
    cy.get('body').should('contain.text', 'Home');
    cy.get('body').should('contain.text', 'About');
    cy.get('body').should('contain.text', 'Login');
  });

  it('should work on different screen sizes', () => {
    // Test mobile
    cy.viewport(375, 667);
    cy.get('body').should('be.visible');

    // Test desktop
    cy.viewport(1280, 720);
    cy.get('body').should('be.visible');
  });
});

describe('Basic API Tests', () => {
  it('should connect to the backend API', () => {
    // Try to connect to the backend
    cy.request({
      url: 'http://localhost:3000/',
      failOnStatusCode: false,
    }).then((response) => {
      // Just check if we get some response
      expect(response.status).to.be.oneOf([200, 404, 500]);
    });
  });

  // TODO: Add more API tests when I learn how to handle authentication
});
