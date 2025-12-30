export async function onRequestGet() {
  return new Response(
    JSON.stringify({ ok: true, version: "pool-balance-test-1" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
