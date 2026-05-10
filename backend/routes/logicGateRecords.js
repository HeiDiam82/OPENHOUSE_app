const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET top 10 logic gate records ordered by time_ms ascending
router.get('/', async (req, res) => {
  try {
    const records = await prisma.logicGateRecord.findMany({
      take: 10,
      orderBy: { time_ms: 'asc' },
    });
    res.json(records);
  } catch (error) {
    console.error("Error fetching logic gate records:", error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// POST a new logic gate record
router.post('/', async (req, res) => {
  const { participant_name, time_ms } = req.body;
  if (!participant_name || typeof time_ms !== 'number') {
    return res.status(400).json({ error: 'Invalid data.' });
  }
  try {
    const newRecord = await prisma.logicGateRecord.create({
      data: { participant_name, time_ms },
    });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error saving logic gate record:", error);
    res.status(500).json({ error: 'Failed to save record' });
  }
});

module.exports = router;
