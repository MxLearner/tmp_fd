// cypress/e2e/movie-detail.cy.js

describe("Movie Detail 页面 E2E 测试", () => {
  const testUser = "testuser";
  const testPwd = "123456";

  beforeEach(() => {
    // —— 登录并跳转到首页（MovieList） —— //
  });

  it("点击第一部电影后，应跳转到 /movie/{id} 并正确渲染详情", () => {

    // —— 访问首页 —— //
    cy.visit("/login");
    cy.intercept('POST', '/api/login').as('loginReq');
    cy.intercept('GET', '/api/movies').as('moviesReq');
    cy.get('[data-test="username"]').type(testUser);
    cy.get('.el-form-item[data-test="password"] input').type(testPwd);
    cy.get('[data-test="login-button"]').click();
    cy.wait('@loginReq', { timeout: 10000 }) // 最多等10秒响应
    cy.wait('@moviesReq', { timeout: 100000 }) // 最多等10秒响应
    .its('response.statusCode')
    .should('eq', 200);
    cy.on("window:alert", (txt) => {
      expect(txt).to.equal("登录成功");
    });
    cy.url().should("include", "/");
    // —— 点击第一部电影卡片（id = "3"） —— //
    // 这里假设 .movie-card 是 MovieList 中每个 <el-card> 的类
    cy.intercept('POST', '/api/details').as('detailsReq');

    cy.get(".movie-card").first().click();

    cy.wait('@detailsReq', { timeout: 100000 }) // 最多等10秒响应
    // —— 断言已跳转到 /movie/3 —— //
    cy.url().should("match", /\/movie\/1/);

    // —— 验证电影海报和标题 —— //
    // cy.get(".movie-photo img")
    //   .should("have.attr", "src", "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp")
    //   .and("have.attr", "alt", "肖申克的救赎 The Shawshank Redemption");
    cy.get(".movie-details h2").should("contain.text", "肖申克的救赎 The Shawshank Redemption");

    // —— 验证导演、演员、上映日期、评分、语言、时长、电影编号 —— //
    cy.get(".movie-details").within(() => {
      cy.contains("导演: 弗兰克·德拉邦特").should("exist");
      cy.contains("演员: 蒂姆·罗宾斯 / 摩根·弗里曼 / 鲍勃·冈顿 / 威廉姆·赛德勒 / 克兰西·布朗 / 吉尔·贝罗斯 / 马克·罗斯顿 / 詹姆斯·惠特摩 / 杰弗里·德曼 / 拉里·布兰登伯格 / 尼尔·吉恩托利 / 布赖恩·利比 / 大卫·普罗瓦尔 / 约瑟夫·劳格诺 / 祖德·塞克利拉 / 保罗·麦克兰尼 / 芮妮·布莱恩 / 阿方索·弗里曼 / V·J·福斯特 / 弗兰克·梅德拉诺 / 马克·迈尔斯 / 尼尔·萨默斯 / 耐德·巴拉米 / 布赖恩·戴拉特 / 唐·麦克马纳斯").should("exist");
      cy.contains("上映日期: 1994-10-13T16:00:00.000+00:00").should("exist");
      cy.contains("评分: 9.7").should("exist");
      cy.contains("语言: 英语").should("exist");
      cy.contains("时长: 142分钟").should("exist");
      cy.contains("电影编号: 11").should("exist");
    });

    // —— 验证电影简介 —— //
    cy.get(".movie-description").should("contain.text", "电影简介: 　　一场谋杀案使银行家安迪（蒂姆•罗宾斯 Tim Robbins 饰）蒙冤入狱，谋杀妻子及其情人的指控将囚禁他终生。在肖申克监狱的首次现身就让监狱“大哥”瑞德（摩根•弗里曼 Morgan Freeman 饰）对他另眼相看。瑞德帮助他搞到一把石锤和一幅女明星海报，两人渐成患难 之交。很快，安迪在监狱里大显其才，担当监狱图书管理员，并利用自己的金融知识帮助监狱官避税，引起了典狱长的注意，被招致麾下帮助典狱长洗黑钱。偶然一次，他得知一名新入狱的小偷能够作证帮他洗脱谋杀罪。燃起一丝希望的安迪找到了典狱长，希望他能帮自己翻案。阴险伪善的狱长假装答应安迪，背后却派人杀死小偷，让他唯一能合法出狱的希望泯灭。沮丧的安迪并没有绝望，在一个电闪雷鸣的风雨夜，一场暗藏几十年的越狱计划让他自我救赎，重获自由！老朋友瑞德在他的鼓舞和帮助下，也勇敢地奔向自由。");

    // 第一条评论
    cy.get(".review-block").first().within(() => {
      cy.contains("用户: 5").should("exist");
      cy.get(".review-score").should("contain.text", "(5)");
    });

    // 第二条评论
    cy.get(".review-block").eq(1).within(() => {
      cy.contains("用户: 17").should("exist");
      cy.get(".review-score").should("contain.text", "(4)");
    });
  });
  
  it("可以进行写评论",()=>{
    cy.visit("/login");
    cy.intercept('POST', '/api/login').as('loginReq');
    cy.intercept('GET', '/api/movies').as('moviesReq');
    cy.get('[data-test="username"]').type(testUser);
    cy.get('.el-form-item[data-test="password"] input').type(testPwd);
    cy.get('[data-test="login-button"]').click();
    cy.wait('@loginReq', { timeout: 100000 }) // 最多等10秒响应
    cy.wait('@moviesReq', { timeout: 100000 }) // 最多等10秒响应
    cy.on("window:alert", (txt) => {
      expect(txt).to.equal("登录成功");
    });
    cy.url().should("include", "/");

    // —— 点击第一部电影卡片（id = "3"） —— //
    // 这里假设 .movie-card 是 MovieList 中每个 <el-card> 的类
    cy.get(".movie-card").first().click();

    // —— 断言已跳转到 /movie/3 —— //
    cy.url().should("match", /\/movie\/1/);
    cy.get('[data-test="writecomment-button"]').click();

    // —— 5. 在弹出的 Modal 中输入评论并提交 —— //
    const commentText = "这是一条自动化测试评论。";
    // 因为 newReview.score 是 v-model.number，我们先选一个星
    cy.get('label[for="star5"]').click();
    cy.get(".review-textarea").type(commentText);

    cy.intercept("POST", "/api/new_review", (req) => {
          // 验证请求体
          expect(req.body).to.have.property("userId", "36");
          expect(req.body).to.have.property("movie_id", "11");
          expect(req.body).to.have.property("text", commentText);
          expect(req.body).to.have.property("score", "5");

          req.reply({
            statusCode: 200,
            body: "插入成功",
          });
        }).as("postReview");

    cy.get(".review-submit").click();
    cy.wait("@postReview");

    // —— 6. Modal 应该关闭，且新评论出现在列表末尾 —— //
    cy.get(".modal-content").should("not.exist");
    cy.get(".review-block").last().within(() => {
      cy.contains(commentText);
    });
});
})