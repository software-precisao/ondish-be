
const Funcionario = require("../models/tb_funcionario");


const criarFuncionario = async (req, res, next) => {
    try {

        const filename = req.files.foto
            ? req.files.foto[0].filename
            : "default-avatar.png";

        const novoFuncionario = await Funcionario.create({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            genero: req.body.genero,
            funcao: req.body.funcao,
            foto: `/avatar/${filename}`,
            id_restaurante: req.body.id_restaurante,
        });

        const response = {
            mensagem: "Usuário cadastrado com sucesso e Token unico gerado!",
            usuarioCriado: {
                id_funcionario: novoFuncionario.id_funcionario,
                nome: novoFuncionario.nome,
                sobrenome: novoFuncionario.sobrenome,
                request: {
                    tipo: "GET",
                    descricao: "Pesquisar um usuário",
                    url: `https://trustchecker.com.br/api//usuarios/${novoFuncionario.id_funcionario}`,
                },
            },
        };

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const obterFuncionario = async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll();
    return res.status(200).send(funcionarios);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Método para obter um funcionário por ID
const obterFuncionarioPorId = async (req, res) => {
  try {
    const { id_restaurante } = req.params;
    const funcionario = await Funcionario.findAll(id_restaurante);
    if (!funcionario) {
      return res.status(404).send({ mensagem: "Funcionário não encontrado!" });
    }
    return res.status(200).send(funcionario);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Método para atualizar um funcionário
const atualizarFuncionario = async (req, res) => {
  try {
    const { id_funcionario } = req.params;

    const funcionario = await Funcionario.findByPk(id_funcionario);
    if (!funcionario) {
      return res.status(404).send({ mensagem: "Funcionário não encontrado!" });
    }

    const filename = req.files && req.files.avatar ? req.files.avatar[0].filename : funcionario.foto;

    await funcionario.update({
      nome: req.body.nome,
      sobrenome: req.body.sobrenome,
      genero: req.body.genero,
      funcao: req.body.funcao,
      foto: `/foto/${filename}`,
      id_restaurante: req.body.id_restaurante,
    });

    return res.status(200).send({
      mensagem: "Funcionário atualizado com sucesso!",
      funcionarioAtualizado: {
        id_funcionario: funcionario.id_funcionario,
        nome: funcionario.nome,
        sobrenome: funcionario.sobrenome,
        genero: funcionario.genero,
        funcao: funcionario.funcao,
        foto: funcionario.foto,
        id_restaurante: funcionario.id_restaurante,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Método para deletar um funcionário
const deletarFuncionario = async (req, res) => {
  try {
    const { id_funcionario } = req.params;

    const funcionario = await Funcionario.findByPk(id_funcionario);
    if (!funcionario) {
      return res.status(404).send({ mensagem: "Funcionário não encontrado!" });
    }

    await funcionario.destroy();
    return res.status(200).send({ mensagem: "Funcionário deletado com sucesso!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
    criarFuncionario,
    obterFuncionario,
    obterFuncionarioPorId,
    atualizarFuncionario,
    deletarFuncionario,
  
};
