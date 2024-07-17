const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');
const {uploadFields} = require('../helpers/img-uploader');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /usuario/cadastrar:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João"
 *               sobrenome:
 *                 type: string
 *                 example: "Silva"
 *               email:
 *                 type: string
 *                 example: "joao@example.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *               id_nivel:
 *                 type: integer
 *                 example: 1
 *               id_status:
 *                 type: integer
 *                 example: 1
 *               avatar:
 *                 type: string
 *                 format: binary
 *               config:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       202:
 *         description: Usuário cadastrado com sucesso e Token único gerado
 *       409:
 *         description: Email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */

router.post('/cadastrar', uploadFields, usuarioController.criarUsuario);

/**
 * @swagger
 * /usuario/cadastrar/restaurante:
 *   post:
 *     summary: Cria um novo usuário restaurante
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria"
 *               sobrenome:
 *                 type: string
 *                 example: "Fernandes"
 *               email:
 *                 type: string
 *                 example: "maria@example.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       202:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: Email já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/cadastrar/restaurante', uploadFields, usuarioController.criarUsuarioRestaurante);

/**
 * @swagger
 * /usuario/verifica-code:
 *   post:
 *     summary: Verifica o código de verificação do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: integer
 *                 example: 1
 *               code:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Código verificado com sucesso
 *       400:
 *         description: Código inválido ou não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/verifica-code', usuarioController.verificarCodigo);

/**
 * @swagger
 * /usuario:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', usuarioController.obterUsuarios);

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', usuarioController.obterUsuarioPorId);

/**
 * @swagger
 * /usuario/edit/{id_user}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João"
 *               sobrenome:
 *                 type: string
 *                 example: "Silva"
 *               email:
 *                 type: string
 *                 example: "joao@example.com"
 *               senha:
 *                 type: string
 *                 example: "novaSenha123"
 *               id_nivel:
 *                 type: integer
 *                 example: 1
 *               id_status:
 *                 type: integer
 *                 example: 1
 *               avatar:
 *                 type: string
 *                 example: "/avatar/joao.jpg"
 *               config:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/edit/:id_user', uploadFields, usuarioController.atualizarUsuario);
router.put('/edit/senha/:id', usuarioController.atualizarSenhaUsuario);
router.post('/valida-email', usuarioController.recuperarSenha);

/**
 * @swagger
 * /usuario/delete/{id_user}:
 *   delete:
 *     summary: Deleta um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/delete/:id_user', usuarioController.deletarUsuario);

module.exports = router;