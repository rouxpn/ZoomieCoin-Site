import json
import requests

TOKEN_ACCOUNT = "8FEUZoTDxCQf9Pr2eWmgAHoADdMbrb4Nv1bivDeva9GW"

RPCS = [
    "https://api.mainnet-beta.solana.com",
    "https://ssc-dao.genesysgo.net",
    "https://solana-api.projectserum.com",
]

payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTokenAccountBalance",
    "params": [TOKEN_ACCOUNT],
}

last_err = None
for rpc in RPCS:
    try:
        r = requests.post(rpc, json=payload, timeout=20)
        r.raise_for_status()
        data = r.json()
        if "error" in data:
            raise RuntimeError(f"RPC error: {data['error']}")
        value = data["result"]["value"]
        amount = value.get("uiAmountString") or value.get("amount")

        out = {"amount": amount}
        # make sure folder exists
        import os
        os.makedirs("data", exist_ok=True)

        with open("data/pool.json", "w") as f:
            json.dump(out, f, indent=2)

        print(f"Updated using {rpc}: {out}")
        break
    except Exception as e:
        last_err = e
else:
    raise SystemExit(f"All RPCs failed. Last error: {last_err}")
