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

    cy.visit('/')
    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })

  context('Store > Product List', () => {
    it('should display "0 Products" when no product is returned', () => {
      cy.visit('/')
      cy.get('[data-testid="product-card"').should('have.length', 0)
      cy.get('body').contains('0 Products')
    })
    it('should display "1 Product" when 1 product is returned', () => {
      server.create('product')

      cy.visit('/')
      cy.get('[data-testid="product-card"').should('have.length', 1)
      cy.get('body').contains('1 Product')
    })
    it('should display "10 Products" when 10 products are returned', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.get('[data-testid="product-card"').should('have.length', 10)
      cy.get('body').contains('10 Products')
    })
  })

  context('Store > Search for Products', () => {
    it('should type in the search field', () => {
      cy.visit('/')
      cy.get('input[type="search"]').type('Some text here')
      cy.get('input[type="search"]').should('have.value', 'Some text here')
    })
    it('should return 1 product when "Relógio bonito" is used as search term', () => {
      server.create('product', {
        title: 'Relógio bonito',
      })
      server.createList('product', 10)

      cy.visit('/')
      cy.get('input[type="search"]').type('Relógio bonito')
      cy.get('[data-testid="search-form"]').submit()
      cy.get('[data-testid="product-card"').should('have.length', 1)
    })
    it('should not return any product', () => {
      server.createList('product', 10)

      cy.visit('/')
      cy.get('input[type="search"]').type('Relógio bonito')
      cy.get('[data-testid="search-form"]').submit()
      cy.get('[data-testid="product-card"').should('have.length', 0)
      cy.get('body').contains('0 Products')
    })
  })
})
