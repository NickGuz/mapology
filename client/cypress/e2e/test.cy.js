describe("template spec", () => {
  const random = Math.trunc(Math.random() * 1000);

  it("Exists", () => {
    cy.visit("http://localhost:3000/");
  });

  it("Map cards load", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Duplicate").should("exist");
    cy.contains("Details").should("exist");
  });

  it("Import modal opens", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".MuiAppBar-root").should("exist");
    cy.contains("button", "Import").should("exist");
    cy.contains("button", "Import").click();
    cy.contains("h2", "Import").should("exist");
  });

  it("Import Map using dbf/shp", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".MuiAppBar-root").should("exist");
    cy.contains("button", "Import").should("exist");
    cy.contains("button", "Import").click();
    cy.contains("h2", "Import").should("exist");
    cy.get(".MuiTypography-caption > .MuiButtonBase-root").should("exist");
    cy.get(
      ".MuiTypography-caption > .MuiButtonBase-root"
    ).selectFile("cypress/sample_files/AFG_adm0.dbf", { action: "drag-drop" });
    cy.get(
      ".MuiTypography-caption > .MuiButtonBase-root"
    ).as('file-select');
    cy.get('@file-select').selectFile("cypress/sample_files/AFG_adm0.shp", { action: "drag-drop" });
    cy.get("#map-name").type("Cypress Map Shapefile " + random);
    cy.get("#description").type("Map Description Shapefile " + random);
    cy.get(".MuiDialogActions-root > :nth-child(2)").click(); //import button
    cy.wait(5000);
    cy.contains("Cypress Map Shapefile " + random).should("exist");
    cy.contains("Map Description Shapefile " + random).should("exist");
  });

  it("Export most recently created Map (dbf/shp)", () => {
    cy.visit("http://localhost:3000/");
    cy.get("button")
      .filter(':contains("Open Editor")')
      .first()
      .click();
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get("#download-dropdown-btn").click();
    cy.get('.MuiList-root > [tabindex="0"]').click(); //download as geojson
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get("#download-dropdown-btn").click();
    cy.get(".MuiList-root > :nth-child(2)").click(); //download as shapefile
    cy.readFile("cypress/downloads/Cypress Map Shapefile " + random + ".geo.json");
    cy.readFile("cypress/downloads/Cypress Map Shapefile " + random + "_shp.zip");
  });

  it("Delete Shapefile Map", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".card-details-btn")
      .filter(':contains("Details")')
      .first()
      .click();
    cy.contains("Cypress Map Shapefile " + random).should("exist");
    cy.get("#delete-map-btn").click();
    cy.get("#confirm-delete-btn").click();
    cy.visit("http://localhost:3000/");
    cy.contains("Cypress Map Shapefile " + random).should("not.exist");
  });

  it("Import Map using json", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".MuiAppBar-root").should("exist");
    cy.contains("button", "Import").should("exist");
    cy.contains("button", "Import").click();
    cy.contains("h2", "Import").should("exist");
    cy.get(".MuiTypography-caption > .MuiButtonBase-root").should("exist");
    cy.get(
      ".MuiTypography-caption > .MuiButtonBase-root"
    ).as('file-select');
    cy.get('@file-select').selectFile("cypress/sample_files/africa.geo.json", { action: "drag-drop" });
    cy.get("#map-name").type("Cypress Map JSON " + random);
    cy.get("#description").type("Map Description JSON " + random);
    cy.get(".MuiDialogActions-root > :nth-child(2)").click(); //import button
    cy.wait(5000);
    cy.contains("Cypress Map JSON " + random).should("exist");
    cy.contains("Map Description JSON " + random).should("exist");
  });

  it("Export most recently created Map (json)", () => {
    cy.visit("http://localhost:3000/");
    cy.get("button")
      .filter(':contains("Open Editor")')
      .first()
      .click();
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get("#download-dropdown-btn").click();
    cy.get('.MuiList-root > [tabindex="0"]').click(); //download as geojson
    // cy.get(".MuiGrid-grid-xs-10 > :nth-child(1) > :nth-child(5)").click(); // download button
    cy.get("#download-dropdown-btn").click();
    cy.get(".MuiList-root > :nth-child(2)").click(); //download as shapefile
    cy.readFile("cypress/downloads/Cypress Map JSON " + random + ".geo.json");
    cy.readFile("cypress/downloads/Cypress Map JSON " + random + "_shp.zip");
  });

  it("Delete GeoJSON Map", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".card-details-btn")
      .filter(':contains("Details")')
      .first()
      .click();
    cy.contains("Cypress Map JSON " + random).should("exist");
    cy.get("#delete-map-btn").click();
    cy.get("#confirm-delete-btn").click();
    cy.visit("http://localhost:3000/");
    cy.contains("Cypress Map JSON " + random).should("not.exist");
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
});
