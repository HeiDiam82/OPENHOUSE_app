const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const corsMiddleware = require('cors');
const binaryRecordsRouter = require('./routes/binaryRecords');
const logicGateRecordsRouter = require('./routes/logicGateRecords');

const app = express();
app.use(corsMiddleware());
app.use(express.json());

app.use('/api/binary-records', binaryRecordsRouter);
app.use('/api/logic-gate-records', logicGateRecordsRouter);

app.get('/', (req, res) => {
  res.send('RISTEK Games Timer API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
