# Bilibili 增强进度条

[![Install from Greasy Fork](https://img.shields.io/badge/Install-Greasy%20Fork-670000?logo=tampermonkey&logoColor=white)](https://greasyfork.org/scripts/585382)
[![Greasy Fork Script](https://img.shields.io/badge/Greasy%20Fork-script-670000)](https://greasyfork.org/scripts/585382)
[![License: MIT](https://img.shields.io/github/license/codertesla/bilibili-enhanced-progress-bar)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-repo-24292f?logo=github)](https://github.com/codertesla/bilibili-enhanced-progress-bar)

Bilibili / B 站视频进度条增强油猴脚本。暂停视频时显示当前进度条，可切换为永久显示，并展示已缓冲进度。

默认使用 B 站官方蓝渲染一条低调的自绘进度条，支持普通播放、全屏和 B 站网页全屏。

## 功能

- 暂停视频时显示当前进度条。
- 油猴菜单可切换“永久显示进度条”，默认关闭。
- 默认在播放器底部渲染一条低调的自绘进度条，支持全屏和 B 站网页全屏。
- 自绘进度条包含已播放进度和已缓冲进度。
- 颜色使用 B 站官方蓝 `#00aeec`。

## 安装

推荐从 Greasy Fork 安装，后续更新更方便：

[安装脚本](https://greasyfork.org/scripts/585382)

也可以手动安装：

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) / [Violentmonkey](https://violentmonkey.github.io/)。
2. 打开 `bilibili-enhanced-progress-bar.user.js`。
3. 复制脚本内容，新建用户脚本并保存。

## 相关推荐脚本

这些也是我写的 Bilibili / B 站油猴脚本，可以按需搭配使用：

| 脚本 | 适合场景 | 安装 | 源码 |
| :--- | :--- | :--- | :--- |
| B 站嘴替小助手 | 根据当前视频内容调用 AI 生成一条可编辑的中文评论，适合想快速起草评论时使用。 | [Greasy Fork](https://greasyfork.org/scripts/583255) | [GitHub](https://github.com/codertesla/bili-comment-buddy) |
| B站视频倍速器 | 自由设定 Bilibili 默认播放速度，支持快捷调速、记住设置、自动应用和键盘快捷键。 | [Greasy Fork](https://greasyfork.org/scripts/561015) | [GitHub](https://github.com/codertesla/bilibili-video-speed-controller-userscript) |
| Bilibili 快捷评论发布 | 在视频页、番剧页和列表播放页使用 `Cmd+Enter` / `Ctrl+Enter` 快速发布评论。 | [Greasy Fork](https://greasyfork.org/zh-CN/scripts/565212-bilibili-%E5%BF%AB%E6%8D%B7%E8%AF%84%E8%AE%BA%E5%8F%91%E5%B8%83) | [GitHub](https://github.com/codertesla/EasyComment) |
| B站一键拉黑 UP 主 | 在首页、搜索页和视频页快速拉黑 UP 主，并支持屏蔽视频卡片、直播卡片、广告和运营推广。 | [Greasy Fork](https://greasyfork.org/zh-CN/scripts/529390-bilibili-b%E7%AB%99%E4%B8%80%E9%94%AE%E6%8B%89%E9%BB%91up%E4%B8%BB-%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E4%B8%8E%E5%B9%BF%E5%91%8A) | [GitHub](https://github.com/codertesla/bilibili-1-click-blocker) |

## 设置

在油猴插件菜单中：

- `永久显示进度条`：默认关闭。开启后播放、暂停时都显示进度条。

## 设计取舍

脚本采用自绘进度条。B 站播放器 DOM 会随版本变化，完全依赖某个原生选择器容易失效；自绘进度条只读取 video 的 `currentTime`、`duration` 和 `buffered`，稳定性更好。

自绘进度条默认高度为 `3px`，颜色为 B 站官方蓝 `#00aeec`。

## 开发

当前项目不需要构建步骤，直接编辑：

```text
bilibili-enhanced-progress-bar.user.js
```

## 关键词

Bilibili, B 站, 哔哩哔哩, 油猴脚本, Tampermonkey, 进度条, 暂停显示进度条, 永久显示进度条, 缓冲进度, 全屏进度条
