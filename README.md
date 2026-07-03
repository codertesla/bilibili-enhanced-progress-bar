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
- 油猴菜单可选“优先尝试原生进度条”，但默认关闭。
- 自绘进度条包含已播放进度和已缓冲进度。
- 颜色使用 B 站官方蓝 `#00aeec`。

## 安装

推荐从 Greasy Fork 安装，后续更新更方便：

[安装脚本](https://greasyfork.org/scripts/585382)

也可以手动安装：

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) / [Violentmonkey](https://violentmonkey.github.io/)。
2. 打开 `bilibili-enhanced-progress-bar.user.js`。
3. 复制脚本内容，新建用户脚本并保存。

## 设置

在油猴插件菜单中：

- `永久显示进度条`：默认关闭。开启后播放、暂停时都显示进度条。
- `优先尝试原生进度条`：默认关闭。开启后会先尝试显示 B 站原生进度条；如果原生进度条不可控，建议保持关闭。

## 设计取舍

脚本采用“自绘优先，原生可选”的策略。B 站播放器 DOM 会随版本变化，完全依赖某个原生选择器容易失效；自绘进度条只读取 video 的 `currentTime`、`duration` 和 `buffered`，稳定性更好。

自绘进度条默认高度为 `3px`，颜色为 B 站官方蓝 `#00aeec`。

## 开发

当前项目不需要构建步骤，直接编辑：

```text
bilibili-enhanced-progress-bar.user.js
```

## 关键词

Bilibili, B 站, 哔哩哔哩, 油猴脚本, Tampermonkey, 进度条, 暂停显示进度条, 永久显示进度条, 缓冲进度, 全屏进度条
