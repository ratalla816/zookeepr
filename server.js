
const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach(trait => {
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  if (!validateAnimal(req.body)) {
    res.sendStatus(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

   // we'll also have to import and use the fs library to write that data to animals.json.
// parse incoming string or array data (converts incoming POST data and converts it to key/value 
//  pairings that can be accessed in the req.body object)
// parse incoming JSON data
// app.use method aka MIDDLEWARE - mounts a function to the server that our requests will pass 
// through before getting to the intended endpoint.
// Note that we save the animalsArray as filteredResults here:
// Save personalityTraits as a dedicated array.
// If personalityTraits is a string, place it into a new array and save.
// Loop through each trait in the personalityTraits array:
// Check the trait against each animal in the filteredResults array.
// Remember, it is initially a copy of the animalsArray,
// but here we're updating it for each trait in the .forEach() loop.
// For each trait being targeted by the filter, the filteredResults
// array will then contain only the entries that contain the trait,
// so at the end we'll have an array of animals that have every one 
// of the traits when the .forEach() loop is finished.function filterByQuery(query, animalsArray) {
    // We want to write to our animals.json file in the data subdirectory, 
    // so we use the method path.join() to join the value of __dirname, 
    // which represents the directory of the file we execute the code in, with the path to the animals.json file.
  // Don't be afraid to test out these methods and console.log() them to see what the result is! 
  // In this case, the path will be from the root of whatever machine this code runs on to the location of our animals.json file.
    // res.send(404);
    // express deprecated res.send(status): Use res.sendStatus(status) instead routes\apiRoutes\animalRoutes.js:18:9
