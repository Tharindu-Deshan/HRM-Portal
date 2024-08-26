const mysql = require("mysql2");

// Load environment variables, if you're using dotenv
// Uncomment the next line if you're using dotenv package to manage environment variables
// require('dotenv').config();

const pool = mysql.createPool({

    // Use environment variables to securely manage database credentials
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.MYSQL_DB,

    // Configurable pool settings with default values
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true', // Convert string to boolean
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,  // Convert string to number and provide a default
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,             // Convert string to number and provide a default

}).promise(); // Promise wrapper allows the use of async/await for database operations

//The .promise() method added to the MySQL pool object converts the callback-based API to a Promise-based API, enabling the use of async/await. In your code, it seems that you have both callback-based and Promise-based implementations.

// Optional: Add event handlers to log database events
// pool.on('acquire', function(connection) {
//     console.log(`Connection ${connection.threadId} acquired`);
// });

// pool.on('release', function(connection) {
//     console.log(`Connection ${connection.threadId} released`);
// });

// pool.on('enqueue', function() {
//     console.log('Waiting for available connection slot');
// });

// Export the pool to be used in other parts of your application
module.exports = pool;
