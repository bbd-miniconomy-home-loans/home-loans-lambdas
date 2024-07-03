import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';

export async function handler (event, context) {
  
  const url = `https://api.mers.projects.bbdgrad.com/api/taxpayer/business/register`;
    const body = {
      "businessName": "Free Money Inc. (home lons)",
    }

    const result = await fetch(url, {
      method: 'POST',
      body: body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.json()}`);
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });

      console.log(result);

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

    //TODO: write start bal and taxID to DB

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

}
