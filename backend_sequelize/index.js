const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const fs = require("fs");
const path = require("path");

const { Accounts } = require("./src/model_definitions/Accounts");
const { Passwords } = require("./src/model_definitions/Passwords");
const { CompanyParties, PartyItems } = require("./src/model_definitions/CompanyParties");

const config = require("./src/config/config");
const routes = require("./src/routes/main.routes");
const db = require("./src/config/connection");

const app = express();
const PORT = config.port ?? 5000;

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// for file uploads
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
app.use(router);

app.listen(PORT, (error) => {
    if (error) console.log(`FAIL TO LISTEN ON PORT ${PORT}`);
    else console.log(`LISTENING TO PORT ${PORT}`);
});

// setting this to true will drop all tables and seed new data
const reset = false;

// sync sequelize with sql db
// immediately invoked function necessary to run await async code
// no top level await available here (only in es modules/mjs)
(async function () {
    try {
        // force: drop all tables and regen them
        // alter: attempts to change tables to conform to models (doesn't always work)
        await db.sync({ force: reset });
        console.log("SUCCESSFULLY SYNCED DB");

        // seeding data
        if (reset) {
            console.log("LOADING SEEDER");
            // dynamic imports
            // should help with faster startup if not in use
            const { seeder } = require("./database/seeder");
            await seeder();
        }
    } catch (error) {
        console.log(error);
    }
})();

// https://nodejs.org/api/process.html#process_event_uncaughtexception
// https://stackoverflow.com/a/40867663
// used for cleaning up the application and then shut down
process.on("uncaughtException", (error, origin) => {
    console.log(`AN UNCAUGHT ERROR OCCURED AT ${origin}`);
    console.log("ERROR", error);
    process.exit(1);
});

routes(router);