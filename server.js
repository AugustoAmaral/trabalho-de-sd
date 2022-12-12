const express = require("express");
const client = require("./client");
const { novaListaDeIps, novaListaDeMensagens, limparTela, descriptografar, checarChaveCadastrada } = require("./utils");


//Express é o framework de javascript que usamos para escutar as mensagens.
const app = express();
const porta = 3000;

//Configuramos o express para interpretar a mensagem no corpo de uma requisição
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


var meusDados = {
  ip: '127.0.0.1',
  nome: 'Jhonatan',
  porta: `${porta}`,
  chave: 'chaveUltraSecreta'
}

var listaDeIps = novaListaDeIps()
var messages = novaListaDeMensagens();

app.post("/mensagem", (req, res) => {
  const { chave } = req.headers
  const destinatario = checarChaveCadastrada(listaDeIps, chave)
  const { ip, nome, porta } = destinatario
  if (destinatario) {
    messages.push({ ip, nome, porta, mensagem: descriptografar(req.body, destinatario, meusDados), mensagemCriptografada: req.body });
    console.log("Nova mensagem recebida!");
    res.send("Ok");
  } else {
    res.status(500).send('Usuário não cadastrado')
  }
});

app.post("/cadastro", (req, res) => {
  const { ip, nome, porta, chave } = req.headers
  listaDeIps.push({ ip, nome: nome, porta, chave })
  console.log(`Usuário: ${nome} cadastrado!`);
  res.send(meusDados);
});


const main = async () => {
  //Aqui abrimos o servidor para escutar na porta 3000 e
  //Assim que o servidor passa a escutar na porta 3000
  const server = app.listen(porta, async () => {
    console.log(`Servidor aberto http://localhost:${porta}`);
  });

  //Aguardamos 1 segundo para mostrar o menu
  await new Promise((r) => setTimeout(r(), 1000));

  var rodando = true;
  limparTela()
  while (rodando) {
    //Aqui usamos uma função para executar as funções do programa
    rodando = await client(messages, listaDeIps, meusDados);
  }

  server.close();
  process.exit(0);
};

main();
