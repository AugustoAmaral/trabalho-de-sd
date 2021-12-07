const express = require("express");
const client = require("./client");


//Express é o framework de javascript que usamos para escutar as mensagens.
const app = express();
const port = 3000;

//Lista contendo todas as mensagens
var messages = [];
//Lista contendo os IPs dos usuários
var listaDeIps = [
  "127.0.0.1:3000",
  "52.190.255.41:3000", // Guto
  "20.195.194.147:3000", // Matheus
  "20.197.232.133:3000", // leonardo
  "20.206.66.31:3000", // bruno
];

//Configuramos o express para interpretar a mensagem no corpo de uma requisição
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
//E ativamos o proxy para gravar o IP de quem enviou
app.set("trust proxy", true);

//Aqui a gente coloca a aplicação para escutar na rota '/'
app.post("/", (req, res) => {
  //Aqui nós adicionamos o ip e a mensagem na lista de mensagem
  messages.push(`IP: ${req.ip} - Mensagem: ${req.body}`);
  //E exibimos para o usuário que há uma nova mensagem
  console.log("Nova mensagem recebida!");
  //E respodemos quem enviou a mensagem que a mensagem foi recebida
  res.send("Ok");
});


const main = async () => {
  //Aqui abrimos o servidor para escutar na porta 3000 e
  //Assim que o servidor passa a escutar na porta 3000
  const server = app.listen(port, async () => {
    console.log(`Server open http://localhost:${port}`);
  });
  //Aguardamos 1 segundo para mostrar o menu
  await new Promise((r) => setTimeout(r, 1000));

  var rodando = true;
  while (rodando) {
    //Aqui usamos uma função para executar as funções do programa
    rodando = await client(messages, listaDeIps);
  }

  server.close();
  process.exit(0);
};

main();
