const server = require("./api/server.js");

const PORT = process.env.PORT || 5000;

const db = require('./data/dbConfig');
const { response } = require("./api/server.js");

//GET all accounts
server.get('/api', (req, res) => {
  db.select('*')
    .from('accounts')
    .then(response => {
      res.status(200).json({ data: response })
    })
    .catch(error => {
      res.status(500).json({ message: error })
    })
})

//GET account by ID
server.get('/api/:id', (req, res) => {
  const id = Number(req.params.id)
  db.select('*')
    .from('accounts')
    .where({ id: id })
    .first()
    .then(response => {
      res.status(200).json({ data: response })
    })
    .catch(error => {
      res.status(500).json({ message: error })
    })
})

//POST new account
server.post('/api', (req, res) => {
  const { body } = req
  db('accounts')
    .insert(body, "id")
    .then(ids => {
      console.log(ids)
      db('accounts')
        .where({ id: ids[0] })
        .then(response => {
          res.status(201).json({ data: response })
        })
    })
    .catch(error => {
      res.status(500).json({ message: error.message })
    })
})

//DELETE existing account
server.delete('/api/:id', (req, res) => {
  const id = Number(req.params.id)

  db('accounts')
    .where({ id: id })
    .first()
    .then(response => {
      db('accounts')
        .where({ id: id })
        .del()
        .then(resp => {
          if (resp > 0) {
            res.status(201).json({ data: response, message: 'successfully deleted account' })
          } else {
            res.status(404).json({ message: 'account does not exist' })
          }
        })
    })
    .catch(error => {
      console.log(error)
    })

})

//UPDATE existing account
server.put('/api/:id', (req, res) => {
  const id = Number(req.params.id)
  const { body } = req

  db('accounts')
    .where({ id: id })
    .update(body)
    .then(response => {
      if (response > 0) {
        //if successfully update account, query db again and return updated object
        db('accounts')
          .where({ id })
          .then(resp => {
            res.status(200).json({ data: resp, message: 'successfully updated account' })
          })
      } else {
        res.status(404).json({ message: 'could not find account by that id' })
      }
    })
    .catch(error => {
      res.status(500).json({ message: error })
    })

})




server.listen(PORT, () => {
  console.log(`\n== API running on port ${PORT} ==\n`);
});
