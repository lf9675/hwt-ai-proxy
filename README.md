# hwt-ai-proxy

华文通的 DeepSeek 中转，部署在 Cloudflare Workers。
线上网址：https://hwt-ai-proxy.lyqlym2015.workers.dev
Cloudflare 账号：lyqlym2015@gmail.com

## 谁在用它
- bei/grade-comp.html（等级评定）
- du/kaifangti.html（开放题苏格拉底）
- xie/zuowenzhidao.html（作文导师）

## 怎么传 key
浏览器把 API key 放在请求头 x-deepseek-key 里发过来，
代码本身不存任何密钥。

## 当前模型
deepseek-v4-flash（deepseek-chat 已于 2026-07-24 停用）

## 万一 Worker 被误删怎么恢复
Cloudflare → Compute → Workers & Pages → Create → 起同样的名字
→ 进在线编辑器 → 把 worker.js 的内容整个粘进去 → Deploy
→ 确认网址仍是 hwt-ai-proxy.lyqlym2015.workers.dev
