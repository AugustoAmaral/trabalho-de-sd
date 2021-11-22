const express = require("express");
const client = require("./client");

const app = express();
const port = 3000;

var messages = [];
var listaDeIps = [
  "127.0.0.1:3000",
  "52.190.255.41:3000", // Guto
  "20.195.194.147:3000", // Matheus
  "20.197.232.133:3000", // leonardo
  "20.206.66.31:3000", // bruno
];

app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);

app.post("/", (req, res) => {
  messages.push(`IP: ${req.ip} - Mensagem: ${req.body}`);
  console.log("Nova mensagem recebida!");
  res.send("Ok");
});

const main = async () => {
  const server = app.listen(port, async () => {
    console.log(`Server open http://localhost:${port}`);
  });
  await new Promise((r) => setTimeout(r, 1000));

  var rodando = true;
  while (rodando) {
    rodando = await client(messages, listaDeIps);
    if (!rodando) {
      server.close();
    }
  }
};

main();
