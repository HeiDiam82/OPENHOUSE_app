const express = require('express');
const cors = require('express');
const dotenv = require('dotenv');
const recordsRouter = require('./routes/records');

dotenv.config();

const app = express();
const corsMiddleware = require('cors');

app.use(corsMiddleware());
app.use(express.json());

app.use('/api/records', recordsRouter);

app.get('/', (req, res) => {
  res.send('Rubik Timer API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
