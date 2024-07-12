// routes/pratos.js
const express = require("express");
const router = express.Router();
const pratoController = require("../controller/pratosController");
const { uploadArray } = require("../helpers/img-uploader");

/**
 * @swagger
 * tags:
 *   name: Pratos
 *   description: Gerenciamento de pratos
 */

/**
 * @swagger
 * /pratos/cadastrar:
 *   post:
 *     summary: Cria um novo prato
 *     tags: [Pratos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_prato:
 *                 type: string
 *                 example: "Principal"
 *               titulo:
 *                 type: string
 *                 example: "Feijoada"
 *               descricao:
 *                 type: string
 *                 example: "Uma deliciosa feijoada"
 *               valor:
 *                 type: number
 *                 format: decimal
 *                 example: 25.50
 *               taxa_ondish:
 *                 type: number
 *                 format: decimal
 *                 example: 2.50
 *               id_cozinha:
 *                 type: integer
 *                 example: 1
 *               id_restaurante:
 *                 type: integer
 *                 example: 1
 *               opcoes:
 *                 type: string
 *                 example: '[{"titulo": "Sem cebola", "tipo": "personalizacao", "valorAdicional": 0.00}]'
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Prato criado com sucesso
 *       500:
 *         description: Erro ao criar prato
 */
router.post(
  "/cadastrar",
  uploadArray,
  (req, res, next) => {
    next();
  },
  pratoController.criarPratos
);

/**
 * @swagger
 * /pratos/buscar/{id}:
 *   get:
 *     summary: Retorna os pratos de um restaurante pelo ID
 *     tags: [Pratos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do restaurante
 *     responses:
 *       200:
 *         description: Lista de pratos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pratos:
 *                     type: integer
 *                   tipo_prato:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   valor:
 *                     type: number
 *                     format: decimal
 *                   taxa_ondish:
 *                     type: number
 *                     format: decimal
 *                   id_cozinha_restaurante:
 *                     type: integer
 *                   id_restaurante:
 *                     type: integer
 *                   prato_do_dia:
 *                     type: integer
 *                   opcoes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_opcao:
 *                           type: integer
 *                         titulo:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                         valorAdicional:
 *                           type: number
 *                           format: decimal
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_foto:
 *                           type: integer
 *                         foto:
 *                           type: string
 *       404:
 *         description: Prato não encontrado
 *       500:
 *         description: Erro ao buscar prato
 */
router.get("/buscar/:id", pratoController.buscarPratoPorId);

/**
 * @swagger
 * /pratos/prato-do-dia:
 *   put:
 *     summary: Atualiza o prato do dia
 *     tags: [Pratos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pratos:
 *                 type: integer
 *                 example: 1
 *               prato_do_dia:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Prato do dia atualizado com sucesso
 *       404:
 *         description: Prato não encontrado
 *       500:
 *         description: Erro ao atualizar prato do dia
 */
router.put('/prato-do-dia', pratoController.atualizarPratoDoDia);

/**
 * @swagger
 * /pratos/deletar/{id_pratos}:
 *   delete:
 *     summary: Deleta um prato pelo ID
 *     tags: [Pratos]
 *     parameters:
 *       - in: path
 *         name: id_pratos
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do prato
 *     responses:
 *       200:
 *         description: Prato deletado com sucesso
 *       404:
 *         description: Prato não encontrado
 *       500:
 *         description: Erro ao deletar prato
 */
router.delete('/deletar/:id_pratos', pratoController.deletarPrato);

module.exports = router;