import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserLogin from '@/components/UserLogin.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import {routes} from '@/router/index'
import { test } from 'vitest'

window.alert = vi.fn()

// 测试用例,只能检测其响应的接口状态，不能检测其返回值
const testCases = [
  { no: 'li_1', username: '', password: '123456', expected: 401, message: '用户名不能为空' },
  { no: 'li_2', username: 'testuser', password: '', expected: 401, message: '密码不能为空' },
  { no: 'li_3', username: 'testuser', password: '123456', expected: 200, message: '登录成功' },
  { no: 'li_4', username: 'testuser', password: 'qwe', expected: 401, message: '密码错误' },
  { no: 'li_5', username: 'testuser', password: 'qwe231', expected: 401, message: '密码错误' },
]

// 模拟 router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

describe('UserLogin.vue 组件挂载测试', () => {
  beforeEach(async () => {
    // 确保每次测试都进入干净的 router 实例
    router.push('/')
    await router.isReady()
  })

  it('账号密码输入框挂载', () => {
    const wrapper = mount(UserLogin, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })
    expect(wrapper.find('input[placeholder="请输入用户名"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入密码"]').exists()).toBe(true)
  })

  it('登录注册按钮挂载', () => {
    const wrapper = mount(UserLogin, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })

    const loginButton = wrapper.findAllComponents({ name: 'ElButton' }).at(0)
    const registerButton = wrapper.findAllComponents({ name: 'ElButton' }).at(1)

    expect(loginButton?.text()).toContain('登录')
    expect(registerButton?.text()).toContain('注册')
  })

  it('如果账号密码为空不使用API', async () => {
    const wrapper = mount(UserLogin, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })

    const loginSpy = vi.spyOn(wrapper.vm, 'handleLogin')
    await wrapper.vm.handleLogin()

    expect(loginSpy).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('calls handleLogin when login button is clicked', async () => {
    const wrapper = mount(UserLogin, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })


    wrapper.vm.form.username = 'testuser'
    wrapper.vm.form.password = '123456'

    // mock $post
    wrapper.vm.$post = vi.fn(() =>
      Promise.resolve({
        message: '登录成功!',
        username: '1',
        email: 'test@example.com',
      })
    )

    const loginButton = wrapper.findAllComponents({ name: 'ElButton' }).at(0)
    await loginButton?.trigger('click')

    expect(wrapper.vm.$post).toHaveBeenCalledWith('/login', {
      username: 'testuser',
      password: '123456',
    })
  })
})

describe('UserLogin.vue 登录接口测试', () => {
  for (const { no, username, password, expected, message} of testCases) {
    test(`${no}: ${message}——${username} / ${password}`, async () => {
      const params = new URLSearchParams()
      params.append('username', username)
      params.append('password', password)

      const res = await fetch('http://60.204.222.125:8080/api/login', {
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