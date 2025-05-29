# 时光纪念册 - 部署指南

## 构建生产版本

1. 安装依赖：
```bash
pnpm install
```

2. 构建生产版本：
```bash
pnpm build
```
构建完成后，静态文件会生成在 `dist/static` 目录中

## 部署选项

### 1. Vercel 部署 (推荐)
- 访问 [Vercel](https://vercel.com/)
- 注册/登录账号
- 点击 "New Project" → "Import Git Repository"
- 选择您的项目仓库
- 在配置中保留默认设置
- 点击 "Deploy" 按钮

### 2. Netlify 部署
- 访问 [Netlify](https://www.netlify.com/)
- 注册/登录账号
- 拖拽 `dist/static` 文件夹到部署区域
- 或连接Git仓库自动部署

### 3. 传统服务器部署
1. 将 `dist/static` 文件夹上传到您的服务器
2. 配置Nginx/Apache指向该目录
3. 添加SPA回退规则（确保路由正常工作）

## 注意事项

- 所有数据存储在浏览器本地存储中，不同设备/浏览器间不会同步
- 如需数据持久化，建议添加后端服务
- 部署后访问地址取决于您的托管服务

## 开发
启动开发服务器：
```bash
pnpm dev
```
访问 http://localhost:3000
