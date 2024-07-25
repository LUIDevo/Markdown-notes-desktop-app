const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



function parseUpload(x) {
    if (typeof x === 'object' && x !== null) {
        // If x is an object (excluding null), recursively stringify its values
        return JSON.stringify(x);
    } else if (typeof x === 'string') {
        // If x is already a string, apply the existing string manipulation logic
        x = x.replace(/^"|"$/g, '');
        x = x.replace(/"/g, 's');
        return x;
    } else {
        // For other types, return as is
        return x;
    }
}

// Connect to SQLite database
const db = new sqlite3.Database('../../../db/collection.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTable(); // Call the function to create the table after connecting to the database
    }
});

function clearTable(){
    db.run('DELETE FROM main_folder'), (err, rows) => {
        if (err) {
            console.error('Error querying data:', err.message);
        } else {
            console.log('Rows:', rows);
        }
    }
}

// Function to create the "docs" table if it doesn't exist
function createTable() {
    db.run('CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY, subject TEXT)', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table created successfully.');
        }
    });
}


function queryData(callback) {
    db.all('SELECT * FROM subjects', (err, rows) => {
        if (err) {
            console.error('Error querying data:', err.message);
            callback(err, null); // Pass error to the callback
        } else {
            console.log('Rows:', rows);
            callback(null, rows); // Pass rows to the callback
        }
    });
}

app.get('/getFolders', (req, res) => {
    queryData((err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(rows); // Send rows in the response
        }
    });
});




app.get('/getNotesInSubject/:folder', (req, res) => {
    const folder = req.params.folder;
    if (!folder) {
        res.sendStatus(400); // Send 400 Bad Request if folder is missing
    } else {
        const folderLower = folder.toLowerCase(); // Call toLowerCase function

        console.log(folderLower);

        const query = `SELECT title FROM ${folderLower}_folder`;

        db.all(query, (err, rows) => {
            if (err) {
                console.error('Error querying data:', err.message);
                res.status(500).send('Error querying data'); // Send an error response
            } else {
                console.log('Rows:', rows);
                res.json(rows); // Send the rows as JSON response
            }
        });
    }
});

app.post('/getContentsOfFolder', (req, res) => {
    let { title, subject } = req.body;
    console.log(title, subject);

    if (!title) {
        return res.sendStatus(400);
    }

    console.log("title", title);
    const query = `SELECT content FROM ${subject}_folder WHERE title = ?`;

    db.get(query, [title], (err, row) => {
        if (err) {
            console.error('Error executing SQL:', query);
            console.error('Error:', err);
            return res.status(500).send('Error fetching content from the database');
        } else {
            if (row) {
                console.log('Content:', row.content);
                return res.json({ content: row.content });
            } else {
                return res.status(404).send('Content not found');
            }
        }
    });
});

app.post('/createSubject', (req, res) => {
    subjectName = req.body.message
    console.log(subjectName)
    createSubjectFolder(subjectName)
    insertSubject(subjectName)
    res.send(subjectName)
})

function deleteTable(){
    try {
        db.run('DROP TABLE IF EXISTS main_folder');
        db.run('DROP TABLE IF EXISTS sadaxa_folder');
        db.run('DROP TABLE IF EXISTS Sociolagy_folder');
        db.run('DELETE FROM main_folder WHERE id="10" ')
        console.log('Tables deleted successfully');
    } catch (error) {
        console.error('Error deleting tables:', error.message);
        }
    
    } 

    


app.post('/uploadContent', (req, res) => {
    console.log('Request Body:', req.body); // Log the entire request body
    let title = req.body.title;
    title = parseUpload(title)
    let subject = req.body.subject;
    subject = parseUpload(subject)
    let content = req.body.content;
    content = parseUpload(content)
    console.log(title, subject, content)
    console.log('Content:', content);
    try {
        const sql = `
            REPLACE INTO ${subject}_folder (title, content) 
            VALUES (?, ?)
        `;
        db.run(sql, [title, content], function(err) {
            if (err) {
                console.error('Error executing SQL:', sql);
                console.error('Error:', err);
                return res.status(500).send('Error inserting or replacing content in the database');
            }
            else {
                console.log('Content inserted or replaced successfully');
                res.status(200).send('Content inserted or replaced successfully');
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal server error');
    }
    console.log('Title:', title);
    console.log('Subject:', subject);
    console.log('Content:', content);

});
    
    
    

app.get('/delete', (req,res) => {
    deleteTable()
    res.sendStatus(200)
})

// Function to insert a new note into the "docs" table
// function createNote(title) {
//     db.run('INSERT INTO docs (title) VALUES (?)', [title], (err) => {
//         if (err) {
//             console.error('Error inserting data:', err.message);
//         } else {
//             console.log('Data inserted successfully.');
//         }
//     });
// }

// Function to query data from the "docs" table
app.post('/createNote', (req,res) => {
    const { subject, title } = req.body;
    console.log(subject,title)
    insertNoteinSubject(subject,title)
    res.status.send(200)
})

function insertNoteinSubject(subject, title) {
    const tableName = `${subject}_folder`; // Construct the table name dynamically
    db.run(`REPLACE INTO ${tableName} (title) VALUES (?)`, [title], (err) => {
        if (err) {
            
            if (err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error: Note with title '${title}' already exists in ${tableName}`);
                // Handle duplicate title error
            } else {
                console.error(`Error inserting note into ${tableName}:`, err.message);
            }
            return err
        } else {
            console.log(`Note inserted successfully into ${tableName}`);
        }
    });
}

function createSubjectFolder(subject) {
    const tableName = `${subject}_folder`; // Construct the table name dynamically
    db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY, title TEXT UNIQUE, content TEXT)`, (err) => {
        if (err) {
            console.error(`Error creating table ${tableName}:`, err.message);
        } else {
            console.log(`Subject table ${tableName} created successfully.`);
        }
    });
}

function insertSubject(subject) {
    db.run('INSERT OR IGNORE INTO subjects (title) VALUES (?)', [subject], (err) => {
        if (err) {
            console.error('Error inserting subject:', err.message);
        } else {
            console.log('Subject inserted successfully');
        }
    });
}


app.get('/clear', (req, res) => {
    clearTable();
    res.send('Database cleared')
})
// Start the Express server
app.listen(port, () => {
    createTable();
    console.log(`Server is running on http://localhost:${port}`);
});
