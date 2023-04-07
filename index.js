
import * as dotenv from 'dotenv'
import express from 'express'
import initApp from './src/app.router.js';

dotenv.config();
const app = express();
const port = 5000;


// Cron jop
// import schedule from 'node-schedule'

// const job = schedule.scheduleJob('25 21 * * * *', function(){
//     console.log('The answer to life, the universe, and everything!');
// });


initApp(app, express);
app.listen(port, () => console.log(`app running on port ............... ${port}`));