import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard'
import { makeServer } from '@/miragejs/server'
describe('ProductCard - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
  })
  it('shoud match snapshot', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '22.00',
          image:
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=689&q=80',
        }),
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
  it('Component mount', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '22.00',
        }),
      },
    })
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$22.00')
  })
})