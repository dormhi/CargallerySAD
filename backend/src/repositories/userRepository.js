/**
 * User Repository
 * Database operations for the User model
 */
const prisma = require('../config/database');

const userRepository = {
  async findById(id) {
    return prisma.user.findUnique({ where: { id: Number(id) } });
  },

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data) {
    return prisma.user.create({ data });
  },

  async updateBalance(id, balance) {
    return prisma.user.update({
      where: { id: Number(id) },
      data: { balance },
    });
  },

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true, name: true, email: true, phone: true,
        balance: true, role: true, createdAt: true,
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

module.exports = userRepository;
