# monorepo-admin
一个基于 Monorepo 和 React 18 的多项目管理库

## 项目概述

`monorepo-admin` 是一个用于管理 Monorepo 中多个项目的前端库，基于 React 18 开发，使用 pnpm workspaces 进行 Monorepo 管理。

### 核心功能

- 📦 支持管理多个应用和包项目
- 🔍 项目搜索和筛选
- 📊 项目依赖和脚本展示
- 🎨 响应式设计，支持移动端
- 🚀 基于 React 18 的现代前端架构

## 项目结构

```
monorepo-admin/
├── packages/            # 包目录
│   └── monorepo-manager  # 核心管理库
├── apps/                # 应用目录
│   └── demo-app          # 示例应用
├── pnpm-workspace.yaml  # pnpm workspaces 配置
└── package.json         # 根项目配置
```

## 快速开始

### 安装依赖

```bash
# 安装所有依赖
pnpm install
```

### 开发

```bash
# 启动示例应用
pnpm --filter demo-app dev

# 开发核心库（watch 模式）
pnpm --filter @monorepo/manager dev
```

### 构建

```bash
# 构建核心库
pnpm --filter @monorepo/manager build

# 构建示例应用
pnpm --filter demo-app build
```

### 测试

```bash
# 运行核心库测试
pnpm --filter @monorepo/manager test
```

## 使用方法

### 1. 安装核心库

```bash
pnpm add @monorepo/manager
```

### 2. 在应用中使用

```tsx
import React from 'react';
import { ProjectList } from '@monorepo/manager';

function App() {
  return (
    <div>
      <h1>Monorepo 项目管理</h1>
      <ProjectList type="all" />
    </div>
  );
}

export default App;
```

### 3. 配置项目管理器

```tsx
import { createProjectManager } from '@monorepo/manager';

// 创建自定义配置的项目管理器
const manager = createProjectManager({
  rootDir: '/path/to/monorepo',
  packagesDir: 'packages',
  appsDir: 'apps',
});

// 加载所有项目
const projects = await manager.loadProjects();
```

## 核心 API

### ProjectManager 类

- `loadProjects()`: 加载所有项目
- `getProjectById(id)`: 根据 ID 获取项目
- `getProjectsByType(type)`: 根据类型获取项目
- `searchProjects(query)`: 搜索项目

### 组件

- `ProjectList`: 项目列表组件
- `ProjectCard`: 单个项目卡片组件

## 技术栈

- **Monorepo 管理**: pnpm workspaces
- **前端框架**: React 18
- **构建工具**: Vite, Rollup
- **语言**: TypeScript
- **测试**: Jest

## 贡献指南

1. Fork 本仓库
2. 创建功能分支
3. 提交代码
4. 运行测试
5. 提交 Pull Request

## 许可证

ISC
