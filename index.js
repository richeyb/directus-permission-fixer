import 'dotenv/config';
import fetch from 'node-fetch';

const getTemporaryToken = async () => {
  const res = await fetch(`${process.env.DIRECTUS_HOST}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: process.env.DIRECTUS_EMAIL,
      password: process.env.DIRECTUS_PASSWORD
    })
  });
  const body = await res.json();
  return body.data.access_token;
};

const getCollections = async (access_token) => {
  const res = await fetch(`${process.env.DIRECTUS_HOST}/collections`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    }
  });
  const collections = await res.json();
  console.log(collections);
  return collections.data.map(row => row.collection);
};

const updatePermissionsForCollections = async (access_token, collections) => {
  console.log("Working with collections:", collections);
  let postBody = collections.map(collection => {
    return (
      { collection: collection, action: "read", fields: "*" }
    )
  });
  const res = await fetch(`${process.env.DIRECTUS_HOST}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify(postBody)
  });
  const json = await res.json();
};

const main = async () => {
  const token = await getTemporaryToken();
  console.log("Received token:", token);
  console.log("Getting list of collections...");
  const collections = await getCollections(token);
  console.log("Got collections:", collections);
  console.log("Updating permissions for all collections...");
  await updatePermissionsForCollections(token, collections);
  console.log("Done!");
};

await main();