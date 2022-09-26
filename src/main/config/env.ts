export default {
  jwtSecret: process.env.JWT_SECRET || 'petloveServerPass',
  databaseUrl: process.env.DATABASE_URL
}
