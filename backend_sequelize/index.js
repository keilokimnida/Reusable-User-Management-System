const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const CONFIG = require('./src/config/config');
const db = require('./src/config/connection');
const mainRouter = require('./src/routes/main.routes');

const app = express();
const PORT = CONFIG.port ?? 5000;

app.use(cors(CONFIG.cors));
app.use(cookieParser(CONFIG.cookie.secret));

// exclude parsing of request body on this specific route
app.use('/api/v1/webhooks/stripe', express.raw({ type: '*/*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// all routes
app.use('/api/v1', mainRouter);

// setting this to true will drop all tables and seed new data
// if you use "node . R" it will set reset to true
// the dot just means current directory
// or just set the RHS boolean
const reset = process.argv[2] === 'R' || true;

// sync sequelize with sql db
// immediately invoked function necessary to run await async code
// no top level await available here (only in es modules/mjs)
(async function main() {
    try {
        await db.authenticate();
        console.log('SUCCESSFULLY CONNECTED TO DB');

        // force will drop all tables and recreate them
        await db.sync({ force: reset });
        console.log('SUCCESSFULLY SYNCED DB');

        // seeding data
        if (reset) {
            // dynamic imports
            // should help with faster startup if not in use
            console.log('LOADING SEEDER');
            const { seeder } = require('./src/database/seeder');

            console.log('RUNNING SEEDER');
            await seeder();

            console.log('FINISHED SEEDING');
        }

        app.listen(PORT, (error) => {
            if (error) {
                console.log(`FAIL TO LISTEN ON PORT ${PORT}`);
                process.exit(1);
            }
            console.log(`LISTENING TO PORT ${PORT}`);
        });
    }
    catch (error) {
        console.log('ERROR STARTING SERVER', error);
        process.exit(1);
    }
})();

// https://nodejs.org/api/process.html#process_event_uncaughtexception
// https://stackoverflow.com/a/40867663
// used for cleaning up the application and then shut down
process.on('uncaughtException', (error, origin) => {
    console.log(`AN UNCAUGHT ERROR OCCURED AT ${origin}`);
    console.log('THE UNCAUGHT ERROR', error);
    process.exit(1);
});
