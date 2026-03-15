const express = require('express')
const {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require('../controllers/taskController')
const { verifyToken, requireLevel } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(verifyToken)

router.post('/', requireLevel(2), createTask)
router.get('/', requireLevel(1), getTasks)
router.patch('/:id/status', requireLevel(1), updateTaskStatus)
router.put('/:id', requireLevel(2), updateTask)
router.delete('/:id', requireLevel(2), deleteTask)

module.exports = router
