# 固件仓库（Firmware Repository）

本目录用于存放 socolode 各型号的固件文件（`.bin`），并配有一个 **固件清单** `manifest.json`。
`firmware-update.html` 页面启动时会从 GitHub 拉取这份清单，在下拉框列出所有型号；用户选中型号后，页面直接从 GitHub 下载对应固件并烧录到设备。

## 工作原理

- 固件文件（`.bin`）放在本目录，随仓库一起提交。
- `manifest.json` 描述每个型号的名称、版本、文件名、烧录参数等元数据。
- 页面通过 [jsDelivr CDN](https://www.jsdelivr.com/)（`https://cdn.jsdelivr.net/gh/socolode/tools@main/firmware/...`）拉取清单和固件，失败时自动回退到 `raw.githubusercontent.com`。

## 如何添加 / 更新一个固件

1. 把新的固件 `.bin` 文件放入本目录，例如 `light-paint-stick.bin`。
2. 在 `manifest.json` 的 `models` 数组中新增（或修改）一个条目，格式如下：

```json
{
  "id": "light-paint-stick",
  "name": { "en": "Light Paint Stick", "zh": "光绘棒" },
  "version": "v1.2.0",
  "file": "light-paint-stick.bin",
  "size": 1048576,
  "flashOffset": "0x0",
  "flashMode": "qio",
  "flashFreq": "80m",
  "flashSize": "8MB",
  "notes": { "en": "Release notes", "zh": "更新说明" }
}
```

3. 提交并推送到 GitHub 的 `main` 分支（触发 Cloudflare Pages 自动部署）。

> 说明：`manifest.json` 里的示例条目（`v0.0.0`）是指向一个不存在的占位文件，
> 请务必替换为你的真实固件文件，并把 `file`、`size`、`version`、`name`、`notes` 改成实际内容。

## 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 型号唯一标识（`a-z`、数字、`-`、`_`），用于下拉框 value |
| `name` | 是 | 型号名称，`en` / `zh` 两个语言版本 |
| `version` | 是 | 固件版本号，会显示在下拉框和详情中 |
| `file` | 是 | 本目录下的 `.bin` 文件名 |
| `size` | 推荐 | 文件字节数，用于显示下载大小（可留 `0`） |
| `flashOffset` | 否 | 烧录地址，默认 `0x0` |
| `flashMode` | 否 | SPI 模式，默认 `qio` |
| `flashFreq` | 否 | 时钟频率，默认 `80m` |
| `flashSize` | 否 | Flash 容量，默认 `8MB` |
| `notes` | 否 | 更新说明，`en` / `zh` 两个语言版本 |

## 注意事项

- 单个文件建议不超过 20MB（jsDelivr 单文件限制）。
- 仓库必须保持 `public`，页面才能匿名访问固件。
- 修改型号后记得更新 `version`，方便用户识别新版本。