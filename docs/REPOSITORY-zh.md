# Repository 模式指南

## 概述

本项目使用 **Repository 模式** 分离数据访问与业务逻辑层，提升可维护性与可测试性。Repository 位于项目根目录，作为领域层组件。

## 架构分层

```
API 路由 (app/api/*)
    ↓ 业务逻辑 + 验证
Repository 层 (repositories/*)
    ↓ 数据库操作 + 异常处理
Database Client (lib/db/client.ts)
    ↓
D1 Database
```

### 职责划分

| 层级       | 职责                                                | 不应该做                         |
| ---------- | --------------------------------------------------- | -------------------------------- |
| API 路由   | 解析请求、业务逻辑、参数校验、缓存管理、统一响应    | 直接写 SQL、管理数据库连接       |
| Repository | 数据库 CRUD、构建查询、数据库异常处理、简单数据映射 | 业务校验、复杂业务逻辑、缓存处理 |

## 目录结构

```
repositories/
├── index.ts                 # Repository 工厂与导出
└── lead.repository.ts       # 询盘/线索数据操作

lib/db/
└── client.ts                # 数据库客户端
```

## Repository 示例

### 创建 Repository

```typescript
// repositories/lead.repository.ts
import { DatabaseQueryError } from '@/lib/errors';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: number;
}

export class LeadRepository {
  constructor(private db: D1Database) {}

  /**
   * 创建新询盘
   */
  async create(data: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    try {
      const now = Date.now();
      const result = await this.db
        .prepare(
          `INSERT INTO leads (name, email, phone, company, subject, message, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.name,
          data.email,
          data.phone || null,
          data.company || null,
          data.subject || null,
          data.message,
          data.status || 'new',
          now
        )
        .run();

      return { ...data, id: result.meta.last_row_id, createdAt: now } as Lead;
    } catch (error) {
      throw new DatabaseQueryError('Failed to create lead', error);
    }
  }

  /**
   * 根据邮箱检查是否存在
   */
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.db
        .prepare('SELECT COUNT(*) as count FROM leads WHERE email = ?')
        .bind(email)
        .first<{ count: number }>();
      return (result?.count || 0) > 0;
    } catch (error) {
      throw new DatabaseQueryError('Failed to check email existence', error);
    }
  }
}
```

### 在 API 路由中使用

```typescript
// app/api/contact/route.ts
import { ValidationError } from '@/lib/errors';
import { LeadRepository } from '@/repositories/lead.repository';

export async function POST(request: NextRequest) {
  // 1) 解析请求
  const { name, email, message } = await request.json();

  // 2) 业务验证
  if (!email) throw new ValidationError('Email is required');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new ValidationError('Invalid email format');

  // 3) 获取数据库连接
  const db = getCloudflareContext().env.DB;
  const leadRepo = new LeadRepository(db);

  // 4) 通过 Repository 进行数据库操作
  const lead = await leadRepo.create({ name, email, message, status: 'new' });

  return Response.json({ success: true, data: lead });
}
```

## 方法命名规范

### 查询方法

```typescript
findById(id: number)
findByEmail(email: string)
findAll(options?)
findByStatus(status: string)
exists(id: number): Promise<boolean>
existsByEmail(email: string): Promise<boolean>
count(options?): Promise<number>
```

### 修改方法

```typescript
create(data: CreateData)
update(id: number, data: UpdateData)
delete(id: number)
updateStatus(id: number, status: string)
```

## 异常处理规范

### Repository 层

仅抛出数据库相关异常，并转换为应用异常：

```typescript
async findById(id: number) {
  try {
    return await this.db
      .prepare('SELECT * FROM leads WHERE id = ?')
      .bind(id)
      .first<Lead>();
  } catch (error) {
    throw new DatabaseQueryError(`Failed to fetch lead with id ${id}`, error);
  }
}
```

### API 路由层

处理业务逻辑异常：

```typescript
if (!email) throw new ValidationError('Email is required');
if (!lead) throw new ResourceNotFoundError('Lead');
```

## 测试

Repository 模式便于测试：

```typescript
const mockLeadRepo = {
  findById: vi.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  create: vi.fn(),
};
```

## 最佳实践

### ✅ 推荐

1. 单一职责：每个 Repository 只管理一个实体
2. 统一异常：数据库异常转换为应用异常
3. 类型安全：充分利用 TypeScript 类型
4. 注释清晰：方法文档完整
5. 返回完整对象：需要时包含关系

### ❌ 避免

1. 业务逻辑：不在 Repository 中验证
2. 外部依赖：不调用外部服务或 API
3. 复杂计算：不进行复杂计算
4. 缓存管理：不在此层处理

```typescript
// ❌ Bad
async create(data) {
  // ❌ 不要在此层进行验证
  if (!this.isValidEmail(data.email)) {
    throw new ValidationError();
  }

  // ❌ 不要在此层调用外部服务
  await this.sendNotificationEmail(data.email);

  // ❌ 不要在此层管理缓存
  await this.cache.delete('leads');

  return await this.db.prepare(...).run();
}
```

## 扩展 Repository

新增一个 Repository：

```typescript
// 3. 使用
import { ProductRepository } from '@/repositories';

// 1. 新增 Repository 类
// repositories/product.repository.ts
export class ProductRepository {
  constructor(private db: D1Database) {}

  async findAll() {
    try {
      const result = await this.db.prepare('SELECT * FROM products').all();
      return result.results;
    } catch (error) {
      throw new DatabaseQueryError('Failed to fetch products', error);
    }
  }
}

// 2. 导出
// repositories/index.ts
export { ProductRepository } from './product.repository';

const productRepo = new ProductRepository(db);
const products = await productRepo.findAll();
```

## 总结

核心原则：

1. 📦 封装数据访问：所有数据库操作经由 Repository
2. 🎯 单一职责：Repository 只负责数据
3. �� 无业务逻辑：业务规则在 API 层处理
4. ⚠️ 统一异常：数据库错误转换为应用异常
5. 🧪 易于测试：可轻松 mock 与单测

遵循以上原则，代码清晰、易维护。
