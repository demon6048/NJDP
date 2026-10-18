const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
    // Truco vital: Limpiar el URL por si tiene códigos como "?v=3"
    const urlLimpia = req.url.split('?')[0]; 
    
    let filePath = '.' + urlLimpia;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`[Error 404] Archivo no encontrado: ${filePath}`);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Archivo no encontrado</h1>', 'utf-8');
            } else {
                console.log(`[Error 500] Error del servidor: ${error.code}`);
                res.writeHead(500);
                res.end(`Error interno: ${error.code}...\n`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('==================================================');
    console.log('🌟 SERVIDOR LOCAL ENCENDIDO Y LISTO 🌟');
    console.log(`➡️  Haz clic aquí para ver tu página: http://localhost:${PORT}`);
    console.log('==================================================');
    console.log('Para apagar el servidor presiona: Ctrl + C');
});