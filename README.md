# 具身智能论文日报

GitHub Pages 静态站。三个长期专题：Tactile Sensing、Robot RL（含 SuperMimic）、Agentic Robots（控制链中的规划、执行或纠错）。VLA、世界模型、导航等照常收录。

## 论文精读与媒体

- 数据由 `data.js` 保存；`editorial.js` 补充关键词、动机、官方视频与原图。独立论文页使用 `paper/?id=<arXiv编号>`；旧 `#paper-*` 链接会转入新版。历史或专题选读不算当日首发。
- 视频进入视区时尝试静音循环，支持暂停和系统减少动态效果设置。没有可嵌入视频时显示论文图或项目链接。自动任务可提取 arXiv HTML 中的原图；未提供可提取 HTML 的论文仍可打开 PDF。
- 本地可打开 `index.html`；远程媒体、热点和完整图集需要联网。Pages 继续使用 `main / (root)`。

## 自动收录

`Robotics trend radar` 每天读取官方 arXiv cs.RO RSS，可在 GitHub Actions 手动运行。收录 `new`、`cross` 的 v1 条目，按真实公布日和编号去重，保留空批次之前的有效快照。

在滚动 14 天内，方向至少有 3 篇、2 个公布日、3 组无重叠署名的论文才成专题。匹配依据是标题、摘要与重复术语。Robotica 官方 Articles API 提供社区点赞；按 arXiv 编号匹配后只影响排序，不重复计入论文数量。缺少 Robotica 数据时，arXiv 收录继续运行。符合门槛的专题由顶部 Trending Topics 直达，退热后进入 Past topics。

Daily 保留人工解读，并从同批次补入最多 5 篇（含人工解读）的条目；近期高赞论文单列为 Community picks。自动条目只做基于作者摘要的摘录，不伪装成全文精读，也不把旧论文归入当天批次。

工作流把公开 JSON 写入 `radar-data` 分支，前端直接读取，不依赖机器人触发 Pages 重新发布。无需 PAT；需允许 Actions 使用 `contents: write`。本地可运行 `python3 scripts/radar.py <输出目录> --rss-file <测试源>`。
