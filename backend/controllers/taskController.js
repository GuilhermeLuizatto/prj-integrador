const { pool } = require('../config/db')

const VALID_STATUSES = ['todo', 'in_progress', 'done']

async function createTask(req, res) {
  try {
    const { title, description, points = 10, deadline, assignee_id } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }
    if (!assignee_id) {
      return res.status(400).json({ error: 'Responsável é obrigatório' })
    }

    // Validar assignee (pode ser o próprio gestor ou um subordinado)
    const assigneeResult = await pool.query('SELECT id, gestor_id FROM users WHERE id = $1', [assignee_id])
    const assignee = assigneeResult.rows[0]

    if (!assignee || (assignee.id !== req.user.id && assignee.gestor_id !== req.user.id)) {
      return res.status(403).json({ error: 'Você só pode atribuir tarefas a si mesmo ou aos seus subordinados' })
    }

    const insertResult = await pool.query(
      `INSERT INTO tasks (title, description, points, deadline, assignee_id, created_by, gestor_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'todo')
       RETURNING id, title, description, status, points, deadline, assignee_id, created_by, gestor_id, created_at, updated_at`,
      [title, description || null, points, deadline || null, assignee_id, req.user.id, req.user.id]
    )

    return res.status(201).json({
      message: 'Tarefa criada com sucesso',
      task: insertResult.rows[0],
    })
  } catch (error) {
    console.error('createTask error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function getTasks(req, res) {
  try {
    const { id: userId, nivel } = req.user

    const whereClause = nivel >= 2 ? 't.gestor_id = $1' : 't.assignee_id = $1'

    const result = await pool.query(
      `SELECT
         t.*,
         u.name  AS assignee_name,
         u.email AS assignee_email,
         u.role  AS assignee_role
       FROM tasks t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE ${whereClause}
       ORDER BY t.created_at DESC`,
      [userId]
    )

    return res.status(200).json({ tasks: result.rows })
  } catch (error) {
    console.error('getTasks error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Status inválido. Use: todo, in_progress ou done' })
    }

    const taskResult = await pool.query('SELECT id, assignee_id, gestor_id FROM tasks WHERE id = $1', [id])
    const task = taskResult.rows[0]

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    if (req.user.nivel === 1 && task.assignee_id !== req.user.id) {
      return res.status(403).json({ error: 'Você só pode alterar o status das suas próprias tarefas' })
    }

    if (req.user.nivel >= 2 && task.gestor_id !== req.user.id) {
      return res.status(403).json({ error: 'Você só pode alterar o status das tarefas da sua equipe' })
    }

    const updated = await pool.query(
      'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status, updated_at',
      [status, id]
    )

    return res.status(200).json({ message: 'Status atualizado com sucesso', task: updated.rows[0] })
  } catch (error) {
    console.error('updateTaskStatus error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params
    const { title, description, points, deadline, assignee_id } = req.body

    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id])
    const task = taskResult.rows[0]

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    if (task.gestor_id !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para editar esta tarefa' })
    }

    if (assignee_id) {
      const assigneeResult = await pool.query('SELECT id, gestor_id FROM users WHERE id = $1', [assignee_id])
      const assignee = assigneeResult.rows[0]

      if (!assignee || (assignee.id !== req.user.id && assignee.gestor_id !== req.user.id)) {
        return res.status(403).json({ error: 'Você só pode atribuir tarefas a si mesmo ou aos seus subordinados' })
      }
    }

    const updates = []
    const values = []
    let idx = 1

    if (title !== undefined) {
      updates.push(`title = $${idx}`)
      values.push(title)
      idx++
    }
    if (description !== undefined) {
      updates.push(`description = $${idx}`)
      values.push(description)
      idx++
    }
    if (points !== undefined) {
      updates.push(`points = $${idx}`)
      values.push(points)
      idx++
    }
    if (deadline !== undefined) {
      updates.push(`deadline = $${idx}`)
      values.push(deadline)
      idx++
    }
    if (assignee_id !== undefined) {
      updates.push(`assignee_id = $${idx}`)
      values.push(assignee_id)
      idx++
    }

    if (updates.length === 0) {
      return res.status(200).json({ message: 'Tarefa atualizada com sucesso', task: { id: Number(id) } })
    }

    updates.push(`updated_at = NOW()`)

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, title, points, updated_at`
    values.push(id)

    const updated = await pool.query(query, values)

    return res.status(200).json({ message: 'Tarefa atualizada com sucesso', task: updated.rows[0] })
  } catch (error) {
    console.error('updateTask error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params

    const taskResult = await pool.query('SELECT id, gestor_id FROM tasks WHERE id = $1', [id])
    const task = taskResult.rows[0]

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    if (task.gestor_id !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir esta tarefa' })
    }

    await pool.query('DELETE FROM tasks WHERE id = $1', [id])
    return res.status(200).json({ message: 'Tarefa excluída com sucesso' })
  } catch (error) {
    console.error('deleteTask error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
}
