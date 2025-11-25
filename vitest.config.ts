import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],

    // 测试稳定性配置
    testTimeout: 10000,
    hookTimeout: 10000,
    retry: 1,

    // 并行测试配置
    maxConcurrency: 10,
    // Vitest 4 的并行配置简化
    // pool 和 poolOptions 在 Vitest 4 中已经默认优化
    fileParallelism: true,

    // 覆盖率配置 - 企业级门槛
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',

      // 全局覆盖率阈值 - 65%
      thresholds: {
        lines: 65,
        functions: 65,
        branches: 65,
        statements: 65,
      },

      // 排除文件
      exclude: [
        'node_modules/',
        '.next/',
        'dist/',
        'build/',
        'coverage/',
        'scripts/',
        'migrations/',
        '**/*.config.*',
        '**/*.setup.*',
        '**/types/**',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.spec.{ts,tsx,js,jsx}',
        'public/',
        '.github/',
      ],

      // 包含文件
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}',
        'repositories/**/*.{ts,tsx}',
      ],
    },

    // 报告输出
    outputFile: {
      json: './reports/test-results.json',
      html: './reports/test-results.html',
    },
  },

  // 全局变量定义 - 适配 React 19
  define: {
    'import.meta.vitest': 'undefined',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
