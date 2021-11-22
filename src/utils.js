const readline = require("readline");
const fetch = require("node-fetch");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const makeAQuestion = async (question) => {
  return new Promise((r) => {
    rl.question(question, (answer) => {
      r(answer);
    });
  });
};

const sendMessage = async (message, ip) =>
  fetch(`http://${ip}`, { method: "POST", body: message })
    .then((r) => {
      console.log(
        r.status === 200
          ? `Mensagem enviada para ${ip}`
          : "Falha ao enviar a mensagem"
      );
    })
    .catch((e) => {
      console.log("Falha ao enviar a mensagem");
      console.log(e);
    });

module.exports = {
  makeAQuestion,
  sendMessage,
};
