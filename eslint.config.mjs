// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedEffectPlugin from 'eslint-plugin-react-you-might-not-need-an-effect';
import securityPlugin from 'eslint-plugin-security';
import securityNodePlugin from 'eslint-plugin-security-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FlatCompat 用于兼容旧式 ESLint 配置（如 eslint-config-next）
// 这是 ESLint 9 推荐的方式来使用旧式配置
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // ==================================================
  // 1. 忽略文件
  // ==================================================
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.vercel/**',
      '**/out/**',
      '**/*.config.js',
      'public/**',
      'migrations/**',
      'next-env.d.ts',
    ],
  },

  // ==================================================
  // 2. 基础配置
  // ==================================================
  js.configs.recommended,

  // ==================================================
  // 3. Next.js 配置（使用 FlatCompat 兼容）
  // 这解决了 @rushstack/eslint-patch 的兼容性问题
  // ==================================================
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),

  // ==================================================
  // 4. React 相关规则
  // ==================================================
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-you-might-not-need-an-effect': reactYouMightNotNeedEffectPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React 核心规则
      'react/jsx-uses-react': 'off', // React 19 不需要
      'react/react-in-jsx-scope': 'off', // React 19 不需要
      'react/prop-types': 'off', // 使用 TypeScript
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-unescaped-entities': 'error',

      // React Hooks 规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 约束 useEffect 滥用
      'react-you-might-not-need-an-effect/no-empty-effect': 'error',
      'react-you-might-not-need-an-effect/no-adjust-state-on-prop-change': 'error',
      'react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change': 'error',
      'react-you-might-not-need-an-effect/no-event-handler': 'error',
      'react-you-might-not-need-an-effect/no-pass-live-state-to-parent': 'error',
      'react-you-might-not-need-an-effect/no-pass-data-to-parent': 'error',
      'react-you-might-not-need-an-effect/no-manage-parent': 'error',
      'react-you-might-not-need-an-effect/no-pass-ref-to-parent': 'error',
      'react-you-might-not-need-an-effect/no-initialize-state': 'error',
      'react-you-might-not-need-an-effect/no-chain-state-updates': 'error',
      'react-you-might-not-need-an-effect/no-derived-state': 'error',
    },
  },

  // ==================================================
  // 5. Import 规则和路径解析
  // ==================================================
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/named': 'warn', // 降级为 warn：在 ESLint 9 中 TypeScript resolver 可能有误报
      'import/default': 'error',
      'import/no-duplicates': 'error',
      'import/no-cycle': ['error', { maxDepth: 3 }],
      'import/no-self-import': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'warn',
      'import/no-mutable-exports': 'error',
    },
  },

  // ==================================================
  // 6. 安全规则 - eslint-plugin-security
  // ==================================================
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      security: securityPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
      'security/detect-object-injection': 'warn', // 降级为 warn，避免误报
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-eval-with-expression': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'warn',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },

  // ==================================================
  // 7. Node.js 安全规则 - eslint-plugin-security-node
  // ==================================================
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'security-node': securityNodePlugin,
    },
    rules: {
      'security-node/detect-insecure-randomness': 'error',
      'security-node/detect-crlf': 'off', // 禁用：该规则在某些代码上会崩溃 (ESLint 9 兼容性问题)
      'security-node/detect-unhandled-async-errors': 'error',
      'security-node/detect-nosql-injection': 'error',
      'security-node/detect-security-missconfiguration-cookie': 'error',
    },
  },

  // ==================================================
  // 8. 超严格代码质量规则 - 业务代码
  // ==================================================
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '__tests__/**',
      'scripts/**',
      '*.config.{js,ts,mjs}',
    ],
    rules: {
      // 复杂度限制
      complexity: ['error', 15],
      'max-depth': ['error', 3],
      'max-lines': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: 120, skipBlankLines: true, skipComments: true },
      ],
      'max-params': ['error', 3],
      'max-nested-callbacks': ['error', 2],
      'max-statements': ['error', 20],
      'max-statements-per-line': ['error', { max: 1 }],

      // 代码风格和可读性
      'no-magic-numbers': [
        'warn',
        {
          ignore: [
            // 基础数值
            0, 1, -1, 2, 3, 4, 5, 8, 10, 16, 30, 60, 100, 1000,
            // HTTP 状态码
            200, 201, 204, 400, 401, 403, 404, 409, 429, 500, 502, 503,
            // 文件大小常用倍数
            1024,
          ],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          enforceConst: true,
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',

      // 最佳实践
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },

  // ==================================================
  // 8.1 API 路由和 Middleware - 放宽语句限制
  // API 路由需要处理验证、业务逻辑、缓存、响应等多个步骤
  // ==================================================
  {
    files: ['app/api/**/*.{ts,tsx}', 'middleware.ts'],
    rules: {
      'max-statements': ['error', 30],
      'max-nested-callbacks': ['error', 3],
    },
  },

  // ==================================================
  // 8.2 页面组件 - 放宽行数和语句限制
  // 页面组件包含大量 JSX 模板代码，需要更宽松的限制
  // ==================================================
  {
    files: ['app/**/page.tsx', 'app/**/layout.tsx'],
    rules: {
      'max-lines-per-function': [
        'warn',
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      'max-statements': ['warn', 35],
    },
  },

  // ==================================================
  // 8.3 核心库文件 - 放宽限制
  // 这些是复杂的基础设施代码，需要更宽松的限制
  // ==================================================
  {
    files: [
      'lib/auth/adapter.ts',
      'lib/auth/password.ts',
      'lib/api/middleware.ts',
      'lib/api/rate-limit.ts',
      'lib/rate-limiter/index.ts',
    ],
    rules: {
      'max-lines-per-function': [
        'warn',
        { max: 250, skipBlankLines: true, skipComments: true },
      ],
      'max-statements': ['warn', 35],
    },
  },

  // ==================================================
  // 8.4 HTTP Client - 禁用 axios 类型导入误报
  // ==================================================
  {
    files: ['lib/http/client.ts'],
    rules: {
      // TypeScript 已处理类型检查，ESLint import/named 对 axios 有误报
      'import/named': 'off',
    },
  },

  // ==================================================
  // 8.5 Logger - 允许 console 使用
  // Logger 是唯一允许使用 console 的模块
  // ==================================================
  {
    files: ['lib/logger/index.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // ==================================================
  // 8.6 环境检测和配置文件 - 放宽安全规则
  // 这些文件中的动态属性访问是安全且必要的
  // ==================================================
  {
    files: [
      'lib/config/env.ts',
      'lib/analytics/index.ts',
      'lib/errors/index.ts',
      'lib/auth/password.ts',
      'lib/logger/index.ts',
    ],
    rules: {
      'security/detect-object-injection': 'off',
    },
  },

  // ==================================================
  // 8.7 配置、环境和分析模块 - 允许 console 用于日志
  // ==================================================
  {
    files: ['lib/config/env.ts', 'lib/analytics/index.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // ==================================================
  // 8.8 核心基础设施 - 放宽 magic numbers 规则
  // 这些文件包含合理的配置常量
  // ==================================================
  {
    files: [
      'lib/analytics/index.ts',
      'lib/api/middleware.ts',
      'lib/api/rate-limit.ts',
      'lib/auth/config.ts',
      'lib/auth/password.ts',
      'lib/config/env.ts',
      'lib/utils/client-identifier.ts',
    ],
    rules: {
      'no-magic-numbers': 'off',
    },
  },

  // ==================================================
  // 9. 测试文件 - 放宽限制
  // ==================================================
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '__tests__/**',
    ],
    rules: {
      complexity: ['warn', 20],
      'max-lines-per-function': [
        'warn',
        { max: 700, skipBlankLines: true, skipComments: true },
      ],
      'max-lines': ['warn', { max: 800, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', 8],
      'max-nested-callbacks': ['warn', 6],
      'max-depth': ['warn', 5],
      'no-magic-numbers': 'off',
      'no-console': 'off',
      'react/display-name': 'off',
      // 测试文件中使用 any 类型是可接受的（用于 mock 对象等）
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // ==================================================
  // 10. 配置文件和脚本 - 放宽限制
  // ==================================================
  {
    files: ['scripts/**/*.{js,ts}', '*.config.{js,ts,mjs}', 'vitest.setup.ts'],
    rules: {
      complexity: ['warn', 18],
      'max-lines': ['warn', { max: 800, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: 250, skipBlankLines: true, skipComments: true },
      ],
      'no-magic-numbers': 'off',
      'no-console': 'off',
      // 脚本中 catch 块的 error 变量可能不需要使用
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // 脚本中的动态属性访问是安全的
      'security/detect-object-injection': 'off',
    },
  },

  // ==================================================
  // 11. 架构规则 - 强制使用别名
  // ==================================================
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      // 禁止跨目录相对导入，强制使用 @/ 别名
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: '禁止使用相对路径 ../。请使用 @/ 别名导入。',
            },
          ],
        },
      ],
    },
  },

  // ==================================================
  // 12. Prettier 兼容 - 使用 FlatCompat
  // ==================================================
  ...compat.extends('prettier'),
];

export default eslintConfig;
