# 具身智能论文日报

GitHub Pages 静态站。浅紫主题、移动端适配、期次切换、跨期搜索、研究方向筛选、论文精读与当前结果对比。

## 本地打开

解压后双击 `index.html`。无需安装 Node.js 或启动服务器。论文中的在线图片需要联网；加载失败时仍可打开原文。

## 部署到 GitHub Pages

1. 在 GitHub 创建一个公开仓库，建议名为 `robotics-digest`。不要上传私人笔记或凭证。
2. 把解压目录**里面的文件**提交到 `main` 分支根目录，包括隐藏文件 `.nojekyll`；确认在仓库根目录可见 `index.html`。
3. 在仓库打开 **Settings → Pages → Build and deployment**，选择 **Deploy from a branch**，然后选择 **main / (root)** 并保存。
4. 发布完成后，网页地址为 `https://<用户名>.github.io/robotics-digest/`。以后把变更推到该分支会触发重新发布。

[GitHub Pages 官方快速上手](https://docs.github.com/en/pages/quickstart)

## 更新内容

- 在 `data.js` 的 `issues` 中新增一期，使用独立期次 key，并分别填写检索日期和 arXiv 公布批次。非首发批次专题令 `batch` 为 `null`。
- 在 `app.js` 中的 `translations` 增加每篇论文的中文题名。图片用原文或官方主页地址，并注明图意；来源和链接要核实。
- 现有两期是历史日报，另有 SuperMimic 路线专题。**本站不会自行抓取 arXiv 或生成日报**。定时更新需要另行配置内容生成与提交到仓库的流程。
