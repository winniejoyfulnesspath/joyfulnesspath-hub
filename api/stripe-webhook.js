const UPSTREAM = "https://script.google.com/macros/s/AKfycbzEHNWnXvWTBx4LBKvW68hKUxyUxWkd3xgo1f9jqOa0reS-_X7nTEN2pZiwgTbdImmJ/exec";

module.exports = async function stripeWebhook(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "post_only" });
    return;
  }

  const incoming = new URL(req.url, "https://joyfulnesspath.com");
  if (incoming.searchParams.get("source") !== "stripe" || !incoming.searchParams.get("key")) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  const payload = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
  const upstream = await fetch(UPSTREAM + incoming.search, {
    method: "POST",
    redirect: "follow",
    headers: { "content-type": "application/json" },
    body: payload
  });
  const text = await upstream.text();
  res.status(upstream.status).send(text);
};
