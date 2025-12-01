require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const session = require('express-session');
const logger = require('./logger');
const AppDataSource = require('./src/data-source');
const { Band } = require('./src/entity/Band');
const User = require('./src/entity/User');
const Album = require("./src/entity/album");

const app = express();
app.use(express.json());

// ===== SESSÃO =====
app.use(session({
  secret: 'melodeathmaster_secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// ===== CONFIGURAÇÃO GOOGLE OAUTH =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

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

// ===== TESTE DE AUTENTICAÇÃO =====
app.get('/teste', (req, res) => {
  res.send(req.oidc?.isAuthenticated()
    ? 'Autenticação funcionando (Auth0 ou Google)!'
    : 'Não logado');
});

// ===== CRUD BANDAS =====
app.post('/bandas', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository(Band);
    const band = bandRepo.create(req.body);
    await bandRepo.save(band);
    res.status(201).json(band);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar banda', detalhe: error.message });
  }
});

app.get('/bandas', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository(Band);
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

app.put('/bandas/:id/aprovar', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository(Band);
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' });

    band.approved = true;
    await bandRepo.save(band);
    res.json({ mensagem: `Banda ${band.name} aprovada com sucesso!`, band });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao aprovar banda', detalhe: error.message });
  }
});

// ===== CRUD USERS =====
app.get('/users', async (req, res) => {
  const repo = AppDataSource.getRepository(User);
  const users = await repo.find();
  res.json(users);
});

// ===== CRUD ALBUMS =====
app.get('/albums', async (req, res) => {
  const repo = AppDataSource.getRepository(Album);
  const albums = await repo.find();
  res.json(albums);
});

// ===== HOME =====
app.get('/', (req, res) => {
  res.send('Servidor ativo! Use /auth/google para testar login com Google.');
});

// ===== INICIALIZAÇÃO =====
const port = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    console.log("DB OK");
    app.listen(port, () => logger.info(`Servidor rodando na porta ${port}`));
  })
  .catch(err => console.error("Erro ao iniciar DB:", err));
