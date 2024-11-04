// routes/restaurante.js
const express = require("express");
const router = express.Router();
const restauranteController = require("../controller/restauranteController");
const { uploadFields } = require("../helpers/img-uploader");

/**
 * @swagger
 * tags:
 *   name: Restaurantes
 *   description: Gerenciamento de restaurantes
 */

/**
 * @swagger
 * /restaurante/cadastrar:
 *   post:
 *     summary: Cria um novo restaurante
 *     tags: [Restaurantes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nif:
 *                 type: string
 *                 example: "123456789"
 *               nome_restaurante:
 *                 type: string
 *                 example: "Restaurante Exemplo"
 *               ibam:
 *                 type: string
 *                 example: "123456"
 *               website:
 *                 type: string
 *                 example: "http://exemplo.com"
 *               facebook:
 *                 type: string
 *                 example: "http://facebook.com/exemplo"
 *               logo:
 *                 type: string
 *                 format: binary
 *               capa:
 *                 type: string
 *                 format: binary
 *               instagram:
 *                 type: string
 *                 example: "http://instagram.com/exemplo"
 *               telefone1:
 *                 type: string
 *                 example: "123456789"
 *               telefone2:
 *                 type: string
 *                 example: "987654321"
 *               morada:
 *                 type: string
 *                 example: "Rua Exemplo, 123"
 *               codigo_postal:
 *                 type: string
 *                 example: "12345-678"
 *               id_user:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       202:
 *         description: Restaurante cadastrado com sucesso
 *       500:
 *         description: Erro ao criar restaurante
 */
router.post("/cadastrar", uploadFields, restauranteController.criarRestaurante);

/**
 * @swagger
 * /restaurante:
 *   get:
 *     summary: Retorna todos os restaurantes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_restaurante:
 *                     type: integer
 *                   nif:
 *                     type: string
 *                   nome_restaurante:
 *                     type: string
 *                   ibam:
 *                     type: string
 *                   website:
 *                     type: string
 *                   facebook:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   capa:
 *                     type: string
 *                   instagram:
 *                     type: string
 *                   telefone1:
 *                     type: string
 *                   telefone2:
 *                     type: string
 *                   morada:
 *                     type: string
 *                   codigo_postal:
 *                     type: string
 *                   qrcode:
 *                     type: string
 *                   id_user:
 *                     type: integer
 *       500:
 *         description: Erro ao buscar restaurantes
 */
router.get("/", restauranteController.buscarTodos);

/**
 * @swagger
 * /restaurante/geral/{id_restaurante}:
 *   get:
 *     summary: Retorna um restaurante com pratos pelo ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id_restaurante
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do restaurante
 *     responses:
 *       200:
 *         description: Restaurante com pratos encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_restaurante:
 *                   type: integer
 *                 nome_restaurante:
 *                   type: string
 *                 pratos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_pratos:
 *                         type: integer
 *                       nome_prato:
 *                         type: string
 *                       fotos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id_foto:
 *                               type: integer
 *                             url_foto:
 *                               type: string
 *       404:
 *         description: Restaurante não encontrado
 *       500:
 *         description: Erro ao buscar restaurante
 */

router.get("/:id", restauranteController.buscarRestaurantePorId);

/**
 * @swagger
 * /restaurante/delete/{id_restaurante}:
 *   delete:
 *     summary: Deleta um restaurante pelo ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id_restaurante
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do restaurante
 *     responses:
 *       200:
 *         description: Restaurante deletado com sucesso
 *       404:
 *         description: Restaurante não encontrado
 *       500:
 *         description: Erro ao deletar restaurante
 */
router.delete(
  "/delete/:id_restaurante",
  restauranteController.deletarRestaurante
);

router.get("/busca", restauranteController.buscarLocaisRestaurante);

module.exports = router;
