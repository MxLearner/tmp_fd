describe("帖子列表系统测试", () => {

  it("进入帖子列表选择帖子并写评论", () => {
    cy.visit("/login");
    cy.get('[data-test="username"]').type("testuser");
    cy.get('.el-form-item[data-test="password"] input').type("123456");
    cy.on("window:alert", (txt) => {
      expect(txt).to.equal("登录成功");
    });
    cy.get('[data-test="login-button"]').click();
    cy.url().should("include", "/"); // 确认跳到首页
    cy.get('[data-test="forum-link"]').click(); // 点击论坛链接
    cy.url().should("include", "/forum"); // 确认跳转到论坛页面
    // ——（3）访问首页 —— //
   cy.get(".post-item").should("have.length.at.least", 1);
   cy.get(".post-item").first().click();
   cy.get('[data-test="writecomment-button"]').click();

  // ——（5）填写评论内容 —— //
  cy.get(".forum-review-textarea").type("这是一个测试评论");

  // ——（6）点击提交评论按钮 —— //
  cy.window().then((win) => {
    cy.stub(win, "alert").as("alert"); // 捕获 alert
  });

  cy.get('[data-test="submit-button"]').click();

  // ——（7）验证 alert 内容是否为“评论成功”或验证评论是否出现在页面上 —— //
  cy.get(".forum-comment-block").last().should("contain", "这是一个测试评论");
  });

  
});
