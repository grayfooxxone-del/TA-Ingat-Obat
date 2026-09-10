const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:ZSTdpsMvPzDntQyQEqMNDxGkQJqXzZcM@monorail.proxy.rlwy.net:45938/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  await AppDataSource.initialize();
  console.log('DB connected');

  const result = await AppDataSource.query(`
    SELECT s.id, s.time, s."createdAt" as sched_created, e."createdAt" as ev_created 
    FROM schedules s 
    JOIN evidence e ON e."scheduleId" = s.id 
    WHERE s.completed = true
  `);

  console.log(`Found ${result.length} completed schedules with evidence`);

  for (const row of result) {
    const timeParts = row.time.split(':');
    const h = parseInt(timeParts[0]);
    const m = parseInt(timeParts[1]);

    const schedDate = new Date(row.sched_created);
    const wibOffsetMs = 7 * 60 * 60 * 1000;
    schedDate.setUTCHours(0, 0, 0, 0);
    schedDate.setTime(schedDate.getTime() + h * 3600000 + m * 60000 - wibOffsetMs);

    const uploadDate = new Date(row.ev_created);
    const diffMins = (uploadDate.getTime() - schedDate.getTime()) / 60000;

    let status = 'Terlambat';
    if (diffMins <= 30 && diffMins >= -60) {
      status = 'Tepat Waktu';
    }

    console.log(`Schedule ID ${row.id}: diffMins=${diffMins.toFixed(2)}, new status=${status}`);
    await AppDataSource.query(`UPDATE schedules SET status = $1 WHERE id = $2`, [status, row.id]);
  }

  console.log('Done');
  process.exit(0);
}

run().catch(console.error);
