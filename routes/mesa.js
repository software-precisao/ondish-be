// routes/mesa.js
const express = require('express');
const router = express.Router();
const mesaController = require('../controller/mesaController');

/**
 * @swagger
 * tags:
 *   name: Mesas
 *   description: Gerenciamento de mesas
 */

/**
 * @swagger
 * /mesa/nova-mesa:
 *   post:
 *     summary: Cria uma nova mesa
 *     tags: [Mesas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *                 example: 1
 *               capacidade:
 *                 type: integer
 *                 example: 4
 *               localizacao:
 *                 type: integer
 *                 example: 1
 *               id_restaurante:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       202:
 *         description: Mesa criada com sucesso
 *       400:
 *         description: Erro ao criar mesa
 */
router.post('/nova-mesa', mesaController.criarMesa);

/**
 * @swagger
 * /mesa/restaurante/{id_restaurante}:
 *   get:
 *     summary: Retorna todas as mesas de um restaurante pelo ID do restaurante
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id_restaurante
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do restaurante
 *     responses:
 *       200:
 *         description: Lista de mesas do restaurante
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_mesa:
 *                     type: integer
 *                   numero:
 *                     type: integer
 *                   capacidade:
 *                     type: integer
 *                   localizacao:
 *                     type: integer
 *                   id_restaurante:
 *                     type: integer
 *                   restaurante:
 *                     type: object
 *                     properties:
 *                       id_restaurante:
 *                         type: integer
 *                       nome_restaurante:
 *                         type: string
 *       404:
 *         description: Nenhuma mesa encontrada para este restaurante
 *       400:
 *         description: Erro ao buscar mesas
 */
router.get('/restaurante/:id_restaurante', mesaController.obterMesasPorRestaurante);

/**
 * @swagger
 * /mesa:
 *   get:
 *     summary: Retorna todas as mesas
 *     tags: [Mesas]
 *     responses:
 *       200:
 *         description: Lista de todas as mesas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_mesa:
 *                     type: integer
 *                   numero:
 *                     type: integer
 *                   capacidade:
 *                     type: integer
 *                   localizacao:
 *                     type: integer
 *                   id_restaurante:
 *                     type: integer
 *                   restaurante:
 *                     type: object
 *                     properties:
 *                       id_restaurante:
 *                         type: integer
 *                       nome_restaurante:
 *                         type: string
 *       400:
 *         description: Erro ao buscar mesas
 */
router.get('/', mesaController.listarMesas);

/**
 * @swagger
 * /mesa/{id}:
 *   get:
 *     summary: Retorna uma mesa pelo ID
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da mesa
 *     responses:
 *       200:
 *         description: Mesa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_mesa:
 *                   type: integer
 *                 numero:
 *                   type: integer
 *                 capacidade:
 *                   type: integer
 *                 localizacao:
 *                   type: integer
 *                 id_restaurante:
 *                   type: integer
 *                 restaurante:
 *                   type: object
 *                   properties:
 *                     id_restaurante:
 *                       type: integer
 *                     nome_restaurante:
 *                       type: string
 *       404:
 *         description: Mesa não encontrada
 *       400:
 *         description: Erro ao buscar mesa
 */
router.get('/:id', mesaController.obterMesa);

/**
 * @swagger
 * /mesa/edit/{id}:
 *   put:
 *     summary: Atualiza uma mesa pelo ID
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da mesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: integer
 *                 example: 1
 *               capacidade:
 *                 type: integer
 *                 example: 4
 *               id_restaurante:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Mesa atualizada com sucesso
 *       404:
 *         description: Mesa não encontrada
 *       400:
 *         description: Erro ao atualizar mesa
 */
router.put('/edit/:id', mesaController.atualizarMesa);

/**
 * @swagger
 * /mesa/delete/{id}:
 *   delete:
 *     summary: Deleta uma mesa pelo ID
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da mesa
 *     responses:
 *       204:
 *         description: Mesa deletada com sucesso
 *       404:
 *         description: Mesa não encontrada
 *       400:
 *         description: Erro ao deletar mesa
 */
router.delete('/delete/:id', mesaController.deletarMesa);

module.exports = router;