// merge-report.cjs
const { merge } = require('mochawesome-merge');
const fs = require('fs');

(async () => {
  const report = await merge({
    files: ['cypress/reports/mochawesome*.json'],
  });

  fs.writeFileSync(
    'cypress/reports/output.json',
    JSON.stringify(report, null, 2),
    'utf8'
  );

  console.log('✅ 合并成功：cypress/reports/output.json');
})();
