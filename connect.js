const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("./db/collection.db", (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTable(); // Call the function to create the table after connecting to the database
    }
});
   
// Function to create the users table if it doesn't exist
function createTable() {
    db.run('CREATE TABLE IF NOT EXISTS docs (id INTEGER PRIMARY KEY, title TEXT)', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table created successfully.');
            
        }
    });
}
// Function to insert data into the users table

// Function to query data from the users table
function queryData() {
    db.all('SELECT * FROM docs', (err, rows) => {
        if (err) {
            console.error('Error querying data:', err.message);
        } else {
            console.log('Rows:', rows);
        }
    });
}