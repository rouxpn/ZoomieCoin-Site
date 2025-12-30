export async function onRequestGet() {
  const tokenAccount = "8FEUZoTDxCQf9Pr2eWmgAHoADdMbrb4Nv1bivDeva9GW";

  // Use a reliable RPC here (server-side, so no CORS issues)
  const rpc = "https://rpc.ankr.com/solana";

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

  const data = await r.json();
  const amount = data?.result?.value?.uiAmountString ?? data?.result?.value?.amount ?? null;

  return new Response(JSON.stringify({ amount }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30",  // cache 30s
    },
  });
}
