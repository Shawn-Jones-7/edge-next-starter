/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type 枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档变更
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'ci', // CI 配置文件和脚本的变动
        'build', // 影响构建系统或外部依赖的变动
        'revert', // 回滚 commit
        'wip', // 开发中
        'workflow', // 工作流改进
        'types', // 类型定义文件变更
        'release', // 发布新版本
      ],
    ],

    // Subject 规则
    'subject-empty': [2, 'never'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

    // Type 规则
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],

    // Scope 规则（可选但推荐）
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0, 'never'], // scope 可以为空

    // Header 规则
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 10],

    // Body 规则
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],

    // Footer 规则
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },

  // 自定义提示信息
  prompt: {
    messages: {
      type: '选择你要提交的类型：',
      scope: '选择一个 scope（可选）：',
      customScope: '请输入自定义的 scope：',
      subject: '填写简短精炼的变更描述：\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
      breaking: '列举非兼容性重大的变更（可选）：\n',
      footer: '列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n',
      confirmCommit: '确认提交？',
    },
    types: [
      { value: 'feat', name: 'feat:     新功能' },
      { value: 'fix', name: 'fix:      修复 bug' },
      { value: 'docs', name: 'docs:     文档变更' },
      { value: 'style', name: 'style:    代码格式（不影响功能）' },
      { value: 'refactor', name: 'refactor: 代码重构' },
      { value: 'perf', name: 'perf:     性能优化' },
      { value: 'test', name: 'test:     添加测试' },
      { value: 'build', name: 'build:    构建系统或依赖变更' },
      { value: 'ci', name: 'ci:       CI 配置文件和脚本变动' },
      { value: 'chore', name: 'chore:    其他修改（不修改src或测试文件）' },
      { value: 'revert', name: 'revert:   回滚 commit' },
    ],
  },
};
