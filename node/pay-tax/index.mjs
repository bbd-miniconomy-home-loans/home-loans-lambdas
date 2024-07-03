import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';

export async function handler (event, context) {
  const client = new Client({
    host: 'home-loans-service.c9jnw8blzgak.eu-west-1.rds.amazonaws.com',
    user: 'admin_usr',
    password: '<[I1cgqA:|n5pa~cHDAT+lIUayDW',
    database: 'homeloan',
    port: '5432',
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  });
 
  await client.connect();

    let sqlData;
    let prevYearBalance;
    let taxId;

    try {
        // Example SQL query
        const sqlQuery = 'SELECT * FROM lambdas';

        // Execute the SQL query
        const result = await client.query(sqlQuery);

        // Close the connection
        await client.end();

        console.log('Query result:', result.rows);
    } catch (err) {
        console.error('Error executing RDS query:', err);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: 'Error executing RDS query' }) 
        };
    }

    // fetch current balance
    const urlCurBal = `http://api.commercialbank.projects.bbdgrad.com/account/balance`;
    const headers = {
        'X-origin': 'home_loans',
        'Content-Type': 'application/json', // Adjust content type as needed
        // Add any other headers as needed
    };
    const balance = await fetch(urlCurBal, {
      method: 'GET',
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${  response}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    
    console.log(balance);

    // difference of balance compared to prev year

    const taxableIncome = balance - prevYearBalance; 

    console.log(taxableIncome);

    // if (taxableIncome < 0)
    //   {
    //     return;
    //   }

    // pay that amount
    const url = `https://api.mers.projects.bbdgrad.com/account/balance`;
    const body = {
      "taxId": taxId,
      "taxType": "INCOME",
      "amount": taxableIncome
    }

    fetch(url, {
      method: 'POST',
      body: body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${  response}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });

}
