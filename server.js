require('dotenv').config()
const express = require('express')
const logger = require('./logger')

const AppDataSource = require('./src/data-source')
const { Band } = require('./src/entity/Band')
const User = require('./src/entity/User')



const app = express()
app.use(express.json())

// CREATE
app.post('/bandas', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band')
    const band = bandRepo.create(req.body)
    await bandRepo.save(band)
    res.status(201).json(band)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar banda', detalhe: error.message })
  }
})

// READ (todas) + filtro ?aprovada=true|false
app.get('/bandas', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band')
    const { aprovada } = req.query

    let bands
    if (aprovada === 'true' || aprovada === 'false') {
      bands = await bandRepo.find({ where: { approved: aprovada === 'true' } })
    } else {
      bands = await bandRepo.find()
    }

    res.json(bands)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar bandas', detalhe: error.message })
  }
})

// READ (uma)
app.get('/bandas/:id', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band')
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) })

    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' })
    res.json(band)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar banda', detalhe: error.message })
  }
})

// UPDATE
app.put('/bandas/:id', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band')
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) })
    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' })

    bandRepo.merge(band, req.body)
    const updated = await bandRepo.save(band)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar banda', detalhe: error.message })
  }
})

// DELETE
app.delete('/bandas/:id', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band')
    const result = await bandRepo.delete(parseInt(req.params.id))

    if (result.affected === 0)
      return res.status(404).json({ erro: 'Banda não encontrada' })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar banda', detalhe: error.message })
  }
})

// APROVAR (admin)
app.put('/bandas/:id/aprovar', async (req, res) => {
  try {
    const bandRepo = AppDataSource.getRepository('Band')
    const band = await bandRepo.findOneBy({ id: parseInt(req.params.id) })

    if (!band) return res.status(404).json({ erro: 'Banda não encontrada' })

    band.approved = true
    await bandRepo.save(band)
    res.json({ mensagem: `Banda ${band.name} aprovada com sucesso!`, band })
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao aprovar banda', detalhe: error.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`)
})







// === ROTAS USUÁRIO ===


const Album = require("./src/entity/album")

// Listar todos
app.get("/users", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User)
  const users = await userRepo.find()
  res.json(users)
})

// Criar novo
app.post("/users", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User)
  const novoUser = userRepo.create(req.body)
  const resultado = await userRepo.save(novoUser)
  res.status(201).json(resultado)
})

// Atualizar
app.put("/users/:id", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOneBy({ id: parseInt(req.params.id) })
  if (!user) return res.status(404).json({ msg: "Usuário não encontrado" })
  userRepo.merge(user, req.body)
  const resultado = await userRepo.save(user)
  res.json(resultado)
})

// Deletar
app.delete("/users/:id", async (req, res) => {
  const userRepo = AppDataSource.getRepository(User)
  const resultado = await userRepo.delete(req.params.id)
  res.json(resultado)
})




// === ROTAS ÁLBUM ===

// Listar todos
app.get("/albums", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album)
  const albums = await albumRepo.find()
  res.json(albums)
})

// Criar novo
app.post("/albums", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album)
  const novoAlbum = albumRepo.create(req.body)
  const resultado = await albumRepo.save(novoAlbum)
  res.status(201).json(resultado)
})

// Atualizar
app.put("/albums/:id", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album)
  const album = await albumRepo.findOneBy({ id: parseInt(req.params.id) })
  if (!album) return res.status(404).json({ msg: "Álbum não encontrado" })
  albumRepo.merge(album, req.body)
  const resultado = await albumRepo.save(album)
  res.json(resultado)
})

// Deletar
app.delete("/albums/:id", async (req, res) => {
  const albumRepo = AppDataSource.getRepository(Album)
  const resultado = await albumRepo.delete(req.params.id)
  res.json(resultado)
})