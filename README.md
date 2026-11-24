# ChaoxingStudy-Hepler - 超星学习通AI助手 🚀

## 简介 📖

本项目是一个基于AI技术的超星学习通自动考试/作业助手，旨在为用户提供一个便捷的考试辅助工具。通过对接通义千问或Ollama等AI模型，程序能够自动完成考试中的单选题、多选题、填空题和判断题。🤖

## 免责声明 ⚠️

请注意：

- 本项目仅供娱乐和学习交流使用。🎮
- 严禁将本项目用于任何形式的考试舞弊或其他违法违规行为。🚫
- 使用本程序所产生的一切后果由使用者自行承担。💡
- 开发者不对任何因使用本项目而产生的法律责任负责。⚖️

## 快速开始（推荐）🚀

1. 从 [GitHub Release](https://github.com/mikubob/chaoxingStudy-Helper/releases/latest) 下载 `ChaoxingStudy-Helper-Setup-*-x64.exe`，适用于 Windows x64。
2. 运行安装程序，在安装向导中选择安装目录，再从开始菜单打开 ChaoxingStudy Helper。安装包已包含 Python 后端。首次启动答题浏览器时，Selenium Manager 可能需要联网获取 Chrome 和配套驱动。

### 程序截图

 ![screenshot](screenshot.png)

在桌面端的「模型服务」中选择通义千问、Ollama 或 OpenAI 兼容服务。

- **通义千问**默认使用 `qwen-max`。填写 API Token，可另外指定图片填空题使用的模型，默认为 `qwen-vl-max-latest`。[申请通义千问 API Token](https://bailian.console.aliyun.com/?apiKey=1)
- **Ollama** 默认连接 `http://localhost:11434`，使用 `qwen2:latest`。可以填写远程 Ollama 地址和该服务上已安装的模型名。Ollama 支持选择题和判断题。
- **OpenAI 兼容服务**填写服务地址、模型名称和 API Key。地址可填写主机名（例如 `https://api.example.com`）、带版本的 Base URL（例如 `https://api.example.com/v1`）或完整的 `/chat/completions` URL。无需认证的服务可将 API Key 留空。含图题可单独设置支持图片输入的模型，留空时使用所选文本模型。
  - 默认将找到的首图以 Base64 随请求发送。查找顺序是先题干，再按页面顺序查找选项。
  - 勾选「上传到第三方图床」（`--image-hosting`）时，图片会先上传到 `image.myxuebi.top`，模型请求中发送图片直链。
  - 勾选「读取题干和选项的全部图片」（`--all-images`）时，会将题干和各选项中的图片一起发送，并标注每组图片对应的选项。

## 从源码运行 🛠️

安装 Python 依赖。程序会查找 Chrome 并通过 Selenium Manager 匹配驱动，自动匹配时跳过 PATH 上的 ChromeDriver。如果运行目录中已有配套的 `chromedriver/chrome.exe` 和 `chromedriver/chromedriver.exe`，仍可使用这两个文件。

```sh
pip install dashscope selenium==4.31.0 requests
```

运行 `python main.py`，按提示输入账号、密码和第一题链接，再选择服务并填写模型。也可通过参数指定配置，运行 `python main.py --help` 查看 `--provider`、`--model`、`--api-url`、`--ollama-url` 和 `--vision-model` 的用法。

开发桌面端时，运行 `npm ci`，再在两个终端分别运行 `npm run serve` 和 `npm run electron:serve`。

在 Windows x64 上构建安装包时，先安装上述依赖及 `pyinstaller==6.16.0`，再运行 `npm ci` 和 `npm run electron:build`。安装包生成在 `release/`。

## 注意事项 📌

- 目前本项目仅支持单选题、多选题、填空题和判断题的自动作答。✅ （目前仅考试模式支持填空）
- 使用前请确保已正确配置AI模型和相关依赖。🔧

## 版本 1.2.3

- OpenAI 兼容服务支持选择 Base64 或第三方图床直链发送图片。
- 支持读取首图或题干和选项中的全部图片，并标注每组图片对应的选项。

## 版本 1.2.2

- 修复旧版 ChromeDriver 导致的 Chrome 启动失败。
- 新增可自定义服务地址和模型的 OpenAI 兼容服务。

## 版本 1.2.1

- Windows 安装向导支持自选安装目录。

## 版本 1.2.0

- 桌面端和命令行支持选择通义千问或 Ollama，自定义文本模型，通义千问可单独设置图片模型。
- 提供包含 Python 后端的 Windows x64 安装包。

## 版本 1.1

### 更新内容 📅

- **支持作业作答**

## 版本 1.0.5 - 新增填空题图片识别 🆕

### 更新内容 📅

- **新增填空题图片识别**：对填空题支持图片识别和处理📝

## 版本 1.0.4 - 新增填空题支持 🆕

### 更新内容 📅

- **新增填空题支持**：现在程序已支持自动作答填空题，进一步提升了考试辅助的全面性。📝

## 贡献与反馈 🤝

如果您有任何建议或问题，欢迎提交Issue或Pull Request。感谢您的支持！🙏

声明：本项目仅为技术演示，请勿用于任何违法违规用途。⚖️
