const { Console } = require("console");
const express = require("express");
const fetch = require("node-fetch");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = express();
const port = 3000;

var messages = [];
var listaDeIps = ["127.0.0.1:3000", "45.226.110.71:3000", "177.131.164.128:3000"];

app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);

app.post("/", (req, res) => {
  messages.push(`IP: ${req.ip} - Mensagem: ${req.body}`);
  console.log("Nova mensagem recebida!");
  res.send("Ok");
});

const makeAQuestion = async (question) => {
  return new Promise((r) => {
    rl.question(question, (answer) => {
      r(answer);
    });
  });
};

const menu = async (messages, listaDeIps) => {
  console.log("\n\n");
  console.log("--Menu--");
  console.log("Digite uma das opções");
  console.log("1 - Listar IPs");
  console.log("2 - Adicionar IP");
  console.log("3 - Remover IP");
  console.log("4 - Listar mensagens");
  console.log("5 - Enviar mensagem");
  console.log("6 - Sair");

  return new Promise(async (r) => {
    var finish = false;
    const selectedOpt = await makeAQuestion("Digite uma das opções: ");
    console.log("\n");

    switch (selectedOpt) {
      case "1":
        console.log("Lista de IPs: ");
        console.log(
          listaDeIps.length > 0 ? listaDeIps.join(", ") : "Lista vazia"
        );
        break;
      case "2":
        await makeAQuestion("Digite o IP: ").then((ip) => {
          listaDeIps.push(ip);
          console.log(`IP adicionado: ${ip}`);
        });

        break;
      case "3":
        console.log("Opções de IP:\n");
        console.log(listaDeIps.map((str, k) => `${k} - ${str}`).join("\n"));
        await makeAQuestion("Digite o IP: ").then((ip) => {
          listaDeIps.splice(listaDeIps.indexOf(listaDeIps[ip]), 1);
          console.log(`IP removido: ${ip}`);
        });
        break;
      case "4":
        console.log(
          messages.length > 0 ? messages.join("\n") : "Não há mensagens"
        );
        break;
      case "5":
        const messageToSend = await makeAQuestion("Digite a mensagem: ");

        console.log("Opções de IP:\n");
        console.log(listaDeIps.map((str, k) => `${k} - ${str}`).join("\n"));
        const ipToSend = await makeAQuestion("Selecione o ID do IP na lista: ");
        await fetch(`http://${listaDeIps[ipToSend]}`, {
          method: "POST",
          body: messageToSend,
        })
          .then((r) => {
            console.log(
              r.status === 200
                ? `Mensagem enviada para ${listaDeIps[ipToSend]}`
                : "Falha ao enviar a mensagem"
            );
          })
          .catch((e) => {});

        break;
      case "6":
        console.log("Até mais");
        finish = true;
        break;
      default:
        console.log("Opção inválida");
        break;
    }
    r(!finish);
  });
};

const main = async () => {
  const server = app.listen(port, async () => {
    console.log(`Server open http://localhost:${port}`);
  });
  await new Promise((r) => setTimeout(r, 1000));

  var rodando = true;
  while (rodando) {
    rodando = await menu(messages, listaDeIps);
    if (!rodando) {
      server.close();
    }
  }
};

main();
