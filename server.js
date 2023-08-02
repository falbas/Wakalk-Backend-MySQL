require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8000

const corsOption = {
  origin: '*',
}

app.use(cors(corsOption))
app.use(express.json())

require('./app/routes/product.routes')(app)
require('./app/routes/transaction.routes')(app)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
