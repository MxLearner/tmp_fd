import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CommunityForum from '@/components/CommunityForum.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index'
import { nextTick } from 'vue'

window.alert = vi.fn()
const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('CommunityForum.vue 评论功能测试', () => {
  beforeEach(async () => {
    router.push({
      path: '/',
      query: {
        postId: '1',
        postTitle: '测试标题',
        postText: '这是一段测试帖子内容',
        postDate: new Date().toISOString(),
        postUser: '测试用户',
        postMovie: '测试电影'
      }
    })
    await router.isReady()
  })

  it('应在用户名为空时 alert 并不发送请求', async () => {

    const wrapper = mount(CommunityForum, {
      global: {
        plugins: [
          router,
          createTestingPinia({ createSpy: vi.fn, stubActions: false }) // Pinia stub
        ]
      }
    })


    // 查看是否渲染了按钮
    const btn = wrapper.find('[data-test="writecomment-button"]')
    btn.trigger('click')
    
    // 等待 Vue 更新 DOM
    await nextTick()

    const btn2=wrapper.find('[data-test="submit-button"]')
    expect(btn2.exists()).toBe(true)

    await btn2.trigger('click')

    expect(window.alert).toHaveBeenCalledWith('未登录！')
  })

  it('应在评论为空时 alert 并不发送请求', async () => {

   const wrapper = mount(CommunityForum, {
      global: {
        plugins: [
          router,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              index: {
                userId: '1001',
                userName: 'testuser',
                userEmail: 'test@example.com'
              }
            },
            stubActions: false
          })
        ]
      }
    })

    const writeBtn = wrapper.find('[data-test="writecomment-button"]')
    expect(writeBtn.exists()).toBe(true)

    await writeBtn.trigger('click')
    await nextTick()


    const submitBtn = wrapper.find('[data-test="submit-button"]')
    expect(submitBtn.exists()).toBe(true)

    await submitBtn.trigger('click')
    await nextTick()


    expect(window.alert).toHaveBeenCalledWith('请填写所有必填字段后再提交！')
  })

})
