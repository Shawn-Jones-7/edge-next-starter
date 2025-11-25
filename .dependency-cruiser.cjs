/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ==================================================
    // 1. 禁止循环依赖
    // ==================================================
    {
      name: 'no-circular',
      severity: 'error',
      comment: '循环依赖会导致代码难以维护和测试。请重构代码以消除循环依赖。',
      from: {},
      to: {
        circular: true,
      },
    },

    // ==================================================
    // 2. 禁止孤立文件（未被任何文件导入）
    // ==================================================
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: '孤立文件（未被使用的文件）应该被删除或连接到代码库中。',
      from: {
        orphan: true,
        pathNot: [
          // 排除入口文件和配置文件
          '^(app|components|lib|services|repositories)/.*\\.(ts|tsx|js|jsx)$',
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$', // 配置文件
          '\\.config\\.(js|ts|mjs)$',
          '^middleware\\.ts$',
          '^next\\.config\\.(js|ts|mjs)$',
          '^next-env\\.d\\.ts$',
          'vitest\\.(config|setup)\\.(ts|js)',
          '^app/.*/(page|layout|loading|error|not-found|route)\\.(ts|tsx)$',
          '^app/api/.*',
          '__tests__/.*',
          '.*\\.(test|spec)\\.(ts|tsx|js|jsx)$',
        ],
      },
      to: {},
    },

    // ==================================================
    // 3. 禁止从生产代码导入 devDependencies
    // ==================================================
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: '生产代码不应该依赖 devDependencies。',
      from: {
        path: '^(app|components|lib|services|repositories)',
        pathNot: '\\.(test|spec)\\.(ts|tsx|js|jsx)$',
      },
      to: {
        dependencyTypes: ['npm-dev'],
        // Exceptions: @types (type definitions), @cloudflare/next-on-pages (runtime API for Cloudflare Pages)
        pathNot: [
          'node_modules/@types/',
          'node_modules/@testing-library',
          'node_modules/vitest',
          'node_modules/.*@cloudflare/next-on-pages',
        ],
      },
    },

    // ==================================================
    // 4. 禁止跨目录相对路径导入（强制使用 @/ 别名）
    // ==================================================
    {
      name: 'no-cross-directory-relative-imports',
      severity: 'error',
      comment: '禁止使用 ../ 跨目录导入。请使用 @/ 别名。',
      from: {
        pathNot: ['__tests__/.*', '.*\\.(test|spec)\\.(ts|tsx|js|jsx)$'],
      },
      to: {
        path: '^\\.\\./.*',
      },
    },

    // ==================================================
    // 5. Feature/Domain 隔离规则
    // ==================================================
    {
      name: 'feature-isolation',
      severity: 'warn',
      comment: 'Feature 模块之间不应该直接依赖，应该通过 lib 或 services 层交互。',
      from: {
        path: '^app/([^/]+)/.*',
      },
      to: {
        path: '^app/(?!\\1)[^/]+/(?!api).*',
        pathNot: [
          '^app/[^/]+/(page|layout|loading|error|not-found)\\.(ts|tsx)$',
          // 允许导入共享的 Server Actions（app/actions/ 目录）
          '^app/actions/.*',
        ],
      },
    },

    // ==================================================
    // 6. 禁止业务代码直接访问数据库（应通过 repositories）
    // ==================================================
    {
      name: 'no-direct-database-access',
      severity: 'error',
      comment: '业务代码应该通过 repositories 层访问数据库，不应该直接使用 Prisma Client。',
      from: {
        path: '^(app|components|services)/.*',
      },
      to: {
        path: '^node_modules/@prisma/client',
      },
    },

    // ==================================================
    // 7. 分层架构规则
    // ==================================================
    // Components 不应该导入 Services
    {
      name: 'components-no-services',
      severity: 'warn',
      comment: 'Components 应该保持纯粹，不应该直接调用 services。',
      from: {
        path: '^components/.*',
      },
      to: {
        path: '^services/.*',
      },
    },

    // Services 不应该导入 App 或 Components
    {
      name: 'services-no-ui',
      severity: 'error',
      comment: 'Services 不应该依赖 UI 层（app/components）。',
      from: {
        path: '^services/.*',
      },
      to: {
        path: '^(app|components)/.*',
      },
    },

    // Repositories 不应该导入 Services, App 或 Components
    {
      name: 'repositories-isolation',
      severity: 'error',
      comment: 'Repositories 应该保持独立，只处理数据访问逻辑。',
      from: {
        path: '^repositories/.*',
      },
      to: {
        path: '^(app|components|services)/.*',
      },
    },
  ],

  options: {
    // 排除的路径
    doNotFollow: {
      path: [
        'node_modules',
        '.next',
        'dist',
        'build',
        'coverage',
        '__tests__',
        '.*\\.(test|spec)\\.(ts|tsx|js|jsx)$',
      ],
    },

    // 包含的扩展名
    includeOnly: {
      path: '\\.(ts|tsx|js|jsx|mjs|cjs)$',
    },

    // TypeScript 配置
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json',
    },

    // Webpack/Next.js 配置
    webpackConfig: {
      fileName: './next.config.ts',
    },

    // 增强解析
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
    },

    // 报告选项
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      archi: {
        collapsePattern: '^(app|components|lib|services|repositories|types)/[^/]+',
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
