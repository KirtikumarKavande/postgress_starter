import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://kirtikumar0005:8GIx1yuHETwi@ep-white-term-a5v7qfod.us-east-2.aws.neon.tech/neondb?sslmode=require",
});

async function connectDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

async function createUsersTable() {
  try {
    const result = await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

async function getUser(email: string) {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(query, values);
clg
    if (result.rows.length > 0) {
      console.log("User found:", result.rows[0]); // Output user data
      return result.rows[0]; // Return the user data
    } else {
      console.log("No user found with the given email.");
      return null; // Return null if no user was found
    }
  } catch (err) {
    console.error("Error during fetching user:", err);
    throw err; // Rethrow or handle error appropriately
  }
}

async function main() {
  await connectDatabase();
  await createUsersTable();

  // Example usage
  await getUser("user5@example.com");

  // Close the client connection when done
  await client.end();
}

main().catch(console.error);
/*


The error you're encountering, "Error: Connection terminated," indicates that the connection to the PostgreSQL database was terminated unexpectedly. This typically occurs when the client is trying to perform operations on the database after the connection has been closed.

In your code, you're calling client.end() inside the finally block of the getUser function. This means that every time you call getUser, it will close the database connection after completing the query. However, since getUser is an asynchronous function, it's possible that it tries to access the database after the connection has been closed.

To fix this issue, you should handle the database connection more carefully. It's generally a good practice to create a single database connection that is reused across multiple queries rather than opening and closing connections for each query.



*/
