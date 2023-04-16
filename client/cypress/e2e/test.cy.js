describe('template spec', () => {
  it('Exists', () => {
    cy.visit('http://localhost:3000/');
  });

  it('Map cards load', () => {
    cy.visit('http://localhost:3000/');
    cy.contains('Duplicate').should('exist');
    cy.contains('Details').should('exist');
  });

  it('Import modal opens', () => {
    cy.visit('http://localhost:3000/');
    cy.get('.MuiAppBar-root').should('exist');
    cy.contains('button', 'Import').should('exist');
    cy.contains('button', 'Import').click();
    cy.contains('h2', 'Import').should('exist');
    });

    it('Import Frontend Test', () => {
      cy.visit('http://localhost:3000/');
      cy.get('.MuiAppBar-root').should('exist');
      cy.contains('button', 'Import').should('exist');
      cy.contains('button', 'Import').click();
      cy.contains('h2', 'Import').should('exist');
      cy.get('.MuiTypography-caption > .MuiButtonBase-root').should('exist')
      cy.get('.MuiTypography-caption > .MuiButtonBase-root').selectFile('sample_files/AFG_adm0.dbf', { action: 'drag-drop' })
      
      });

  //Check all rendered elements have default values
  // it('Default Rendered Values', () => {
  //   cy.visit('http://localhost:3000/')
  //   cy.get('input[name="username"]').should('have.value', '')
  //   cy.get('input[name="email"]').should('have.value', '')
  //   cy.get('input[name="password"]').should('have.value', '')
  //   cy.get('input[name="confirmPassword"]').should('have.value', '')
  //   cy.get('.PrivateSwitchBase-input').should('not.be.checked')
  //   cy.get('.MuiFormControlLabel-root > .MuiTypography-root').should('contains.text', 'I agree to the Terms of Service and Privacy Policy')
  //   cy.get('.MuiButton-root').should('contains.text', 'Create Your Account')
  //   cy.get('.MuiGrid-root > .MuiTypography-root').should('contains.text', 'Already have an account? Sign in')
  // })
})