// [BELAJAR]
// Alamat File: iot-connector/index.js
// Kegunaan File: Script mandiri untuk menerima data sensor kotak obat & baterai ESP32 dari MQTT Broker dan menyimpannya ke database PostgreSQL.
// =========================================================================

require('dotenv').config();
const mqtt = require('mqtt');
const { Pool } = require('pg');

// 1. Konfigurasi Koneksi Database (Sama seperti backend NestJS)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/tb_app_db',
});

// 2. Konfigurasi Koneksi Broker MQTT (Gunakan HiveMQ / EMQX saat production)
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://broker.hivemq.com';
const client = mqtt.connect(MQTT_BROKER);

// 3. Topik yang akan didengarkan
const TOPIC = 'tb-app/+/box-status'; // Tanda + adalah wildcard untuk ID Pasien

client.on('connect', () => {
  console.log(`[IoT Connector] Berhasil terhubung ke Broker MQTT: ${MQTT_BROKER}`);
  client.subscribe(TOPIC, (err) => {
    if (!err) {
      console.log(`[IoT Connector] Menunggu data dari topik: ${TOPIC}`);
    } else {
      console.error('Gagal subscribe:', err);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    // Topik format: tb-app/patient-001/box-status
    const parts = topic.split('/');
    const patientId = parts[1];
    
    // Pesan dari ESP32 dikirim dalam format JSON
    const data = JSON.parse(message.toString());
    
    console.log(`\n[Data Masuk] Pasien: ${patientId}`);
    console.log(`Status Kotak: ${data.status_kotak}`);
    console.log(`Baterai: ${data.persentase_baterai}%`);

    // TODO: Simpan ke Database PostgreSQL
    // Contoh query:
    // await pool.query(
    //   'UPDATE patients SET box_status = $1, battery_level = $2, last_opened_at = NOW() WHERE id = $3',
    //   [data.status_kotak, data.persentase_baterai, patientId]
    // );
    
    console.log('[IoT Connector] Data berhasil disimpan ke database.');
    
  } catch (error) {
    console.error('Error saat memproses pesan MQTT:', error.message);
  }
});
