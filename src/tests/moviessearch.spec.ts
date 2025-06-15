import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MovieSearch from '@/components/MovieSearch.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index'
import { test } from 'vitest'
import axios from 'axios'

window.alert = vi.fn()

// 测试用例,只能检测其响应的接口状态，不能检测其返回值
const testCases = [
  { no: 'sm_1', title: '12312414' , expected: 200, message: '成功搜索' },
  { no: 'sm_2', title: 'the' , expected: 200, message: '成功搜索' },
  { no: 'sm_3', title: '' , expected: 200, message: '成功搜索' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('MovieSearch.vue 搜索功能挂件测试', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })

  it('组件应成功挂载', () => {
    const wrapper = mount(MovieSearch, {
      global: { plugins: [router] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('应包含输入框和搜索按钮', () => {
    const wrapper = mount(MovieSearch, {
      global: { plugins: [router] },
    })

    const input = wrapper.find('[data-test="search-input"]')
    const button = wrapper.find('[data-test="search-button"]')

    expect(input.exists()).toBe(true)
    expect(button.exists()).toBe(true)
  })


    it('点击搜索按钮时应导航到搜索结果页面', async () => {
    const wrapper = mount(MovieSearch, {
        global: { plugins: [router] },
    })
    wrapper.vm.query = 'Inception'  // 设置搜索查询

    const routerPushSpy = vi.spyOn(router, 'push')

    await wrapper.get('[data-test="search-button"]').trigger('click')

    //对应handlesearch方法
    expect(routerPushSpy).toHaveBeenCalledWith({
        name: 'SearchResults',
        query: { q: 'Inception' },
    })
    })
})

describe('MovieSearch.vue 搜索接口测试', () => {
  for (const { no, title, expected, message} of testCases) {
    test(`${no}: ${message}——${title}`, async () => {
      const params = new URLSearchParams()
      params.append('title', title)

      const res = await axios.post('http://60.204.222.125:8080/api/movies',params.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      console.log('res:', res.data)  // 打印响应对象结构

      expect(res.status).toBe(expected)

    })
  }
})