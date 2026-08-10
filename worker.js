// ================================================================
// hwt-ai-proxy —— 华文通 · DeepSeek 中转（Cloudflare Worker）
// ----------------------------------------------------------------
// 作用：浏览器里的华文通工具没法直接调 DeepSeek（会被跨域 CORS 拦），
//       让它们改调这个中转；中转再转发给 DeepSeek，并补上 CORS 头。
// key ：由浏览器在 x-deepseek-key 头里传来（BYO），本中转只转发、不存储、不打印。
// ================================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",                       // 如需收紧，改成你的门厅网址
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-deepseek-key",
};

export default {
  async fetch(request) {
    // 浏览器预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("Only POST", { status: 405, headers: CORS });
    }

    const key = request.headers.get("x-deepseek-key") || "";
    if (!key) {
      return new Response(JSON.stringify({ error: "缺少 x-deepseek-key" }), {
        status: 401,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const body = await request.text();

    let resp;
    try {
      resp = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + key,
        },
        body,
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "转发失败：" + e.message }), {
        status: 502,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const text = await resp.text();
    return new Response(text, {
      status: resp.status,                                   // 原样透传 DeepSeek 的状态码
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  },
};
