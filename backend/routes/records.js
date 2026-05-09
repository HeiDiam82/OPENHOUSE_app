const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get leaderboard (top 10 records ordered by time_ms ascending)
router.get('/', async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      take: 10,
      orderBy: {
        time_ms: 'asc',
      },
    });
    res.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Create a new record
router.post('/', async (req, res) => {
  const { participant_name, time_ms } = req.body;

  if (!participant_name || typeof time_ms !== 'number') {
    return res.status(400).json({ error: 'Invalid data. participant_name and time_ms are required.' });
  }

  try {
    const newRecord = await prisma.record.create({
      data: {
        participant_name,
        time_ms,
      },
    });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).json({ error: 'Failed to save record' });
  }
});

module.exports = router;
