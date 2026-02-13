const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

/* função com paginação */
function listarArquivos(pasta, tiposPermitidos, req, res) {
    const caminho = path.join(__dirname, 'public', pasta);
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 12;

    fs.readdir(caminho, (err, files) => {
        if (err) return res.json([]);

        const filtrados = files
            .filter(file => tiposPermitidos.some(tipo => file.toLowerCase().endsWith(tipo)))
            .sort((a,b)=> b.localeCompare(a)); // mais novos primeiro

        const inicio = (pagina - 1) * limite;
        const fim = inicio + limite;

        res.json(filtrados.slice(inicio, fim));
    });
}

/* rotas */
app.get('/api/fotos', (req, res) => {
    listarArquivos('fotos', ['.jpg','.jpeg','.png','.webp','.gif'], req, res);
});

app.get('/api/videos', (req, res) => {
    listarArquivos('videos', ['.mp4','.webm','.mov'], req, res);
});

app.listen(PORT, () => console.log("Servidor rodando em http://localhost:" + PORT));