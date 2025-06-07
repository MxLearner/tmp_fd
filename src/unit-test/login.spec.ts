import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserLogin from '@/components/UserLogin.vue'
import { createRouter, createWebHistory } from 'vue-router'

// mock store
vi.mock('@/store', () => ({
  useStore: () => ({
    setUserName: vi.fn(),
    setUserId: vi.fn(),
    setUserEmail: vi.fn(),
  })
}))

// mock $post
const mockPost = vi.fn()
vi.stubGlobal('alert', vi.fn()) 
vi.stubGlobal('$post', mockPost) 

// 创建测试 router（避免跳转报错）
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'Index', component: { template: '<div>Index</div>' } }, { path: '/register', name: 'Register', component: { template: '<div>Register</div>' } }]
})

// 初始化 wrapper
const mountLogin = async () => {
  const wrapper = mount(UserLogin, {
    global: {
      plugins: [router],
      mocks: {
        $post: mockPost // ✅ 关键在这
      }
    }
  })
  await router.isReady()
  return wrapper
}

describe('login单元测试', () => {
  beforeEach(() => {
    mockPost.mockReset()
  })

  test('用户名为空时报错', async () => {
    const wrapper = await mountLogin()
    wrapper.vm.form.username = ''
    wrapper.vm.form.password = '123456'
    await wrapper.find('[data-test="login-button"]').trigger('click')
    expect(wrapper.find('[data-test="message"]').text()).toBe('用户名和密码不能为空')
  })

  test('密码为空时报错', async () => {
    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'testuser'
    wrapper.vm.form.password = ''
    await wrapper.find('[data-test="login-button"]').trigger('click')
    expect(wrapper.find('[data-test="message"]').text()).toBe('用户名和密码不能为空')
  })

  test('用户名密码正确时登录成功', async () => {
    mockPost.mockResolvedValue({
      message: '登录成功!',
      username: 'testuser',
      password: '123456'
    })

    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'testuser'
    wrapper.vm.form.password = '123456'

    await wrapper.find('[data-test="login-button"]').trigger('click')

    await flushPromises()

    expect(mockPost).toHaveBeenCalledWith('/login', {
      username: 'testuser',
      password: '123456'
    })

    expect(wrapper.find('[data-test="message"]').text()).toBe('登录成功!')
  })
    test('用户名密码正确时登录成功', async () => {
    mockPost.mockResolvedValue({
      message: '登录成功!',
      username: 'testuser2',
      password: '1234567'
    })

    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'testuser2'
    wrapper.vm.form.password = '1234567'

    await wrapper.find('[data-test="login-button"]').trigger('click')

    await flushPromises()

    expect(mockPost).toHaveBeenCalledWith('/login', {
      username: 'testuser2',
      password: '1234567'
    })

    expect(wrapper.find('[data-test="message"]').text()).toBe('登录成功!')
  })

    test('用户名密码正确时登录成功', async () => {
    mockPost.mockResolvedValue({
      message: '登录成功!',
      username: 'testuser3',
      password: '123456'
    })

    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'testuser3'
    wrapper.vm.form.password = '123456'

    await wrapper.find('[data-test="login-button"]').trigger('click')

    await flushPromises()

    expect(mockPost).toHaveBeenCalledWith('/login', {
      username: 'testuser3',
      password: '123456'
    })

    expect(wrapper.find('[data-test="message"]').text()).toBe('登录成功!')
  })

  test('账号密码错误时登录失败', async () => {
    mockPost.mockRejectedValue({ error: '账号或密码错误' })

    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'nouser'
    wrapper.vm.form.password = '123456'
    await wrapper.find('[data-test="login-button"]').trigger('click')

    await flushPromises()

    expect(wrapper.find('[data-test="message"]').text()).toBe('账号或密码错误')

  })

  test('账号密码错误时登录失败', async () => {
    mockPost.mockRejectedValue({ error: '账号或密码错误' })

    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'nouser2'
    wrapper.vm.form.password = '123456'
    await wrapper.find('[data-test="login-button"]').trigger('click')

    await flushPromises()

    expect(wrapper.find('[data-test="message"]').text()).toBe('账号或密码错误')

  })

  test('账号密码错误时登录失败', async () => {
    mockPost.mockRejectedValue({ error: '账号或密码错误' })

    const wrapper = await mountLogin()
    wrapper.vm.form.username = 'nouser3'
    wrapper.vm.form.password = '123456'
    await wrapper.find('[data-test="login-button"]').trigger('click')

    await flushPromises()

    expect(wrapper.find('[data-test="message"]').text()).toBe('账号或密码错误')

  })
})
