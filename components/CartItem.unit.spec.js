import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

const mountCardItem = (server) => {
  const cartManager = new CartManager()
  const product = server.create('product', {
    title: 'Lindo relógio',
    price: '22.33',
  })
  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  })

  return { wrapper, product, cartManager }
}
describe('CartItem', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environtment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const { wrapper } = mountCardItem(server)
    expect(wrapper.vm).toBeDefined()
  })
  it('should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCardItem(server)
    const content = wrapper.text()

    expect(content).toContain(title)
    expect(content).toContain(price)
  })

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCardItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')

    expect(quantity.text()).toContain('1')
  })

  it('should should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCardItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="+"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('2')
    await button.trigger('click')
    expect(quantity.text()).toContain('3')
    await button.trigger('click')
    expect(quantity.text()).toContain('4')
  })
  it('should should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCardItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="-"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })
  it('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCardItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="-"]')

    await button.trigger('click')
    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should display a button to remove item from cart', () => {
    const { wrapper } = mountCardItem(server)
    const button = wrapper.find('[data-testid="remove-button"]')

    expect(button.exists()).toBe(true)
  })

  it('should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, cartManager, product } = mountCardItem(server)
    const spy = jest.spyOn(cartManager, 'removeProduct')
    await wrapper.find('[data-testid="remove-button"').trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product.id)
  })
})
