import { mount, flushPromises } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile.vue'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, test, vi, beforeEach, expect } from 'vitest'


vi.stubGlobal('alert', vi.fn())

const mockPost = vi.fn()
vi.stubGlobal('$post', mockPost)

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'Home', component: { template: '<div>Home</div>' } }],
})

const mountComponent = async () => {
  const wrapper = mount(UserProfile, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            index: {
              userName: 'testuser',
              userId: '1001',
              userEmail: 'test@example.com',
            },
          },
          stubActions: false
        }),
        router
      ],
      mocks: {
        $post: mockPost
      }
    }
  })
  await router.isReady()
  return wrapper
}
describe('UserFile单元测试', () => {
  beforeEach(() => {
    mockPost.mockReset()
    vi.clearAllMocks()
  })

test('空输入旧密码不应调用 $post', async () => {
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = ''
  wrapper.vm.form.newPassword = '12345'
  wrapper.vm.form.confirmPassword = '12345'
  await wrapper.vm.handleSubmit()
  expect(mockPost).not.toHaveBeenCalled()
})

test('空输入新密码不应调用 $post', async () => {
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = '12345'
  wrapper.vm.form.newPassword = ''
  wrapper.vm.form.confirmPassword = '12345'
  await wrapper.vm.handleSubmit()
  expect(mockPost).not.toHaveBeenCalled()
})

test('空输入确认密码不应调用 $post', async () => {
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = '12345'
  wrapper.vm.form.newPassword = '12345'
  wrapper.vm.form.confirmPassword = ''
  await wrapper.vm.handleSubmit()
  expect(mockPost).not.toHaveBeenCalled()
})

test('输入全为空不应调用 $post', async () => {
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = ''
  wrapper.vm.form.newPassword = ''
  wrapper.vm.form.confirmPassword = ''
  await wrapper.vm.handleSubmit()
  expect(mockPost).not.toHaveBeenCalled()
})

test('修改密码成功应调用 alert', async () => {
  mockPost.mockResolvedValue('密码修改成功!')
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = '123456'
  wrapper.vm.form.newPassword = 'abcdef'
  wrapper.vm.form.confirmPassword = 'abcdef'
  await wrapper.vm.handleSubmit()
  await flushPromises()
  expect(mockPost).toHaveBeenCalledWith('/changePassword', {
    username: 'testuser',
    oldPassword: '123456',
    newPassword: 'abcdef',
  })
  expect(window.alert).toHaveBeenCalledWith('密码修改成功!')
})

test('修改密码失败应弹出原密码错误', async () => {
  mockPost.mockRejectedValue(new Error('Wrong password'))
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = 'wrongpass'
  wrapper.vm.form.newPassword = 'newpass123'
  wrapper.vm.form.confirmPassword = 'newpass123'
  await wrapper.vm.handleSubmit()
  await flushPromises()
  expect(mockPost).toHaveBeenCalled()
  expect(window.alert).toHaveBeenCalledWith('原密码错误!')
})

test('新密码和确认密码不匹配时不提交表单', async () => {
  const wrapper = await mountComponent()
  wrapper.vm.form.oldPassword = '123456'
  wrapper.vm.form.newPassword = 'newpass123'
  wrapper.vm.form.confirmPassword = 'differentpass'
  await wrapper.vm.handleSubmit()
  expect(mockPost).not.toHaveBeenCalled()
  expect(window.alert).toHaveBeenCalledWith('新密码和确认密码不一致!')
})
}
)