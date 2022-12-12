const readline = require("readline");
const fetch = require("node-fetch");
var CryptoJS = require("crypto-js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const limparTela = () => {
  var lines = process.stdout.getWindowSize()[1];
  for (var i = 0; i < lines; i++) {
    console.log('\r\n');
  }
}

const mostrarOpcoes = () => {
  console.log("--Menu--");
  console.log("Digite uma das opções");
  console.table({ 1: 'Listar IPs', 2: 'Adicionar IP', 3: 'Remover IP', 4: 'Listar mensagens', 5: 'Enviar mensagem', 6: 'Sair' })
}

const oFamosoScanf = async (question) => {
  return new Promise((r) => {
    rl.question(question, (answer) => {
      r(answer);
    });
  });
};

/**
 * 
 * @param Array<{ip: string; nome: string; porta: string; chave: string; mensagem: string}> mensagens
 * @returns Array<{string}>
 */
const usuariosComMensagens = (mensagens) => mensagens.map(({ nome }) => ({ nome })).reduce((mensagens, { nome }) => {
  if (nome in mensagens)
    mensagens[nome]['Mensagens'] = mensagens[nome]['Mensagens'] + 1
  else
    mensagens[nome] = { ['Mensagens']: 1 }

  return mensagens
}, {})

const formatarMensagem = (mensagens) =>
  mensagens.map(({ nome, mensagem, mensagemCriptografada }) =>
    ({ nome, mensagem, ['Mensagem criptografada']: mensagemCriptografada }))

/**
 * 
 * @returns Array<{ip: string; nome: string; porta: string; chave: string}>
 */
const novaListaDeIps = () => []

/**
 * 
 * @returns Array<{ip: string; nome: string; porta: string; chave: string; mensagem: string}>
 */
const novaListaDeMensagens = () => []

const criptografar = (mensagem, meusDados, dadosAlheios) => CryptoJS.AES.encrypt(mensagem, JSON.stringify([meusDados, dadosAlheios]));

const descriptografar = (mensagem, meusDados, dadosAlheios) => CryptoJS.AES.decrypt(mensagem, JSON.stringify([meusDados, dadosAlheios])).toString(CryptoJS.enc.Utf8);

const checarChaveCadastrada = (dados, chave) =>
  dados.find((dado) => dado.chave === chave)

const sendMessage = async (mensagem, meusDados, dadosAlheios) =>
  fetch(`http://${dadosAlheios.ip}:${dadosAlheios.porta}/mensagem`, {
    method: "POST", body: criptografar(mensagem, meusDados, dadosAlheios), headers: { chave: meusDados.chave }
  })
    .then((r) => {
      console.log(
        r.status === 200
          ? `Mensagem enviada para ${dadosAlheios.ip}`
          : "Falha ao enviar a mensagem"
      );
    })
    .catch((e) => {
      console.log("Falha ao enviar a mensagem");
      console.log(e);
    });

const cadastrarIp = async (ip, meusDados) =>
  fetch(`http://${ip}/cadastro`, {
    method: "POST", headers: meusDados
  })
    .then((r) => r.json())
    .catch((e) => {
      console.log("Falha ao cadastrar usuário.");
      console.log(e);
    });

module.exports = {
  oFamosoScanf,
  sendMessage,
  cadastrarIp,
  novaListaDeIps,
  novaListaDeMensagens,
  usuariosComMensagens,
  formatarMensagem,
  limparTela,
  mostrarOpcoes,
  descriptografar,
  checarChaveCadastrada
};
