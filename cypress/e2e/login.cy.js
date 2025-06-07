// cypress/e2e/login.cy.js

describe("UserLogin E2E 测试", () => {
  // 在运行测试前确保本地 Vue 应用已经通过 `pnpm dev` 或 `npm run serve` 等命令启动，
  // 并且 cypress.config.js 里的 baseUrl 已经指向正确端口（比如 http://60.204.222.125:8080）

  it("当用户名或密码为空时，应显示“用户名和密码不能为空”", () => {
    // 访问 /login 路由
    cy.visit("/login");

    // 不输入用户名和密码，直接点击登录
    cy.get('[data-test="login-button"]').click();

    // 断言：页面下方的 <p data-test="message"> 要显示 “用户名和密码不能为空”
    cy.get('[data-test="message"]').should("have.text", "用户名和密码不能为空");
  });

  it("输入正确的用户名和密码后，应调用接口并跳转到主页", () => {
    // 1. 可以在这里先拦截 `/login` 接口返回的响应（如果你想模拟后端不实际依赖后端服务器）
    //    假设接口返回结构 { message: "登录成功!", userId: 123, email: "abc@xx.com" }
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: {
        message: "登录成功!",
        userId: 123,
        email: "test@example.com"
      }
    }).as("loginReq");

    // 2. 访问登录页
    cy.visit("/login");

    // 3. 向用户名输入框（data-test="username"）输入
    cy.get('[data-test="username"]')
      .should("exist")
      .type("testuser");

    // 4. 向密码输入框（prop="password" 的 <el-input>）输入
    //    注意你在 <el-form-item> 上写了 data-test="password"，但在 input 里并没有写，
    //    因此这里直接选 `<input[type="password"]` 或者用与之最近的父级 `.el-form-item[data-test="password"] input`
    cy.get('.el-form-item[data-test="password"] input[type="password"]')
      .should("exist")
      .type("123456");

    // 5. 点击“登录”按钮
    cy.get('[data-test="login-button"]').click();

    cy.url().should("match", /\/$/);
  });

  it("点击“注册”按钮，应跳转到 Register 路由", () => {
    cy.visit("/login");
    cy.get('[data-test="register-button"]').click();

    // 假设你在 router 里把 name: "Register" 对应 path: "/register"
    cy.url().should("include", "/register");
  });
});
