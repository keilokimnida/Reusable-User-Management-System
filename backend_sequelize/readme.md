# Project Setup

- Run the SQL init file
- Create a new ``.env`` file and paste this inside and **make any necessary changes**: 

    ```
    PORT=8000

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
    COOKIE_SECRET=bestSecureCodingPractices
    ```

## Linting

With the `.eslintrc.json` config file, you should install the extention [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) in order to make use of it in order to:

- Check for errors (sometimes VS Code itself is not good enough, but sometimes ESLint also fails to catch errors, like the use of await outside of an async function - which VS Code does catch but gets overwritten)
- Enforce coding style

To lint your code:

- Use the command palette `ctrl + shift + p` and use "ESLint: Fix all auto-fixable Problems"
- In the command prompt `npm run lint`
