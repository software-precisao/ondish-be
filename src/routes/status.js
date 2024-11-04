// routes/status.js
const express = require('express');
const router = express.Router();
const statusController = require('../controller/statusController');

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Gerenciamento de status
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Retorna todos os status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Lista de status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_status:
 *                     type: integer
 *                   label:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', statusController.obterStatus);

/**
 * @swagger
 * /status/{id_status}:
 *   get:
 *     summary: Retorna um status pelo ID
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id_status
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do status
 *     responses:
 *       200:
 *         description: Status encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_status:
 *                   type: integer
 *                 label:
 *                   type: string
 *       404:
 *         description: Status não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id_status', statusController.obterStatusPorId);

/**
 * @swagger
 * /status/cadastrar:
 *   post:
 *     summary: Cria um novo status
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Ativo"
 *     responses:
 *       201:
 *         description: Status criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_status:
 *                   type: integer
 *                 label:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/cadastrar', statusController.criarStatus);

/**
 * @swagger
 * /status/edit/{id_status}:
 *   put:
 *     summary: Atualiza um status existente
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id_status
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Inativo"
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       404:
 *         description: Status não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/edit/:id_status', statusController.atualizarStatus);

/**
 * @swagger
 * /status/delete/{id_status}:
 *   delete:
 *     summary: Deleta um status existente
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id_status
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do status
 *     responses:
 *       200:
 *         description: Status deletado com sucesso
 *       404:
 *         description: Status não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/delete/:id_status', statusController.deletarStatus);

module.exports = router;