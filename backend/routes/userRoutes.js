const express = require('express')
const { getUsers, createUsers, deleteUserById, deleteAllUsers, clearOrganization } = require('../controllers/userController')

const router = express.Router()

router.get('/', getUsers)
router.post('/', createUsers)
router.delete('/structure', clearOrganization)
router.delete('/:id', deleteUserById)

module.exports = router