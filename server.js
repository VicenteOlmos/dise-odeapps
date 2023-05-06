const Koa = require('koa');
const XLSX = require('xlsx');
const { format } = require('date-fns');
const fs = require('fs');

const app = new Koa();

app.use(async (ctx, next) => {
  const data = [];

  // Recorremos cada archivo con el patrón de nombre "aforo_mes_dia" en la carpeta actual
  fs.readdirSync(__dirname).forEach((file) => {
    const matches = file.match(/^aforo_(\d{2})_(\d{2})/);

    if (matches) {
      const mes = parseInt(matches[1]);
      const dia = parseInt(matches[2]);

      const workbook = XLSX.readFile(file);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Recorremos cada fila de la hoja de Excel y agregamos un objeto al array "data"
      for (let rowNum = 2; sheet[`A${rowNum}`] && sheet[`B${rowNum}`]; rowNum++) {
        const aforo = parseInt(sheet[`A${rowNum}`].v);
        const fechaHoraNum = sheet[`B${rowNum}`].v; // Leemos la fecha y hora como un número

        // Convertimos el valor numérico a una cadena de fecha y hora utilizando "XLSX.SSF.format"
        const fechaHoraStr = XLSX.SSF.format('dd-mm-yyyy hh:mm:ss', fechaHoraNum);

        // Separamos la fecha y la hora de la cadena de fecha y hora utilizando ".split"
        const fechaHoraArr = fechaHoraStr.split(' ');
        const fechaFormateada = fechaHoraArr[0];
        const horaFormateada = fechaHoraArr[1];

        data.push({ aforo, fecha: fechaFormateada, hora: horaFormateada });
      }
    }
  });

  ctx.body = data; // Devolvemos el array de objetos JSON como respuesta HTTP
});

app.listen(3000, () => {
  console.log('Servidor Koa.js iniciado en el puerto 3000');
});
