# UserList

Welcome to UserList! This is a README file that provides information on how to get started with the project.

## Getting Started

To set up the project, please follow these steps:

1. Run the following command to install the required dependencies:

```shell
    npm install
```

2. Create a `.env` file in the project's root directory with the following content:

```shell
   PORT = <your_port>
   JWT_SECRET = <your_secret>

   USER = <database_user>
   HOST = <database_host>
   DATABASE = <database_name>
   PASSWORD = <database_password>
```

Note: Replace `<your_port>`, `<your_secret>`, `<database_user>`, `<database_host>`, `<database_name>`, and `<database_password>` with your actual values.

3. Seed the admin into the database by running the following command:

```shell
   node ./utils/seeders.js
```

4. Start the project by running the following command:

```shell
   npm start
```

This will launch the project and make it accessible via the specified port.

## Swagger Documentation

To view the Swagger documentation for the API, open your browser and go to:

```
localhost:<your_port>/api-docs
```

Replace `<your_port>` with the actual port number you specified in the `.env` file. The Swagger documentation provides detailed information about the available endpoints and how to interact with them.

## Testing with Mocha Chai

To run the Mocha Chai tests, execute the following command:

```shell
npx mocha
```

This will run the test suite and display the results.

## Admin Login

To log in as an admin, use the following credentials:

- Username: admin
- Password: admin

Please note that these credentials are provided for demonstration purposes only. Make sure to update and secure the login credentials in a production environment.

Feel free to explore the project and customize it according to your needs. Happy coding!
