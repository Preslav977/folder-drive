const { Client } = require("pg");

async function main() {
  try {
    console.log("seeding...");
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
  } catch (err) {
    console.error("An error occurred when seeing", err);
    throw err;
  }
}

main();
