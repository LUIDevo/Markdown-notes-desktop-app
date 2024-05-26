


// C:\Users\abere\markdown-desktop-app-stack\db
// C:\Users\abere\markdown-desktop-app-stack\renderer\pages
export default async function handler(req, res) {
    // const sqlite3 = await import('sqlite3')
    // const path = await import('path')
    // const dbPath = path.join(__dirname, '..', '..', 'db', 'database.db'); 
    // // Create a new SQLite database instance
    // const db = new sqlite3.Database(dbPath, (err) => {
    //     if (err) {
    //         console.error('Error opening database:', err.message);
    //     } else {
    //         console.log('Connected to the SQLite database.');
    //         createTable(); // Call the function to create the table after connecting to the database
    //     }
    // });
    // // Function to create the users table if it doesn't exist
    // function createTable() {
    //     db.run('CREATE TABLE IF NOT EXISTS docs (id INTEGER PRIMARY KEY, title TEXT)', (err) => {
    //         if (err) {
    //             console.error('Error creating table:', err.message);
    //         } else {
    //             console.log('Users table created successfully.');
                
    //         }
    //     });
    // }
    // Dummy data
    const data = {
      message: 'Hello from the server!',
      timestamp: Date.now()
    };
    
    // Return the data as JSON
    res.status(200).json(data);
}

