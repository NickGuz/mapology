describe('template spec', () => {
  const random = Math.trunc(Math.random() * 100)

  // it('Exists', () => {
  //   cy.visit('http://localhost:3000/');
  // });

  // it('Map cards load', () => {
  //   cy.visit('http://localhost:3000/');
  //   cy.contains('Duplicate').should('exist');
  //   cy.contains('Details').should('exist');
  // });

  // it('Import modal opens', () => {
  //   cy.visit('http://localhost:3000/');
  //   cy.get('.MuiAppBar-root').should('exist');
  //   cy.contains('button', 'Import').should('exist');
  //   cy.contains('button', 'Import').click();
  //   cy.contains('h2', 'Import').should('exist');
  //   });

    it('Import Maps using dbf/shp', () => {
      cy.visit('http://localhost:3000/');
      cy.get('.MuiAppBar-root').should('exist');
      cy.contains('button', 'Import').should('exist');
      cy.contains('button', 'Import').click();
      cy.contains('h2', 'Import').should('exist');
      cy.get('.MuiTypography-caption > .MuiButtonBase-root').should('exist')
      cy.get('.MuiTypography-caption > .MuiButtonBase-root').selectFile('cypress/sample_files/AFG_adm0.dbf', { action: 'drag-drop' })
      cy.get('.MuiTypography-caption > .MuiButtonBase-root').selectFile('cypress/sample_files/AFG_adm0.shp', { action: 'drag-drop' })
      cy.get('#map-name').type('Cypress Map DBF/SHP ' + random)
      cy.get('#description').type('Map Description DBF/SHP ' + random)
      cy.get('.MuiDialogActions-root > :nth-child(2)').click() //import button
      cy.reload()
      cy.contains('Cypress Map DBF/SHP ' + random).should('exist')
      cy.contains('Map Description DBF/SHP ' + random).should('exist')
      cy.log(random)
      });

      // it('Import Maps using json', () => {
      //   cy.visit('http://localhost:3000/');
      //   cy.get('.MuiAppBar-root').should('exist');
      //   cy.contains('button', 'Import').should('exist');
      //   cy.contains('button', 'Import').click();
      //   cy.contains('h2', 'Import').should('exist');
      //   cy.get('.MuiTypography-caption > .MuiButtonBase-root').should('exist')
      //   cy.get('.MuiTypography-caption > .MuiButtonBase-root').selectFile('cypress/sample_files/africa.geo.json', { action: 'drag-drop' })
      //   cy.get('#map-name').type('Cypress Map JSON ' + random)
      //   cy.get('#description').type('Map Description JSON ' + random)
      //   cy.get('.MuiDialogActions-root > :nth-child(2)').click() //import button
      //   cy.reload()
      //   cy.contains('Cypress Map JSON ' + random).should('exist');
      //   cy.contains('Map Description JSON ' + random).should('exist');
      //   });

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