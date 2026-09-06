# 美序名片

纯前端安卓名片设计 APP：38+ 精选模板、可视化编辑（替换文字 / 底图 / 二维码）、正反双面设计、撤销重做、自动草稿，支持 4K 高清 PNG/JPG 与 300DPI 印刷级 PDF（含 3mm 出血与裁切线）本地导出。所有数据仅保存在设备本地，无服务器、无上传。

技术栈：React 19 + TypeScript + Vite 6 + Tailwind CSS 4，通过 Capacitor 8 打包为 Android 应用。

## 本地开发

1. 安装依赖：

   ```bash
   npm install
   ```

2. 启动开发服务器（http://localhost:3000）：

   ```bash
   npm run dev
   ```

## 构建与打包

```bash
npm run build      # Web 构建（输出到 dist/）
npm run cap:sync   # 同步到 Android 工程
npm run cap:open   # 用 Android Studio 打开工程
npm run cap:build  # 构建 + 同步一步完成
```
