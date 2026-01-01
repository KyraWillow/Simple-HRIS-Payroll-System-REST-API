// tests/fixtures/users.fixture.js
const validUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  role: 'employee',
  base_salary: 5000000,
  join_date: new Date()
};

const validAdmin = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'hashed_password',
  role: 'hr_admin',
  base_salary: 8000000,
  join_date: new Date()
};

const invalidUser = {
  id: 3,
  name: 'Invalid User',
  email: 'invalid-email', // Invalid email format
  password: 'short', // Too short
  role: 'employee'
};

module.exports = {
  validUser,
  validAdmin,
  invalidUser
};