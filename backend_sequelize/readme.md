## Project Setup

- Run the SQL init file
- Create a new ``.env`` file and paste this inside and **make any necessary changes**: 

    ```
    PORT=5000

    DB_HOST=localhost
    DB_NAME=user_management_system
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=

    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_BASE_FOLDER_PATH=User Management System

    NODEMAILER_HOSTNAME=
    NODEMAILER_PORT=
    NODEMAILER_DOMAIN=ums.com
    NODEMAILER_USERNAME=
    NODEMIALER_PASSWORD=

    JWT_SECRET=superSecretJwtKey
    ```

## Sequelize Sync

Note the use of ``{ force: true }`` or ``{ alter: true }`` for the database syncing in ``index.js``.

``force`` will drop all tables, including the data!

These options are not for production.

```javascript
(async function () {
    try {
        await db.sync({ force: true });
        console.log("SUCCESSFULLY SYNCED DB");
    }
    catch (error) {
        console.log("ERROR SYNCING DB", error);
    }
})();
```
## Working with time

There is no need for third party libraries. Javascript has it built-in.

- To create a new datetime for now:

    ```javascript
    let d = new Date();
    console.log(d); // logs "2021-05-26T11:17:46.000Z"
    ```

- To parse a datetime:

    ```javascript
    let d = new Date("2021-05-26T11:17:46.000Z");
    console.log(d.getHours()) // logs 19 because Singapore time is 8 hours ahead of UTC
    ```

Javascript can now parse UTC time into the local time, as set by the system.

This is good (enough) for backend where the datetime is being stored in UTC.

For display, a library may still be useful to display the various regional formats.

### Sequelize

In Sequelize, the automatically generated columns of ``createdAt``, ``updatedAt`` and ``deletedAt`` use the ``datetime`` type.

The ``datetime`` type usually stores the time in the current locale, but Sequelize will actually convert all times into UTC before committing to the database.

Otherwise, we should continue using ``timestamp``, where whatever date/time given will be converted into UTC and stored, by the database.

The difference is where the conversion happens. For Seqeulize, it does the conversion in JS/runtime. For ``timestamp``, that conversion occurs in the database.

Outwardly, there are no difference in the JSON responses from the backend server.
