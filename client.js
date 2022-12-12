const { oFamosoScanf, sendMessage, cadastrarIp, usuariosComMensagens, formatarMensagem, limparTela, mostrarOpcoes } = require("./utils");

/**
 *
 * @param {Array<{ip: string; nome: string; porta: string; chave: string; mensagem: string}>} messages
 * @param {Array<{ip: string; nome: string; porta: number}>} listaDeIps
 * @param {{ip: string; nome: string; porta: number}} meusDados
 * @returns
 */
module.exports = async (messages, listaDeIps, meusDados) => {

  return new Promise(async (r) => {
    var finish = false;
    mostrarOpcoes()
    const selectedOpt = await oFamosoScanf("Digite uma das opções: ");
    limparTela()

    switch (selectedOpt) {
      case "1":
        if (listaDeIps.length > 0) {
          console.log("Lista de Usuários: ");
          console.table(listaDeIps)
        } else console.log('Lista Vazia');
        break;
      case "2":
        await oFamosoScanf(
          "Digite o IP (Com a porta no final Ex. 127.0.0.1:3000): "
        ).then((ip) => cadastrarIp(ip, meusDados)
        ).then(dados => {
          listaDeIps.push(dados);
          console.log(`Usuário ${dados.nome} adicionado.`)
        });
        break;
      case "3":
        console.log("Lista de Usuários: ");
        console.table(listaDeIps)
        await oFamosoScanf("Digite o índice: ").then((idx) => {
          console.log(`Usuário ID: ${idx}, nome: ${listaDeIps[idx].nome} Removido com sucesso!`);
          listaDeIps.splice(idx, 1);
        });
        break;
      case "4":
        if (messages.length > 0) {
          console.table(usuariosComMensagens(messages))
          const usuario = await oFamosoScanf("Digite o nome do usuário ou 0 para todos usuários: ");
          if (usuario === '0') {
            console.table(formatarMensagem(messages))
          } else {
            const mensagensParaExibir = messages.filter((msg) => msg.nome === usuario)
            if (mensagensParaExibir.length > 0)
              console.table(formatarMensagem(mensagensParaExibir))
            else console.log("Não há mensagens");
          }
        } else console.log("Não há mensagens");
        break;
      case "5":
        const messageToSend = await oFamosoScanf("Digite a mensagem: ");

        console.log("Opções de IP:\n");
        console.table(listaDeIps)
        const ipToSend = await oFamosoScanf("\n Digite o ID do IP na lista: ");

        await sendMessage(messageToSend, meusDados, listaDeIps[ipToSend]);

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
