const db = require('../config/db.config')

exports.create = (req, res) => {
  const { total, paymentMethod, products } = req.body
  if (!total || !paymentMethod || !products) {
    res.status(400).send({ message: 'data yang dimasukkan tidak lengkap' })
    return
  }

  db.query(
    'INSERT INTO transactions (total, paymentMethod) VALUES (?, ?)',
    [total, paymentMethod],
    (err, result) => {
      if (err) {
        res.status(500).send({ message: err.message })
        return
      }

      products.map((product) => {
        db.query(
          'INSERT INTO transaction_items (transactionId, productId, count) VALUES (?, ?, ?)',
          [result.insertId, product.id, product.count]
        )

        db.query(
          'SELECT stock FROM products WHERE id = ?',
          [product.id],
          (err, result) => {
            db.query('UPDATE products SET stock = ? WHERE id = ?', [
              result[0].stock - product.count,
              product.id,
            ])
          }
        )
      })

      res.send({
        message: 'transaksi berhasil ditambahkan',
      })
    }
  )
}

exports.findAll = (req, res) => {
  const { startDate, endDate } = req.query

  let sql =
    'SELECT transactions.id, transactions.total, transactions.paymentMethod, transactions.createdAt, products.barcode, products.name, products.price, transaction_items.count ' +
    'FROM transaction_items JOIN transactions ON transaction_items.transactionId = transactions.id JOIN products ON transaction_items.productId = products.id '

  if (startDate !== undefined) {
    sql += `WHERE transactions.createdAt >= '${startDate}'`
    if (endDate !== undefined) {
      sql += `AND transactions.createdAt <= '${endDate}'`
    }
  } else {
    if (endDate !== undefined) {
      sql += `WHERE transactions.createdAt <= '${endDate}'`
    }
  }

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message })
      return
    }

    if (result.length === 0) {
      res.send({
        data: [],
      })
      return
    }

    const data = [{ id: 0 }]
    result.map((r) => {
      if (data[data.length - 1].id !== r.id) {
        if (data[0].id === 0) data.pop()
        data.push({
          id: r.id,
          total: r.total,
          paymentMethod: r.paymentMethod,
          createdAt: r.createdAt,
          products: [
            {
              barcode: r.barcode,
              name: r.name,
              price: r.price,
              count: r.count,
            },
          ],
        })
      } else {
        data[data.length - 1].products.push({
          barcode: r.barcode,
          name: r.name,
          price: r.price,
          count: r.count,
        })
      }
    })

    res.send({
      data: data,
    })
  })
}

exports.findById = (req, res) => {
  const id = req.params.id

  db.query(
    `SELECT * FROM transaction_items JOIN transactions ON transaction_items.transactionId = transactions.id JOIN products ON transaction_items.productId = products.id WHERE transactionId = '${id}'`,
    [id],
    (err, result) => {
      if (err) {
        res.status(500).send({ message: err.message })
        return
      }

      if (result.length === 0) {
        res.status(404).send({ message: 'transaksi tidak ditemukan' })
        return
      }

      const data = {
        id: result[0].transactionId,
        total: result[0].total,
        paymentMethod: result[0].paymentMethod,
        createdAt: result[0].createdAt,
        products: [],
      }

      result.map((r) => {
        data.products.push({
          barcode: r.barcode,
          name: r.name,
          price: r.price,
          count: r.count,
        })
      })

      res.send({
        data: data,
      })
    }
  )
}
