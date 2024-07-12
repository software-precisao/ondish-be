// routes/nivel.js
const express = require('express');
const router = express.Router();
const { obterNiveis, obterNivelPorId, criarNivel, atualizarNivel, deletarNivel } = require('../controller/nivelController');

/**
 * @swagger
 * tags:
 *   name: Níveis
 *   description: Gerenciamento de níveis
 */

/**
 * @swagger
 * /nivel/cadastrar:
 *   post:
 *     summary: Cria um novo nível
 *     tags: [Níveis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Administrador"
 *               descricao:
 *                 type: string
 *                 example: "Nível de administrador com permissões completas"
 *     responses:
 *       201:
 *         description: Nível criado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/cadastrar', criarNivel);

/**
 * @swagger
 * /nivel:
 *   get:
 *     summary: Retorna todos os níveis
 *     tags: [Níveis]
 *     responses:
 *       200:
 *         description: Lista de níveis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_nivel:
 *                     type: integer
 *                   label:
 *                     type: string
 *                   descricao:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', obterNiveis);

/**
 * @swagger
 * /nivel/{id_nivel}:
 *   get:
 *     summary: Retorna um nível pelo ID
 *     tags: [Níveis]
 *     parameters:
 *       - in: path
 *         name: id_nivel
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do nível
 *     responses:
 *       200:
 *         description: Nível encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_nivel:
 *                   type: integer
 *                 label:
 *                   type: string
 *                 descricao:
 *                   type: string
 *       404:
 *         description: Nível não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id_nivel', obterNivelPorId);

/**
 * @swagger
 * /nivel/edit/{id_nivel}:
 *   put:
 *     summary: Atualiza um nível existente
 *     tags: [Níveis]
 *     parameters:
 *       - in: path
 *         name: id_nivel
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do nível
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Usuário"
 *               descricao:
 *                 type: string
 *                 example: "Nível de usuário com permissões limitadas"
 *     responses:
 *       200:
 *         description: Nível atualizado com sucesso
 *       404:
 *         description: Nível não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/edit/:id_nivel', atualizarNivel);

/**
 * @swagger
 * /nivel/delete/{id_nivel}:
 *   delete:
 *     summary: Deleta um nível existente
 *     tags: [Níveis]
 *     parameters:
 *       - in: path
 *         name: id_nivel
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do nível
 *     responses:
 *       200:
 *         description: Nível deletado com sucesso
 *       404:
 *         description: Nível não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/delete/:id_nivel', deletarNivel);

module.exports = router;