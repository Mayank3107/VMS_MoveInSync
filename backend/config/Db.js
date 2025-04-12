const mongoose = require('mongoose');

const connect = async (URL) => {
  await mongoose.connect(URL)
    .then(() => {
      console.log('Database is connected');
    })
    .catch((error) => {
      console.log('There is something wrong in connection with database:', error);
    });
};

module.exports = connect;
