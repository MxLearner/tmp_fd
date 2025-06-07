import { describe, it, expect, vi, beforeEach, test } from 'vitest'
import { mount } from '@vue/test-utils'
import CommunityForum from '@/components/CommunityForum.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 测试用例,只能检测其响应的接口状态，不能检测其返回值
const testCases = [
  {
    no: 'cm_1',
    description: '用户名为空',
    userId: '',
    commentText: '这是一条评论',
    expectedStatus: 401, // 客户端校验，实际不会发起请求
    note: '不发送请求，前端会 alert'
  },
  {
    no: 'cm_2',
    description: '评论内容为空',
    userId: 'testuser',
    commentText: '',
    expectedStatus: 200, // 客户端校验，实际不会发起请求
    note: '不发送请求，前端会 alert ,但是后端允许空评论'
  },
  {
    no: 'cm_3',
    description: '用户不存在',
    userId: 'nouser',
    commentText: '无效用户评论测试',
    expectedStatus: 401,
    note: '后端应返回用户未授权'
  },
  {
    no: 'cm_4',
    description: '正常提交',
    userId: 'testuser',
    commentText: '这是一条有效评论',
    expectedStatus: 200,
    note: '评论成功'
  },
  {
    no: 'cm_5',
    description: '评论内容过长',
    userId: 'testuser',
    commentText: 'a'.repeat(201),
    expectedStatus: 400,
    note: '评论超过长度限制'
  },
  {
    no: 'cm_6',
    description: '未传评论时间',
    userId: 'testuser',
    commentText: '无时间字段测试',
    removeDate: true,
    expectedStatus: 400,
    note: '后端要求 comment_date 字段必传'
  },
]

describe('CommunityForum.vue 挂载测试', () => {

  beforeEach(() => {
    router.push('/')
    router.isReady()
  })

  it('应正常挂载组件，并正确显示帖子信息', async () => {
    // 模拟 query 参数传入
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

    const wrapper = mount(CommunityForum, {
      global: {
        plugins: [
          router,
          createTestingPinia({ createSpy: vi.fn, stubActions: false }) // Pinia stub
        ]
      }
    })

    // 检查组件是否存在
    expect(wrapper.exists()).toBe(true)

    // 验证标题、用户和内容是否正确显示
    expect(wrapper.find('h2').text()).toContain('测试标题')
    expect(wrapper.text()).toContain('测试用户')
    expect(wrapper.text()).toContain('这是一段测试帖子内容')
  })
})

describe('CommentPost.vue 评论接口测试', () => {
  for (const { no, description ,userId, commentText, expectedStatus, removeDate } of testCases) {

    test(`${no}: ${description} —— ${userId || '(空用户名)'}`, async () => {
      const payload: any = {
        userId: userId === 'testuser' ? '1' : '999', // 假设 999 为无效用户ID
        post_id: '1',
        text: commentText
      }

      if (!removeDate) {
        payload.comment_date = new Date().toISOString()
      }

      const res = await fetch('http://60.204.222.125:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      console.log(`${no} 响应状态码:`, res.status)

      expect(res.status).toBe(expectedStatus)
    })
  }
})