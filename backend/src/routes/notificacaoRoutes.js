const express = require('express');
const notificacaoController = require('../controllers/notificacaoController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Access bounded strictly by the authenticated persona parsing JWTs
router.use(authenticate);

router.get('/', notificacaoController.getNotificacoes);
router.put('/:id/lida', notificacaoController.marcarComoLida);

module.exports = router;
