const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");
const buildDir = path.join(basePath, "/build");

if (!fs.existsSync(path.join(buildDir, "/genericJson"))) {
  fs.mkdirSync(path.join(buildDir, "/genericJson"));
}

fs.readdirSync(`${buildDir}/json`).forEach((file) => {
  if (file === "_metadata.json" || file === "_ipfsMetas.json") return;

  const jsonFile = JSON.parse(fs.readFileSync(`${buildDir}/json/${file}`));

  jsonFile.name = "Unknown";
  jsonFile.description = "Unknown";
  jsonFile.file_url =
    "https://ipfs.io/ipfs/QmP2k2yQrmVz9N8bn7Co8D7kMxHPyUUhv93vg3CozbwEBL?filename=gb.jpg";
  delete jsonFile.attributes;
  delete jsonFile.dna;

  fs.writeFileSync(
    `${buildDir}/genericJson/${file}`,
    JSON.stringify(jsonFile, null, 2)
  );

  console.log(`${file} copied and updated!`);
});
