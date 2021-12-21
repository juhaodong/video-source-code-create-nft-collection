const fetch = require("node-fetch");
const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");

const AUTH = 'a73f9bfb-4e00-4f62-a67c-ffae85315326';
const CONTRACT_ADDRESS = '0xea6c8aec75724f219eb0559089ca35467330d300';
const MINT_TO_ADDRESS = '0xAe136FBc808A9Ead9a7D13Dc9953A2F58bcaf735';
const CHAIN = 'rinkeby';

const ipfsMetas = JSON.parse(
  fs.readFileSync(`${basePath}/build/json/_ipfsMetas.json`)
);

fs.writeFileSync(`${basePath}/build/minted.json`, "");
const writter = fs.createWriteStream(`${basePath}/build/minted.json`, {
  flags: "a",
});
writter.write("[");
nftCount = ipfsMetas.length;

ipfsMetas.forEach((meta) => {
  let url = "https://api.nftport.xyz/v0/mints/customizable";

  const mintInfo = {
    chain: CHAIN,
    contract_address: CONTRACT_ADDRESS,
    metadata_uri: meta.metadata_uri,
    mint_to_address: MINT_TO_ADDRESS,
    token_id: 1,
  };

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH,
    },
    body: JSON.stringify(mintInfo),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      writter.write(JSON.stringify(json, null, 2));
      nftCount--;

      if (nftCount === 0) {
        writter.write("]");
        writter.end();
      } else {
        writter.write(",\n");
      }

      console.log(`Minted: ${json.transaction_external_url}`);
    })
    .catch((err) => console.error("error:" + err));
});
