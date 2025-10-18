# metools-app-newspaper

一个用于在 metools 平台中预览《人民日报》当日报纸版面的 Vue3 插件。支持选择版面代码（01-08），并使用浏览器原生 PDF 预览当日对应版面的报纸。

## 免责声明
- 本项目仅用于技术学习与交流，不以任何商业目的为导向。
- 所有内容与数据来源于公开可访问网页，相关版权归原网站及版权所有者所有。
- 请遵守目标站点的服务条款、robots 协议及相关法律法规；勿进行高频、批量抓取、绕过访问限制或其他可能影响站点稳定性的行为。
- 本项目不对内容的准确性、完整性与时效性提供保证；因外部站点结构调整或网络环境变化造成的不可用或误解析，作者不承担任何责任。
- 使用本项目产生的任何风险与后果由使用者自行承担；如涉及版权或合规问题，请立即停止使用并删除相关内容。
- 如需正式接入或大规模使用，请联系相关网站获取授权或使用官方接口。

## 简介

本项目“metools-app-newspaper”旨在在 metools 工具（迷途工具箱）中提供“人民日报当日版面预览”的能力：
- 自动计算今日日期，构造人民日报数字报当日的版面页面。
- 解析页面中各版面的标题与链接，并生成可选择的版面列表。
- 通过浏览器原生 PDF 预览器展示对应版面的 PDF（保留浏览器默认的下载、打印等按钮）。
- 适配亮色与暗色主题（Naive UI + Tailwind 的 dark 变体）。

## 功能特性

- 当日日期自动计算（YYYYMM + DD）。
- 版面选择：使用 Naive UI 的 n-select，从当日解析到的版面自动生成选项（例如“第01版：要闻”）。
- PDF 预览：浏览器原生 `<object type="application/pdf">`，无需额外依赖。
- 主题适配：随系统/应用主题在亮色与暗色之间切换。

## 目录结构（关键文件）

- `src/components/PeopleDaily.vue`：页面组件，包含版面选择、加载/错误提示与 PDF 预览区。
- `src/utils/newspaper.ts`：工具方法，负责根据当日日期解析人民日报版面页面，提取页面信息与（当前选择版面）PDF 链接。
- `src/app.vue`：示例应用入口，挂载 PeopleDaily 组件，并保持主题管理逻辑。

## 使用说明

在你的页面中引入并使用 PeopleDaily 组件：

```vue
<script setup lang="ts">
import PeopleDaily from './components/PeopleDaily.vue'
</script>

<template>
  <PeopleDaily />
</template>
```

组件行为：
- 初次加载会自动拉取当日的版面列表与当前版面的 PDF。
- 切换版面代码（01-08）将重新请求对应版面页面并更新 PDF 预览。

## 工具方法说明

`src/utils/newspaper.ts` 提供：

```ts
export async function peopleDailyPages(codeInput: string | number = '01'): Promise<Array<{
  code: string
  title: string
  href: string
  url: string
  pdf?: string // 仅当前传入的 code 可能附带解析出的 PDF 链接
}>>
```

- 参数：`codeInput`（默认 `'01'`），表示要解析的当日版面节点，例如 `node_01.html`。
- 返回：包含当日解析到的版面列表（01-08），每项包含：
  - `code`：版面代码（两位数字字符串）
  - `title`：版面标题（例如“要闻”）
  - `href`：相对链接
  - `url`：绝对链接
  - `pdf?`：当解析的是当前 `codeInput` 对应页面且成功解析到 PDF 时，返回完整 PDF 链接

示例：

```ts
const pages = await peopleDailyPages('02')
// pages[?] 中 code==='02' 的项可能包含 pdf 字段
```

## 运行与构建

- 安装依赖：

```bash
npm install
```

- 开发运行：

```bash
npm run dev
```

- 构建生产：

```bash
npm run build
```

- 本地预览构建结果：

```bash
npm run preview
```

## 注意事项

- 本项目依赖 `window.$fetch`（在 metools 的 webview 环境中由预加载脚本提供）进行网络请求与 HTML 获取。如果在普通浏览器环境下直接运行，`window.$fetch` 不存在时会失败；请确保运行环境为 metools 或自行实现同等接口/代理。
- PDF 预览使用浏览器原生查看器，其工具栏（下载、打印等）由浏览器控制，前端页面无法隐藏。如果需要完全自定义、无工具栏的“纯预览”，可以考虑引入 PDF.js（或基于 PDF.js 的 Vue 组件），并配合后端代理/二进制数据获取以解决跨域问题。

## 捐赠与公众号

如果您觉得该项目还不错，可以扫一下二维码捐赠。
<div style="display: flex; justify-content: space-around; align-items: center; margin: 20px 0;">
    <div style="text-align: center;">
        <img src="捐赠.png" alt="捐赠二维码" style="width: 200px; height: 200px;">
        <p>扫码捐赠支持</p>
    </div>
    <div style="text-align: center;">
        <img src="%E5%85%AC%E4%BC%97%E5%8F%B7.jpg" alt="公众号二维码" style="width: 200px; height: 200px;">
        <p>扫码关注公众号</p>
    </div>
</div>