const db = require('../config/db.config')

exports.create = (req, res) => {
  const { barcode, name, price, stock } = req.body
  if (!barcode || !name || !price || !stock) {
    res.status(400).send({ message: 'data yang dimasukkan tidak lengkap' })
    return
  }

  db.query(
    'INSERT INTO products (barcode, name, price, stock) VALUES (?, ?, ?, ?)',
    [barcode, name, price, stock],
    (err, result) => {
      if (err) res.status(500).send({ message: err.message })

      res.send({
        message: 'produk berhasil ditambahkan',
      })
    }
  )
}

exports.findAll = (req, res) => {
  const { barcode, name } = req.query

  let sql = 'SELECT * FROM products'

  if (barcode !== undefined) {
    sql += ` WHERE barcode LIKE ?`
  } else if (name !== undefined) {
    sql += ` WHERE name LIKE ?`
  }

  db.query(sql, [`%${barcode || name}%`], (err, result) => {
    if (err) res.status(500).send({ message: err.message })

    res.send({
      data: result,
    })
  })
}

exports.findById = (req, res) => {
  const id = req.params.id

  db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
    if (err) res.status(500).send({ message: err.message })

    if (result.length === 0) {
      res.status(404).send({ message: 'produk tidak ditemukan' })
      return
    }
    res.send({
      data: result[0],
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id
  const { barcode, name, price, stock } = req.body

  db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
    if (err) res.status(500).send({ message: err.message })

    if (result.length === 0) {
      res.status(404).send({ message: 'produk tidak ditemukan' })
      return
    }

    if (barcode !== undefined) {
      db.query(
        `UPDATE products SET barcode = ? WHERE id = ?`,
        [barcode, id],
        (err) => {
          if (err) res.status(500).send({ message: err.message })
        }
      )
    }
    if (name !== undefined) {
      db.query(
        `UPDATE products SET name = ? WHERE id = ?`,
        [name, id],
        (err) => {
          if (err) res.status(500).send({ message: err.message })
        }
      )
    }
    if (price !== undefined) {
      db.query(
        `UPDATE products SET price = ? WHERE id = ?`,
        [price, id],
        (err) => {
          if (err) res.status(500).send({ message: err.message })
        }
      )
    }
    if (stock !== undefined) {
      db.query(
        `UPDATE products SET stock = ? WHERE id = ?`,
        [stock, id],
        (err) => {
          if (err) res.status(500).send({ message: err.message })
        }
      )
    }

    res.send({
      message: 'data berhasil diupdate',
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id

  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) res.status(500).send({ message: err.message })
    
    if (result.length === 0) {
      res.status(404).send({ message: 'produk tidak ditemukan' })
      return
    }
    res.send({
      message: 'produk berhasil dihapus',
    })
  })
}
