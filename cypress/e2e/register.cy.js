// cypress/e2e/register.cy.js

describe("UserRegister 组件 E2E 测试", () => {
  beforeEach(() => {
    // 假设你的 baseUrl 在 cypress.config.js 已经设为了 'http://60.204.222.125:8080'
    // 如果你的注册页路由不是 '/register'，请相应地修改这一行
    cy.visit("/register");
  });

  it("密码和确认密码不一致时，应显示校验错误", () => {
    // 输入用户名
    cy.get('input[placeholder="请输入用户名"]')
      .should("exist")
      .type("testuser123");

    // 输入密码
    cy.get('input[placeholder="请输入密码"]')
      .should("exist")
      .type("Aa123456");

    // 在“确认密码”输入不同的内容
    cy.get('input[placeholder="请再次输入密码"]')
      .should("exist")
      .type("Bb654321")
      // 触发 blur 事件，让 Element Plus 的校验规则生效
      .blur();

    // 此时，Element Plus 会在 “确认密码” 下方渲染一个 <div class="el-form-item__error">—
    // 里面的文本应该是 “两次输入的密码不一致”
    cy.get(".el-form-item__error")
      .should("contain.text", "两次输入的密码不一致");
  });

  it("正确填写信息后，点击注册应调用接口并跳转到登录页", () => {
    //    这里模拟后端返回 { message: "注册成功!" }
    cy.intercept("POST", "/api/register", {
      statusCode: 200,
      body: { message: "注册成功!" }
    }).as("doRegister");

    // 2. 在各个输入框中填入合法数据
    cy.get('input[placeholder="请输入用户名"]')
      .type("e2e_testuser");

    cy.get('input[placeholder="请输入密码"]')
      .type("Aa123456");

    cy.get('input[placeholder="请再次输入密码"]')
      .type("Aa123456");

    cy.get('input[placeholder="请输入邮箱"]')
      .type("e2e@example.com");

    // 3. 订阅 window:alert 事件，以断言 alert 弹窗内容
    cy.on("window:alert", (text) => {
      expect(text).to.equal("注册成功!");
    });

    // 4. 点击“注册”按钮
    //    <el-button @click="handleRegister">注册</el-button>  
    cy.get("button")
      .contains("注册")
      .click();

    // 5. 等待拦截的接口请求完成
    cy.wait("@doRegister");

    // 6. 注册成功后，组件里会执行：alert(...) + router.push({ name: 'Login' })
    //    假设 name: 'Login' 对应的 path 是 '/login'，所以判定 URL 包含 '/login'
    cy.url().should("include", "/login");
  });

  it("点击“返回登录”按钮，应跳转到登录页", () => {
    // 这个测试只验证点击返回登录的跳转逻辑
    cy.get("button")
      .contains("返回登录")
      .click();

    cy.url().should("include", "/login");
  });
});
