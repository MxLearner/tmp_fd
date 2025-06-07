// cypress/e2e/movie-list-pagination.cy.js

describe("MovieList 分页系统测试（共 30 条，每页 8 条）", () => {

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

  it("拦截后端返回 30 条假电影，验证每页数量与最后一页剩余数量", () => {

    // ——（3）访问首页 —— //
    cy.visit("/");

    // ——（4）验证第一页正好 8 条 —— //
    cy.get(".movie-card").should("have.length", 8);
    cy.get(".movie-card .movie-title-container")
      .first()
      .should("contain.text", "肖申克的救赎 The Shawshank Redemption");

    // ——（5）点击分页第 2 页，验证仍是 8 条 —— //
    cy.get(".pagination li").contains("2").click();
    // 有时路由用 query 参数表示 page，你可以根据实际改为：
    // cy.url().should("include", "page=2") 或 cy.url().should("match", /page=2/);
    cy.get(".movie-card").should("have.length", 8);
    // 在第 2 页，根据目前“评分降序”的默认排序，第 2 页第 1 条是 Movie 9
    cy.get(".movie-card .movie-title-container")
      .first()
      .should("contain.text", "这个杀手不太冷 Léon");

    // ——（6）点击第 3 页，验证 8 条 —— //
    cy.get(".pagination li").contains("3").click();
    cy.get(".movie-card").should("have.length", 8);

    // ——（7）点击第 4 页，验证只剩 30 - 8*3 = 6 条 —— //
    cy.get(".pagination li").contains("4").click();
    cy.get(".movie-card").should("have.length", 6);
  });
});
