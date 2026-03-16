import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@archlabs.com'
  const password = 'ArchLabs2024!'

  const existing = await prisma.admin.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin already exists')
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const admin = await prisma.admin.create({
    data: { email, password: hashedPassword }
  })

  console.log('Admin created successfully!')
  console.log('Email:', admin.email)
  console.log('Password: ArchLabs2024!')
  console.log('Change your password after first login!')
  process.exit(0)
}

createAdmin().catch((error) => {
  console.error('Failed to create admin:', error.message)
  process.exit(1)
})
