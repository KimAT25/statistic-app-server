import * as dotenv from 'dotenv';
dotenv.config();

import app from './server.js';
import config from './config/index.js';

app.listen(config.port, () => {
    console.log(`Example app listening on port http://localhost:${config.port}`)
})
