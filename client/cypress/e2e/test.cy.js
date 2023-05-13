/* eslint-disable no-undef */
describe('template spec', () => {
  const random = Math.trunc(Math.random() * 1000);

  beforeEach(() => {
    cy.session('login', () => {
      cy.visit('http://localhost:3000/login/');
      cy.get('#userInfo').type('asdf');
      cy.get('#password').type('123');
      cy.get(
        '#root > div.MuiBox-root.css-i9gxme > div > div > main > div > form > button'
      ).click();
      cy.location('pathname').should('eq', '/');
    });
  });

  it('Login', () => {
    cy.visit('http://localhost:3000/');
  });

  it('Map cards load', () => {
    cy.visit('http://localhost:3000/');
    cy.wait(1000);
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

  it('Import Map using dbf/shp', () => {
    cy.visit('http://localhost:3000/');
    cy.wait(1000); // wait as an attempt to prevent re-rendering removing the import modal when we click
    cy.get('.MuiAppBar-root').should('exist');
    cy.contains('button', 'Import').should('exist');
    cy.contains('button', 'Import').click();
    cy.contains('h2', 'Import').should('exist');
    cy.get('.MuiTypography-caption > .MuiButtonBase-root').should('exist');
    cy.get('.MuiTypography-caption > .MuiButtonBase-root').as('file-select');
    cy.get('@file-select').selectFile('cypress/sample_files/AFG_adm0.dbf', {
      action: 'drag-drop',
    });
    cy.get('@file-select').selectFile('cypress/sample_files/AFG_adm0.shp', {
      action: 'drag-drop',
    });
    cy.get('#map-name').type('Cypress Map Shapefile ' + random);
    cy.get('#description').type('Map Description Shapefile ' + random);
    cy.get('.MuiDialogActions-root > :nth-child(2)').click(); //import button
    cy.wait(5000);
    cy.contains('Cypress Map Shapefile ' + random).should('exist');
    cy.contains('Map Description Shapefile ' + random).should('exist');
  });

  it('Export most recently created Map (dbf/shp)', () => {
    cy.visit('http://localhost:3000/');
    cy.get('button').filter(':contains("Open Editor")').first().click();
    cy.wait(5000);
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get('#download-dropdown-btn').click();
    cy.get('.MuiList-root > [tabindex="0"]').click(); //download as geojson
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get('#download-dropdown-btn').click();
    cy.get('.MuiList-root > :nth-child(2)').click(); //download as shapefile
    cy.readFile(
      'cypress/downloads/Cypress Map Shapefile ' + random + '.geo.json'
    );
    cy.readFile(
      'cypress/downloads/Cypress Map Shapefile ' + random + '_shp.zip'
    );
  });

  it('Delete Shapefile Map', () => {
    cy.visit('http://localhost:3000/');
    cy.get('.card-details-btn').filter(':contains("Details")').first().click();
    cy.contains('Cypress Map Shapefile ' + random).should('exist');
    cy.get('#delete-map-btn').click();
    cy.get('#confirm-delete-btn').click();
    cy.visit('http://localhost:3000/');
    cy.contains('Cypress Map Shapefile ' + random).should('not.exist');
  });

  it('Import Map using json', () => {
    cy.visit('http://localhost:3000/');
    cy.wait(1000); // wait as an attempt to prevent re-rendering removing the import modal when we click
    cy.get('.MuiAppBar-root').should('exist');
    cy.contains('button', 'Import').should('exist');
    cy.contains('button', 'Import').click();
    cy.contains('h2', 'Import').should('exist');
    cy.get('.MuiTypography-caption > .MuiButtonBase-root').should('exist');
    cy.get('.MuiTypography-caption > .MuiButtonBase-root').as('file-select');
    cy.get('@file-select').selectFile('cypress/sample_files/africa.geo.json', {
      action: 'drag-drop',
    });
    cy.get('#map-name').type('Cypress Map JSON ' + random);
    cy.get('#description').type('Map Description JSON ' + random);
    cy.get('.MuiDialogActions-root > :nth-child(2)').click(); //import button
    cy.wait(5000);
    cy.contains('Cypress Map JSON ' + random).should('exist');
    cy.contains('Map Description JSON ' + random).should('exist');
  });

  it('Export most recently created Map (json)', () => {
    cy.visit('http://localhost:3000/');
    cy.get('button').filter(':contains("Open Editor")').first().click();
    cy.wait(500);
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get('#download-dropdown-btn').click();
    cy.get('.MuiList-root > [tabindex="0"]').click(); //download as geojson
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get('#download-dropdown-btn').click();
    cy.get('.MuiList-root > :nth-child(2)').click(); //download as shapefile
    cy.readFile('cypress/downloads/Cypress Map JSON ' + random + '.geo.json');
    cy.readFile('cypress/downloads/Cypress Map JSON ' + random + '_shp.zip');
  });

  it('Merge 2 regions', () => {
    cy.visit('http://localhost:3000/', {
      onBeforeLoad(win) {
        cy.stub(win, 'prompt').returns('Test Region');
      },
    });
    cy.get('button').filter(':contains("Open Editor")').first().click();
    cy.wait(500);

    // Click on Libya
    cy.get(
      '#leaflet-canvas > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(17)'
    ).click();

    // Click on Egypt
    cy.get(
      '#leaflet-canvas > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(47)'
    ).click();

    // It double clicks for some reason, so close rename popup
    cy.get('#cancel-button').click();

    // Click merge button
    cy.get('[aria-label="Merge"]').click();

    // Check that the new region exists, might not work
    cy.contains('Test Region').should('exist');
  });

  it('Delete GeoJSON Map', () => {
    cy.visit('http://localhost:3000/');
    cy.get('.card-details-btn').filter(':contains("Details")').first().click();
    cy.contains('Cypress Map JSON ' + random).should('exist');
    cy.get('#delete-map-btn').click();
    cy.get('#confirm-delete-btn').click();
    cy.visit('http://localhost:3000/');
    cy.contains('Cypress Map JSON ' + random).should('not.exist');
  });
});
