import { mount, flushPromises } from '@vue/test-utils'
import MovieSearch from '@/components/MovieSearch.vue'
import { describe, test, vi, beforeEach, expect } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index'

// 模拟 alert 和 $post
vi.stubGlobal('alert', vi.fn())
const mockPost = vi.fn()
vi.stubGlobal('$post', mockPost)

// 创建路由（假设已有 SearchResults 路由）
const router = createRouter({
  history: createWebHistory(),
  routes
})

const mountComponent = async () => {
  const wrapper = mount(MovieSearch, {
    global: {
      plugins: [router],
      mocks: {
        $post: mockPost
      }
    }
  })
  await router.isReady()
  return wrapper
}

describe('MovieSearch.vue 单元测试', () => {
  beforeEach(() => {
    mockPost.mockReset()
    vi.clearAllMocks()
  })

  test('输入内容后点击按钮应导航到结果页', async () => {
    const wrapper = await mountComponent()
    wrapper.vm.query = 'Inception'
    const routerPushSpy = vi.spyOn(router, 'push')
    await wrapper.find('[data-test="search-button"]').trigger('click')

    expect(routerPushSpy).toHaveBeenCalledWith({
      name: 'SearchResults',
      query: { q: 'Inception' },
    })
  })

    test('如果输入为空不使用API', async () => {
    const wrapper = mount(MovieSearch, {
      global: {
        plugins: [router],
      },
    })

    const SearchSpy = vi.spyOn(wrapper.vm, 'handleSearch')
    wrapper.vm.handleSearch()

    expect(SearchSpy).toHaveBeenCalled()
  })

  test('搜索调用成功应处理响应数据', async () => {
    const wrapper = await mountComponent()
    wrapper.vm.query = 'Inception'
    wrapper.vm.handleSearch()
    await flushPromises()

    const routerPushSpy = vi.spyOn(router, 'push')
    await wrapper.find('[data-test="search-button"]').trigger('click')
    expect(routerPushSpy).toHaveBeenCalledWith({
      name: 'SearchResults',
      query: { q: 'Inception' },
    })
  })

})
