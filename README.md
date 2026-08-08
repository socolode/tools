# socolode 工具集

socolode 光绘棒官方工具入口页面，包含两个工具：

- **制作光绘素材图片** — `light-painting-material-generator.html`：将图片转换为光绘棒专用素材
- **更新固件** — `firmware-update.html`：浏览器直连光绘棒升级固件

## 项目结构

```
socolode-tool/
├── index.html                        # 品牌入口页（两个工具按钮）
├── light-painting-material-generator.html   # 光绘素材图片转换工具
├── firmware-update.html              # 固件更新工具（从 GitHub 拉取固件清单与固件）
├── firmware/
│   ├── manifest.json                 # 固件清单（型号 / 版本 / 文件名 / 烧录参数）
│   └── README.md                     # 如何添加固件的说明
└── README.md
```

### 固件管理

固件 `.bin` 文件与清单 `manifest.json` 存放在 `firmware/` 目录，随仓库一起提交到 GitHub `main` 分支。
`firmware-update.html` 页面启动时从 GitHub（优先 jsDelivr CDN，回退 raw.githubusercontent）拉取清单，在下拉框列出所有型号；
用户选中型号后，页面直接从 GitHub 下载对应固件并烧录。添加或更新固件的方法见 [`firmware/README.md`](firmware/README.md)。

## 本地预览

直接用浏览器打开 `index.html`，或启动一个静态服务器：

```bash
npx serve .
```

## 部署到 Cloudflare Pages

本仓库为纯静态站点，无需构建。

### 方式一：Dashboard（推荐，无需命令行）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. 点击 **创建** → **Pages** → **连接到 Git**（或 **直接上传** 整个文件夹）
3. 框架预设选择 **None**，构建命令留空，**构建输出目录** 填 `.`
4. 部署完成后即可通过 `https://<你的项目名>.pages.dev` 访问

### 方式二：Wrangler CLI

```bash
# 安装
npm install -g wrangler

# 登录
wrangler login

# 部署当前目录
wrangler pages deploy . --project-name socolode-tools
```

部署后命令行会输出 `*.pages.dev` 访问地址。

## 注意事项

- 两个工具页依赖 CDN（Tailwind / JSZip / Font Awesome），部署时确保网络可访问这些 CDN。
- 若需要自定义域名，在 Pages 项目设置中绑定即可。