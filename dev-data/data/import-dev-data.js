const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

dotenv.config({ path: `${__dirname}/../../config.env` }); // need to do this before requiring other modules
const Prod = require('../../models/prodModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection successful: ', con.connection.host);
  });

const prods = fs.readFileSync(`${__dirname}/prods-simple.json`, 'utf-8');
const data = JSON.parse(prods);

const importData = async () => {
  try {
    await Prod.create(data);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// Delete all data from collection
const deleteData = async () => {
  try {
    await Prod.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
