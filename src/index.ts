import express from "express";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const admin = initializeApp();
const storage = getStorage(admin);

const app = express();
const port = 3000;

function getRandomInt(min: number, max: number) {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin) + cmin); //The maximum is exclusive and the minimum is inclusive
}

const imgBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAADXUAAA11AFeZeUIAAAADUlEQVQImWNgYGD4AQAA/QD5mGv9bAAAAABJRU5ErkJggg==";
const buf = Buffer.from(imgBase64, "base64");
const bucket = storage.bucket("test.local.emulator.bucket");

app.get("/", async (_req, res) => {
  try {
    const n = getRandomInt(100, 10000);
    const f = bucket.file(`${n}.png`);
    await new Promise((resolve, reject) => {
      const stream = f.createWriteStream();
      stream.write(buf);
      stream.end();
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
    f.makePublic();
    res.send("Hello World!");
  } catch (error) {
    console.log(error);
    res.send("failed");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
