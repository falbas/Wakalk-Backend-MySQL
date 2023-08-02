module.exports = (app) => {
  const product = require('../controllers/product.controller')
  const r = require('express').Router()

  r.post('/', product.create)
  r.get('/', product.findAll)
  r.get('/:id', product.findById)
  r.put('/:id', product.update)
  r.delete('/:id', product.delete)

  app.use('/products', r)
}
