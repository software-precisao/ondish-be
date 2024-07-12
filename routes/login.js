// routes/login.js
const express = require('express');
const router = express.Router();
const { autenticarUsuarioApp, autenticarUsuarioRestaurante, logoutUsuario  } = require('../controller/loginController');

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Gerenciamento de login e logout
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               senha:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: Autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Autenticado com sucesso!
 *                 token:
 *                   type: string
 *                 id_status:
 *                   type: integer
 *                 id_nivel:
 *                   type: integer
 *       401:
 *         description: Falha na autenticação
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', autenticarUsuarioApp);
router.post('/restaurante', autenticarUsuarioRestaurante);

/**
 * @swagger
 * /logout/{id_user}:
 *   post:
 *     summary: Realiza o logout de um usuário
 *     tags: [Login]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Logout realizado com sucesso.
 *       404:
 *         description: Registro de login não encontrado para atualização
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/logout/:id_user', logoutUsuario);

module.exports = router;