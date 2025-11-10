require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect'); // <-- adicione esta linha
const logger = require('./logger');
const AppDataSource = require('./src/data-source');
const { Band } = require('./src/entity/Band');
const User = require('./src/entity/User');
const Album = require("./src/entity/album");
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();
app.use(express.json());



// ===== CONFIGURAÇÃO AUTH0 =====
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

app.use(auth(config));

// ===== ROTA DE TESTE AUTH0 =====
app.get('/teste', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Autenticação Auth0 funcionando!' : 'Não logado');
});



// ===== CONFIGURAÇÃO KEYCLOAK =====
// const memoryStore = new session.MemoryStore();
/* 
app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": process.env.KEYCLOAK_REALM,
  "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL,
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_CLIENT_ID,
  "credentials": {
    "secret": process.env.KEYCLOAK_CLIENT_SECRET
  },
  "confidential-port": 0
});

app.use(keycloak.middleware());

// rota de teste
const canViewRotaTeste = keycloak.enforcer('view', { resource: 'rota-teste' });
app.get('/teste', canViewRotaTeste, (req, res) => {
  res.send('Autenticação Keycloak funcionando!');
}); */





// ===== CRUD BANDAS =====
app.post('/bandas', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band');
    const band = bandRepo.create(req.body);
    await bandRepo.save(band);
    res.status(201).json(band);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar banda', detalhe: error.message });
  }
});

app.get('/bandas', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band');
    const { aprovada } = req.query;

    let bands;
    if (aprovada === 'true' || aprovada === 'false') {
      bands = await bandRepo.find({ where: { approved: aprovada === 'true' } });
    } else {
      bands = await bandRepo.find();
    }

    res.json(bands);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar bandas', detalhe: error.message });
  }
});

app.get('/bandas/:id', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band');
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' });
    res.json(band);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar banda', detalhe: error.message });
  }
});

app.put('/bandas/:id', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band');
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' });

    bandRepo.merge(band, req.body);
    const updated = await bandRepo.save(band);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar banda', detalhe: error.message });
  }
});

app.delete('/bandas/:id', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band');
    const result = await bandRepo.delete(parseInt(req.params.id));

    if (result.affected === 0)
      return res.status(404).json({ erro: 'Banda não encontrada' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar banda', detalhe: error.message });
  }
});

app.put('/bandas/:id/aprovar', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band');
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' });

    band.approved = true;
    await bandRepo.save(band);
    res.json({ mensagem: `Banda ${band.name} aprovada com sucesso!`, band });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao aprovar banda', detalhe: error.message });
  }
});

// ===== CRUD USUÁRIOS =====
app.get("/users", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const novoUser = userRepo.create(req.body);
  const resultado = await userRepo.save(novoUser);
  res.status(201).json(resultado);
});

app.put("/users/:id", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: parseInt(req.params.id) });
  if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });
  userRepo.merge(user, req.body);
  const resultado = await userRepo.save(user);
  res.json(resultado);
});

app.delete("/users/:id", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User);
  const resultado = await userRepo.delete(req.params.id);
  res.json(resultado);
});

// ===== CRUD ÁLBUNS =====
app.get("/albums", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album);
  const albums = await albumRepo.find();
  res.json(albums);
});

app.post("/albums", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album);
  const novoAlbum = albumRepo.create(req.body);
  const resultado = await albumRepo.save(novoAlbum);
  res.status(201).json(resultado);
});

app.put("/albums/:id", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album);
  const album = await albumRepo.findOneBy({ id: parseInt(req.params.id) });
  if (!album) return res.status(404).json({ msg: "Álbum não encontrado" });
  albumRepo.merge(album, req.body);
  const resultado = await albumRepo.save(album);
  res.json(resultado);
});

app.delete("/albums/:id", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album);
  const resultado = await albumRepo.delete(req.params.id);
  res.json(resultado);
});

// ===== ROTA PADRÃO =====
app.get('/', (req, res) => {
  res.send('Servidor ativo! Use /teste para verificar autenticação.');
});

// ===== INICIALIZAÇÃO =====
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});




