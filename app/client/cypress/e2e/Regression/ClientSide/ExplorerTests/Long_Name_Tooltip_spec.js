const explorer = require("../../../../locators/explorerlocators.json");
import { ObjectsRegistry } from "../../../../support/Objects/Registry";
let ee = ObjectsRegistry.EntityExplorer;

const shortName = "shortName";
const longName = "AVeryLongNameThatOverflows";
const alternateName = "AlternateName";
const tooltTipQuery = `.rc-tooltip.ads-v2-tooltip:not(.rc-tooltip-hidden) > .rc-tooltip-content > .rc-tooltip-inner > .ads-v2-text`;
describe("Entity Explorer showing tooltips on long names", function () {
  it("1. Expect tooltip on long names only", function () {
    // create an API with a short name
    cy.CreateAPI(shortName);
    ee.ExpandCollapseEntity("Queries/JS", true);
    // assert that a tooltip does not show up during hover
    cy.get(`.t--entity-item:contains(${shortName})`).realHover();
    cy.get(tooltTipQuery).should("not.exist");
    // reset the hover
    cy.get("body").realHover({ position: "topLeft" });

    // create another API with a long name
    cy.CreateAPI(longName);

    // assert that a tooltip does show up during hover
    cy.get(`.t--entity-item:contains(${longName})`).realHover();
    cy.get(tooltTipQuery).should("have.text", longName);
    // reset the hover
    cy.get("body").realHover({ position: "topLeft" });

    // rename it and ensure the tooltip does not show again
    cy.get(`.t--entity-item:contains(${longName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Edit name");
    cy.get(explorer.editEntity)
      .last()
      .type(alternateName, { force: true })
      .blur();
    cy.wait("@saveAction");

    cy.get(`.t--entity-item:contains(${alternateName})`).realHover();
    cy.get(tooltTipQuery).should("not.exist");
  });
});
