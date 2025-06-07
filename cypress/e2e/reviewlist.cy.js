describe("帖子列表系统测试", () => {

  beforeEach(() => {
    // 每个 it 先登录
    cy.visit("/login");
    cy.get('[data-test="username"]').type("testuser");
    cy.get('.el-form-item[data-test="password"] input').type("123456");
    cy.on("window:alert", (txt) => {
      expect(txt).to.equal("登录成功");
    });
    cy.get('[data-test="login-button"]').click();
    cy.url().should("include", "/"); // 确认跳到首页
  });

  it("加载帖子列表、搜索过滤，并点击第一条跳转到详情页", () => {

    cy.visit("/forum");
    // ——（3）访问首页 —— //
   cy.get(".post-item").should("have.length.at.least", 1);

    // 3. 验证第一条帖子的基本信息非空
    cy.get(".post-item").first().within(() => {
      cy.get("h3").invoke("text").should("not.be.empty");
      cy.contains("用户:").invoke("text").should("not.be.empty");
      cy.contains("发布日期:").invoke("text").should("not.be.empty");
    });

    // 4. 搜索过滤：在搜索框输入一个已知帖子的关键字（假设帖子标题包含 “测试”）
    cy.get(".search-input").type("测试");

    // 过滤后，至少有一条包含 “测试” 的帖子
    cy.get(".post-item").should("have.length.at.least", 1);
    cy.get(".post-item").first().within(() => {
      cy.get("h3").should("contain.text", "帖子标题");
      cy.get("p").eq(0).should("contain.text", "测试");
    });

    // 5. 清空搜索，列表恢复
    cy.get(".search-input").clear();
    cy.get(".post-item").should("have.length.at.least", 1);

    // 6. 点击第一条帖子，跳转到 CommunityForum，并验证 URL 参数
    cy.get(".post-item").first().click();

    // 7. 在 CommunityForum 页面验证帖子内容正确渲染
    cy.get(".forum-details h2").should("exist");
    cy.get(".forum-user-row p").first().should("contain.text", "用户:");
    cy.get(".forum-description").should("contain.text", "帖子内容:");

  });

  
});
