import React from 'react';
import RegisterScreen from '../../src/components/RegisterScreen';

describe('<RegisterScreen />', () => {
  //Check all elements are rendered on page
  it('Renders', () => {
    cy.mount(<RegisterScreen />)
    cy.get('.MuiTypography-h5').should('exist')
    cy.get('.MuiTypography-subtitle2').should('exist')
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('input[name="confirmPassword"]').should('exist')
    cy.get('.PrivateSwitchBase-input').should('exist')
    cy.get('.MuiFormControlLabel-root > .MuiTypography-root').should('exist')
    cy.get('.MuiButton-root').should('exist')
    cy.get('.MuiGrid-root > .MuiTypography-root').should('exist')
    })

  //Check all rendered elements have default values
  it('Default Rendered Values', () => {
    cy.mount(<RegisterScreen />)
    cy.get('.MuiTypography-h5').should('contains.text', 'Create Your Account')
    cy.get('.MuiTypography-subtitle2').should('contains.text', 'Create an account to save and view your maps')
    cy.get('input[name="username"]').should('have.value', '')
    cy.get('input[name="email"]').should('have.value', '')
    cy.get('input[name="password"]').should('have.value', '')
    cy.get('input[name="confirmPassword"]').should('have.value', '')
    cy.get('.PrivateSwitchBase-input').should('not.be.checked')
    cy.get('.MuiFormControlLabel-root > .MuiTypography-root').should('contains.text', 'I agree to the Terms of Service and Privacy Policy')
    cy.get('.MuiButton-root').should('contains.text', 'Create Your Account')
    cy.get('.MuiGrid-root > .MuiTypography-root').should('contains.text', 'Already have an account? Sign in')
  })

})