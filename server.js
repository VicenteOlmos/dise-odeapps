const Koa = require('koa');
const Router = require('@koa/router');
const XLSX = require('xlsx');
const fs = require('fs');
const { format, parse } = require('date-fns');
const { es } = require('date-fns/locale');
const static = require('koa-static');
const app = new Koa();
const router = new Router();

const readDataFromExcelFiles = () => {
  const data = [];

  fs.readdirSync(__dirname).forEach((file) => {
    const matches = file.match(/^aforo_(\d{2})_(\d{2})/);

    if (matches) {
      const mes = parseInt(matches[1]);
      const dia = parseInt(matches[2]);

      const workbook = XLSX.readFile(file);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      for (let rowNum = 2; sheet[`A${rowNum}`] && sheet[`B${rowNum}`]; rowNum++) {
        const aforo = parseInt(sheet[`A${rowNum}`].v);
        const fechaHoraNum = sheet[`B${rowNum}`].v;

        const fechaHoraStr = XLSX.SSF.format('dd-mm-yyyy hh:mm:ss', fechaHoraNum);
        const fechaHoraArr = fechaHoraStr.split(' ');
        const fechaFormateada = fechaHoraArr[0];
        const horaFormateada = fechaHoraArr[1];

        data.push({ aforo, fecha: fechaFormateada, hora: horaFormateada });
      }
    }
  });

  return data;
};

router.get('/get_aforo', async (ctx, next) => {
  ctx.body = readDataFromExcelFiles();
});

router.get('/besthours/:day', async (ctx, next) => {
  const data = readDataFromExcelFiles();
  const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  const aforoThreshold = 60;
  const hoursByDay = {};

  daysOfWeek.forEach(day => {
    hoursByDay[day] = {};
  });

  data.forEach(({ aforo, fecha, hora }) => {
    if (aforo < aforoThreshold) {
      const date = parse(fecha, 'dd-MM-yyyy', new Date());
      const dayOfWeek = format(date, 'EEEE', { locale: es }).toLowerCase();

      if (daysOfWeek.includes(dayOfWeek)) {
        // Redondear la hora al tramo de 2 horas más cercano
        const [hour, minute, second] = hora.split(':').map(Number);
        const roundedHour = Math.floor(hour )  ;
        const roundedHora = `${roundedHour.toString().padStart(2, '0')}:00:00`;

        if (!hoursByDay[dayOfWeek][roundedHora]) {
          hoursByDay[dayOfWeek][roundedHora] = 0;
        }
        hoursByDay[dayOfWeek][roundedHora]++;
      }
    }
  });

  const bestHours = {};
  const day = ctx.params.day;
  const hours = hoursByDay[day];
  const sortedHours = Object.entries(hours)
    .sort(([aHour], [bHour]) => {
      const [aHourOnly] = aHour.split(':');
      const [bHourOnly] = bHour.split(':');
      return aHourOnly - bHourOnly;
    })
    .map(([hour]) => hour);

  bestHours[day] = sortedHours;
  ctx.body = bestHours;
});


app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Servidor Koa.js iniciado en el puerto 3000');
});
app.use(static(__dirname + '/')); 
