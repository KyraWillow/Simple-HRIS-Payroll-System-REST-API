// tests/mocks/UserRepositoryMock.js
class UserRepositoryMock {
  constructor() {
    this.users = [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'employee',
        base_salary: 5000000,
        join_date: new Date()
      },
      {
        id: 2,
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashed_password',
        role: 'hr_admin',
        base_salary: 8000000,
        join_date: new Date()
      }
    ];
  }

  async findByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  async create(userData) {
    const newUser = { 
      id: this.users.length + 1, 
      ...userData 
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id, userData) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return this.users[index];
    }
    return null;
  }

  async findAll() {
    return this.users;
  }
}

module.exports = UserRepositoryMock;