import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('pass1234', 10),
    isAdmin: true,
  },
  {
    name: 'Alex Yufit',
    email: 'alex@email.com',
    password: bcrypt.hashSync('pass1234', 10),
  },
  {
    name: 'Maya',
    email: 'maya@email.com',
    password: bcrypt.hashSync('pass1234', 10),
  },
 {
    name: 'Yoni',
    email: 'yoni@email.com',
    password: bcrypt.hashSync('pass1234', 10),
  },

];

export default users;
