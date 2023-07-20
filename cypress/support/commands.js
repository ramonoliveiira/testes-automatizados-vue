// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/* Criando comando personalizado */
Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`)
})

Cypress.Commands.add('addToCart', (mode) => {
  cy.getByTestId('product-card').as('productCards')

  const click = (index) => {
    cy.get('@productCards').eq(index).find('button').click({ force: true })
  }

  const addByIndex = () => {
    click(mode)
  }

  const addByIndexes = () => {
    for (const index of mode) {
      click(index)
    }
  }

  const addAll = () => {
    cy.get('@productCards').then(($elements) => {
      let i = 0
      while (i < $elements.length) {
        click(i)
        i++
      }
    })
  }

  if (Array.isArray(mode)) {
    addByIndexes()
  } else if (typeof mode === 'number') {
    addByIndex()
  } else if (typeof mode === 'string' && mode === 'all') {
    addAll()
  } else {
    throw new Error(
      'Please provide a valid input for cy.addToCart()\r\nPossible values are Array, number or "all"'
    )
  }
})
