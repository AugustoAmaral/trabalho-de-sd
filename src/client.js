const { makeAQuestion } = require("./utils");
const fetch = require("node-fetch");

/**
 *
 * @param {Array} messages
 * @param {Array} listaDeIps
 * @returns
 */
module.exports = async (messages, listaDeIps) => {
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
        await makeAQuestion("Digite o IP (Com a porta no final Ex. 127.0.0.1:3000): ").then((ip) => {
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
          .catch((e) => {
            console.log("Falha ao enviar a mensagem");
            console.log(e);
          });

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
