const bcrypt = require('bcryptjs');
bcrypt.hash('test1234', 10).then(h => {
  console.log('New hash:', h);
});
