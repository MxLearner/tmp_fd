import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, test } from 'vitest'
import UserProfile from '@/components/UserProfile.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'

// mock alert
window.alert = vi.fn()

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 测试用例,只能检测其响应的接口状态，不能检测其返回值
const testCases = [
  { no: 'cp_1', username: '', oldPassword: '123456', newPassword: '123456',expected: 401, message: '用户名不能为空' },
  { no: 'cp_2', username: 'testuser', oldPassword: '123456', newPassword: '', expected: 400, message: '新密码不能为空' },
  { no: 'cp_3', username: 'testuser', oldPassword: '123456', newPassword: '123', expected: 400, message: '新密码长度至少为6位' },
  { no: 'cp_4', username: 'testuser', oldPassword: '1234567', newPassword: '123456', expected: 401, message: '旧密码错误' },
  { no: 'cp_5', username: 'testuser', oldPassword: '123456', newPassword: '123456', expected: 200, message: '修改成功' },
  { no: 'cp_6', username: 'nouser', oldPassword: '123456', newPassword: '1234567', expected: 401, message: '用户不存在' },
  { no: 'cp_7', username: 'testuser', oldPassword: '', newPassword: '1234567', expected: 401, message: '旧密码不能为空' },
]

describe('UserProfile.vue', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })

  it('应正确渲染用户基本信息', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [router, createTestingPinia({
          initialState: {
            user: {
              userName: '测试用户',
              userId: '001',
              userEmail: 'test@example.com',
            },
          },
          stubActions: false,
        })],
      },
    })

    expect(wrapper.text()).toContain('姓名：')
    expect(wrapper.text()).toContain('ID：')
    expect(wrapper.text()).toContain('邮箱：')
  })

  it('应渲染修改密码表单项', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })

    expect(wrapper.find('input[placeholder="请输入原密码"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入新密码"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请确认新密码"]').exists()).toBe(true)
  })
})

it('点击提交按钮时触发 handleSubmit 并发起请求', async () => {
  const wrapper = mount(UserProfile, {
    global: {
        //初始定义store中的值
      plugins: [router, createTestingPinia({
            initialState: {
                index: {
                userName: 'testuser',
                userId: '1001',
                userEmail: 'test@example.com',
                },
            },
            stubActions: false,
        })],
    },
  })
  
  wrapper.vm.form.oldPassword = 'oldpass'
  wrapper.vm.form.newPassword = 'newpass123'
  wrapper.vm.form.confirmPassword = 'newpass123'

  // mock $post
  wrapper.vm.$post = vi.fn(() => Promise.resolve('密码修改成功!'))

  // 触发提交
  await wrapper.vm.handleSubmit()

  expect(wrapper.vm.$post).toHaveBeenCalledWith('/changePassword', {
    username: 'testuser',
    oldPassword: 'oldpass',
    newPassword: 'newpass123'
  })

  // 检查是否弹出提示
  expect(window.alert).toHaveBeenCalledWith('密码修改成功!')
})

it('不填写密码字段不提交表单', async () => {
  const wrapper = mount(UserProfile, {
    global: {
      plugins: [router, createTestingPinia()],
    },
  })

  wrapper.vm.$post = vi.fn()
  wrapper.vm.form.oldPassword = ''
  wrapper.vm.form.newPassword = ''
  wrapper.vm.form.confirmPassword = ''

  await wrapper.vm.handleSubmit()

  expect(wrapper.vm.$post).not.toHaveBeenCalled()
})

describe('UserProfile.vue 修改密码接口测试', () => {
  for (const { no, username, oldPassword, newPassword, message, expected} of testCases) {
    test(`${no}: ${message}`, async () => {
      const params = new URLSearchParams()
      params.append('username', username)
      params.append('oldPassword', oldPassword)
      params.append('newPassword', newPassword)


      const res = await fetch('http://60.204.222.125:8080/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })
      console.log('res:', res)  // 打印响应对象结构

      expect(res.status).toBe(expected)

    })
  }
})
