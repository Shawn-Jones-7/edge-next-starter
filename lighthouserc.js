/**
 * Lighthouse CI 配置
 * 用于性能和质量监控
 *
 * 文档: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

module.exports = {
  ci: {
    collect: {
      // 构建产物目录（Next.js）
      staticDistDir: './.next',

      // 要测试的 URL 列表
      url: [
        'http://localhost:3000',
        'http://localhost:3000/api/health', // 健康检查端点
      ],

      // 收集次数（取中位数）
      numberOfRuns: 3,

      // 配置选项
      settings: {
        // 模拟移动设备
        preset: 'desktop',
        // 禁用存储清理（加快速度）
        disableStorageReset: true,
        // Chrome 启动参数
        chromeFlags: '--no-sandbox --disable-gpu',
      },
    },

    assert: {
      // ==================================================
      // 性能预算和质量门槛
      // ==================================================
      assertions: {
        // -------------------- Core Web Vitals --------------------
        // Largest Contentful Paint (最大内容绘制)
        'largest-contentful-paint': ['error', { maxNumericValue: 5200 }],

        // First Contentful Paint (首次内容绘制)
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],

        // Cumulative Layout Shift (累积布局偏移)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],

        // Total Blocking Time (总阻塞时间)
        'total-blocking-time': ['warn', { maxNumericValue: 800 }],

        // Speed Index (速度指数)
        'speed-index': ['warn', { maxNumericValue: 4000 }],

        // -------------------- 性能得分 --------------------
        'categories:performance': ['warn', { minScore: 0.68 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // -------------------- 资源大小预算 --------------------
        // 总字节大小（含 HTML/CSS/JS/图片等）
        'total-byte-weight': ['error', { maxNumericValue: 524288 }], // 512KB

        // 未使用的 JavaScript
        'unused-javascript': ['warn', { maxNumericValue: 153600 }], // 150KB

        // 未使用的 CSS
        'unused-css-rules': ['warn', { maxNumericValue: 51200 }], // 50KB

        // 启动时间（JS 解析和编译）
        'bootup-time': ['warn', { maxNumericValue: 4000 }],

        // -------------------- 最佳实践 --------------------
        // 使用 HTTPS
        'is-on-https': 'error',

        // 使用 HTTP/2
        'uses-http2': 'warn',

        // 避免巨大的网络负载
        'uses-rel-preconnect': 'off',

        // 图片优化
        'uses-optimized-images': 'warn',
        'modern-image-formats': 'warn',
        'uses-responsive-images': 'warn',

        // 文本压缩
        'uses-text-compression': 'error',

        // -------------------- 可访问性 --------------------
        'color-contrast': 'error',
        'image-alt': 'error',
        label: 'error',
        'aria-*': 'error',

        // -------------------- SEO --------------------
        'meta-description': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'link-text': 'warn',
        'crawlable-anchors': 'warn',

        // -------------------- PWA --------------------
        viewport: 'error',
        'themed-omnibox': 'off',
        'maskable-icon': 'off',
        'installable-manifest': 'off',

        // -------------------- 安全 --------------------
        'csp-xss': 'warn',
        'no-vulnerable-libraries': 'error',
      },
    },

    upload: {
      // 可选：上传到 Lighthouse CI Server
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN,

      // 或者上传到临时公共存储
      target: 'temporary-public-storage',
    },

    server: {
      // 本地服务器配置（用于开发）
      // 如果已经有运行的服务器，可以跳过此配置
    },
  },
};
