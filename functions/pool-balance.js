export async function onRequestGet() {
  const VERSION = "pool-balance-v2";
  const tokenAccount = "8FEUZoTDxCQf9Pr2eWmgAHoADdMbrb4Nv1bivDeva9GW";

  const rpc = "https://rpc.ankr.com/solana";

  try {
    const r = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountBalance",
        params: [tokenAccount],
      }),
    });

    const text = await r.text(); // read raw text first (helps debug)
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ amount: null, version: VERSION, error: "RPC returned non-JSON", raw: text.slice(0, 200) }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!r.ok) {
      return new Response(JSON.stringify({ amount: null, version: VERSION, error: `HTTP ${r.status}`, rpc, body: data }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (data.error) {
      return new Response(JSON.stringify({ amount: null, version: VERSION, error: data.error, rpc }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const v = data?.result?.value;
    const amount = v?.uiAmountString ?? v?.amount ?? null;

    return new Response(JSON.stringify({ amount, version: VERSION, rpc }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ amount: null, version: VERSION, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}