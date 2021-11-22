const readline = require("readline");

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

module.exports = {
  makeAQuestion,
};
