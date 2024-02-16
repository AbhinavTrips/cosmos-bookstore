const { BulkOperationType, CosmosClient } = require("@azure/cosmos");
const fetch = require("node-fetch");
const yargs = require("yargs");
// destructure command line arguments
const key = "HyausjCd86Z7KCpDRMhJcoYCrN10EGHh57CFJOx7zYHfgGL36hlpd2usgC0d7EIJSrwEWPFPETTNACDbhJhYfw=="
const endpoint = "https://cosmosbookstorewaifvdgfvo3au.documents.azure.com:443/"

console.log("Endpoint: " + endpoint);
async function uploadBooks() {
  console.log("Fetching books");
  try {
    const target = `https://booksandgenres.blob.core.windows.net/books-and-genres/books_min.json`; //file
    const res = await fetch(target, {
      method: 'get',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      }
    });

    if (res.status === 200) {
      let books = await res.json();
      books.forEach(doc => {
        delete doc._id;
        doc.isbn = doc.isbn.toString();
        doc.isbn13 = doc.isbn13.toString();
      });
      await populateDb(books, "books");
    } else {
      console.log(`Error code ${res.status}`);
    }
  } catch (err) {
    console.log(err)
  }
}

async function uploadGenres() {
  console.log("Fetching genres");
  try {
    const target = `https://booksandgenres.blob.core.windows.net/books-and-genres/genres.json`; //file
    const res = await fetch(target, {
      method: 'get',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      }
    });

    if (res.status === 200) {
      const genres = [];
      let result = await res.json();
      delete result._id;
      genres.push(result);
      console.log(genres);
      await populateDb(genres, "genres");
    } else {
      console.log(`Error code ${res.status}`);
    }
  } catch (err) {
    console.log(err)
  }
}

async function populateDb(data, containerName) {
  console.log("Seeding data on populating db" +endpoint);

  const client = new CosmosClient({ endpoint, key });
  database = client.database("cosmosbookstore");
  container = database.container(containerName);
  console.log("Seeding data on " + containerName + " container");


  const operations = [];
  
  for (let i = 0; i <= data.length; i += 1) { 
    if (data[i]) {
      operations.push(
        {
          operationType: BulkOperationType.Create,
          resourceBody: data[i],
        }
      );
    }
  }

  response = await container.items.bulk(operations);
  console.log(response);


};
console.log("$$$ Seeding data started " + new Date().toLocaleString());
uploadBooks();


