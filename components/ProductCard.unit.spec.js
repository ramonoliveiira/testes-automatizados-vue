import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

const mountProductCard = (server) => {
  const product = server.create('product', {
    title: 'Relógio bonito',
    price: '22.00',
    image:
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=689&q=80',
  })

  const cartManager = new CartManager()

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  })

  return {
    wrapper,
    product,
    cartManager,
  }
}

describe('ProductCard - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('shoud match snapshot', () => {
    const { wrapper } = mountProductCard(server)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should mount the component', () => {
    const { wrapper } = mountProductCard(server)
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$22.00')
  })

  // it('should emit the event addToCart with product object when button gets clicked', async () => {
  //   const { wrapper, product } = mountProductCard(server)

  //   await wrapper.find('button').trigger('click')

  //   expect(wrapper.emitted().addToCart).toBeTruthy()
  //   expect(wrapper.emitted().addToCart.length).toBe(1)
  //   expect(wrapper.emitted().addToCart[0]).toEqual([{ product }])
  // })

  it('should add item to cartState on button click', async () => {
    const { wrapper, cartManager } = mountProductCard(server)
    const spy1 = jest.spyOn(cartManager, 'open')
    const spy2 = jest.spyOn(cartManager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
  })
})
