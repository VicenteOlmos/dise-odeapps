const Koa = require('koa');
const Router = require('@koa/router');
const XLSX = require('xlsx');
const fs = require('fs');
const { format, parse } = require('date-fns');
const { es } = require('date-fns/locale');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser'); // Asegúrate de instalar este módulo

const app = new Koa();
const router = new Router();

app.use(bodyParser());

const readDataFromExcelFiles = () => {
  // Tu código existente
};

router.get('/get_aforo', async (ctx, next) => {
  ctx.body = readDataFromExcelFiles();
});

router.get('/besthours/:day', async (ctx, next) => {
  // Tu código existente
});

router.post('/submit_comment', async (ctx, next) => {
    const comment = ctx.request.body.comment;
    
    if (comment && comment.trim()) {
        fs.appendFileSync('comentarios.txt', `${comment}\n`);
        ctx.status = 200;
    } else {
        ctx.status = 400;
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Servidor Koa.js iniciado en el puerto 3000');
});

app.use(static(__dirname + '/'));
