/// <reference types="cypress" />

import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display the store', () => {
    server.createList('product', 1)

    cy.visit('')

    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })

  context('Store > Search for Products', () => {
    it('should type in the search field', () => {
      cy.visit('')

      cy.get('input[type="search"]')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })
    it.only('should type in the search field', () => {
      server.create('product', {
        title: 'Relógio bonito',
      })

      server.createList('product', 10)

      cy.visit('')

      cy.get('input[type="search"]').type('Relógio bonito')

      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"').should('have.length', 1)
    })
  })
})
