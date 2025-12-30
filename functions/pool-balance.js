export async function onRequestGet() {
  const tokenAccount = "8FEUZoTDxCQf9Pr2eWmgAHoADdMbrb4Nv1bivDeva9GW";

  // Try a few RPCs server-side (no browser CORS issues here)
  const rpcs = [
    "https://rpc.ankr.com/solana",
    "https://ssc-dao.genesysgo.net",
    "https://api.mainnet-beta.solana.com",
  ];

  async function call(rpc) {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountBalance",
        params: [tokenAccount],
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} from ${rpc}`);
    const data = await res.json();
    if (data.error) throw new Error(`RPC error from ${rpc}: ${data.error.message || "unknown"}`);

    const v = data?.result?.value;
    const amount = v?.uiAmountString ?? v?.amount ?? null;
    if (!amount) throw new Error(`No amount in response from ${rpc}`);

    return { amount, rpc };
  }

  try {
    let lastErr = null;

    for (const rpc of rpcs) {
      try {
        const { amount, rpc: used } = await call(rpc);
        return new Response(JSON.stringify({ amount, rpc: used }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=30",
          },
        });
      } catch (e) {
        lastErr = e;
      }
    }

    // If all RPCs failed, return error info so you can see what's wrong
    return new Response(JSON.stringify({ amount: null, error: String(lastErr) }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ amount: null, error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}