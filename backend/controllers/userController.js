const { pool } = require('../config/db')
const bcrypt = require('bcryptjs')

async function getUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, position, points, manager_id AS "managerId" FROM users'
    )
    return res.status(200).json(result.rows)
  } catch (error) {
    console.error('getUsers error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function deleteUserById(req, res) {
  try {
    const { id } = req.params

    const userResult = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [id])
    const user = userResult.rows[0]

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const adminEmail = 'ana@azis.com'
    if (user.email.toLowerCase() === adminEmail.toLowerCase()) {
      return res.status(400).json({ error: 'Não é permitido excluir o administrador' })
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id])
    return res.status(200).json({ message: 'Usuário excluído com sucesso' })
  } catch (error) {
    console.error('deleteUserById error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function clearOrganization(req, res) {
  try {
    const adminEmail = 'ana@azis.com'
    await pool.query(
      'UPDATE users SET manager_id = NULL WHERE LOWER(email) <> LOWER($1)',
      [adminEmail]
    )

    return res.status(200).json({ message: 'Estrutura organizacional limpa com sucesso' })
  } catch (error) {
    console.error('clearOrganization error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function createUsers(req, res) {
  try {
    const users = req.body // array of users

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ error: 'Lista de usuários inválida' })
    }

    // Remove duplicated emails already persisted in the database (keep one record per email)
    await pool.query(`
      WITH ranked AS (
        SELECT id, LOWER(email) AS email_lower,
               ROW_NUMBER() OVER (PARTITION BY LOWER(email) ORDER BY id) AS rn
        FROM users
      )
      DELETE FROM users WHERE id IN (SELECT id FROM ranked WHERE rn > 1)
    `)

    const createdUsers = []
    const errors = []

    // Pre-fetch existing users to prevent duplicates
    const emailList = users
      .map((u) => (u.email || '').toString().trim().toLowerCase())
      .filter(Boolean)

    const existingRows = emailList.length
      ? await pool.query('SELECT id, email FROM users WHERE LOWER(email) = ANY($1)', [emailList])
      : { rows: [] }

    const existingByEmail = new Map(existingRows.rows.map((r) => [r.email.toLowerCase(), r.id]))
    const seenEmails = new Set()

    for (const userData of users) {
      try {
        const { __row, name, email, role, position, managerEmail, managerId, points } = userData
        const row = __row ?? null
        const emailLower = (email || '').toString().trim().toLowerCase()

        if (!name || !emailLower) {
          errors.push({ row, email: email || null, error: 'Nome e email obrigatórios' })
          continue
        }

        // Skip duplicates in the import payload
        if (seenEmails.has(emailLower)) {
          errors.push({ row, email, error: 'Duplicado na planilha' })
          continue
        }
        seenEmails.add(emailLower)

        // Do not create a user if it already exists
        if (existingByEmail.has(emailLower)) {
          errors.push({ row, email, error: 'Usuário já existe' })
          continue
        }

        // Generate default password
        const defaultPassword = '123456'
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)

        const insertResult = await pool.query(
          'INSERT INTO users (name, email, role, position, manager_id, points, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, position, manager_id AS "managerId", points',
          [name, email, role || 'member', position || null, managerId || null, points || 0, hashedPassword]
        )
        createdUsers.push({ ...insertResult.rows[0], managerEmail })
      } catch (err) {
        console.error('Error creating user:', err)
        errors.push({ email: userData.email, error: err.message })
      }
    }

    // Hierarquia já resolvida pelo frontend

    return res.status(201).json({
      message: 'Usuários processados',
      created: createdUsers.length,
      errors: errors.length > 0 ? errors : undefined,
      users: createdUsers
    })
  } catch (error) {
    console.error('createUsers error:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

module.exports = {
  getUsers,
  createUsers,
  deleteUserById,
  clearOrganization,
}