import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem'
import { makeServer } from '@/miragejs/server'

const mountCardItem = (server) => {
  const product = server.create('product', {
    title: 'Lindo relógio',
    price: '22.33',
  })
  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
  })

  return { wrapper, product }
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
})
