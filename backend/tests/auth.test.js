/**
 * Testes de integração: rotas de autenticação (login, registo).
 * Requer base de dados de teste e seed com utilizador.
 */
const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('deve rejeitar sem body', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'naoexiste@test.com', password: '123', tipo: 'cliente' });
      expect([400, 401]).toContain(res.status);
    });
  });

  describe('GET /health', () => {
    it('deve retornar 200 e status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
