import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'greentech.db');

console.log('🚀 Inicializando base de datos SQLite...');

// Eliminar BD existente si existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Base de datos anterior eliminada');
}

// Crear nueva BD
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
});

// Leer y ejecutar schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
const statements = schema.split(';').filter(s => s.trim());

console.log(`📝 Ejecutando ${statements.length} sentencias SQL...`);

let current = 0;

const executeNext = () => {
  if (current >= statements.length) {
    // Verificar datos
    console.log('\n✨ Base de datos inicializada correctamente');
    
    db.all('SELECT COUNT(*) as count FROM users', (err, result) => {
      if (!err) console.log(`📊 Usuarios: ${result[0].count}`);
      
      db.all('SELECT COUNT(*) as count FROM alerts', (err, result) => {
        if (!err) console.log(`📊 Alertas: ${result[0].count}`);
        
        db.all('SELECT COUNT(*) as count FROM kpis', (err, result) => {
          if (!err) console.log(`📊 KPIs: ${result[0].count}`);
          console.log(`\n📁 Base de datos ubicada en: ${dbPath}`);
          db.close();
        });
      });
    });
    return;
  }
  
  const statement = statements[current].trim();
  if (statement) {
    db.exec(statement, (err) => {
      if (err) {
        console.error(`❌ Error en sentencia ${current + 1}: ${err.message}`);
      } else {
        console.log(`✓ Sentencia ${current + 1} ejecutada`);
      }
      current++;
      executeNext();
    });
  } else {
    current++;
    executeNext();
  }
};

executeNext();
