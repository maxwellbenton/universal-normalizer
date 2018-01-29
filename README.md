# Universal Normalizer

## Currently Under Development -- Version 1.0.3 will only work with nested JSON data where all related objects have 'id' keys.

Currently working on
* Building more robust options for output of complex nested data
* Adding functionality for unique id key names (i.g. 'username')
* Error handling
* Cleaner recursion


Universal Normalizer is a simple, automatic normalizer of nested JSON data, converting nested arrays and objects into relational data sets.  Normalization is helpful in situations where you are dealing with nested JSON data from an API, particularly APIs from relational databases.  Normalizing your data will help you maintain data integrity, preserve data relationships on your frontend, standardize data references in your code and give you some significant performance boosts when handling a lot of data.

Universal Normalizer will recursively check through any array or object it is given for any nested arrays or objects.  For each one found, including the top level object or array, the normalizer does the following:

For objects:

* Checks for any nested arrays or objects
* Using the object's id key, a key:value pair, ```[object.id]: object```, is created in a separate, new entity object.  This object is organized by the keys of all objects or arrays the function finds during recursion.
* If not already present, the id of the parent object is added to the new object so each nested child has a reference to its parent
* The object is then replaced by the value of its id

Say an object representing a student's data was passed into the normalier with the parentTableName "students".
```{id: 4, first_name: "Evan", school: {id: 3212, name: "John Jay High", ...}, grade: 12, ...}```

becomes

```
entities.students[4] === {id: 4, first_name: "Evan", school: 3212, grade: 12}
entities.school[3212] === {id: 3212, name: "John Jay High", students=[4], ...}
```

For arrays of objects:

* Iterates over the array checking each object within
* Adds each to their respective entity objects
* Replaces the object with its id value

```[{id: 3, ...}, {id: 12, ...}, {id: 43, ...}] => [3, 12, 43]```

This process eliminates duplicate data, changing objects to references, creating a single source of truth for related data, and de-nesting all related data into a table-like structure.  

This prevents O(N^2) situations by keeping all related data at the same level.  It also allows for instant lookup instead of having to iterate through an array.  This allows for O(1) read, update and delete actions, improving efficiency, especially with large data sets.



## Installation

To install:

```npm install universal-normalizer```

Import into a JavaScript file by including ```import normalize from 'universal-normalizer'```

## Usage

The normalize() function takes two required arguments currently.

```const output = normalize(data, parentTableName, previousEntityTables)```

### data (required, {Object} or [Array])

The original JSON array or object, such as an array of users or messages, with objects nested inside, at any depth.

### parentKey (required, "String")

A string representing the name of the 'table' for the top level object or array of objects.  If you pass in an array of users, parentTableName would be "users".  This is used to add the top level object(s) to their corresponding entities object.

### previousEntityTables (optional, {Object})

An object of previously normalized data.  When passed into the normalizer, its data is deep merged with the the new entity tables being created, allowing a user to more easily add data, even from differently structured API endpoints.

## Cautions

The normalize() function modifies your objects, will overwrite and add values in your data.  Because of the general purpose of this function, not all of these values may be necessary or relevant, and are purely based on the parent/child relationship of nested data.  Say for instance, you pass in a JSON object of a song, and the song has a nested 'album' object.  Both song and album will be copied to new entity 'tables.'  The song will have an id refering to its album instead of the album object inside, and the album will also have a reference id, stored in an array, of the song and any other songs that reference the album that are found during normalization.  


The normalize() function is indiscriminate about what objects and arrays of objects it finds and will try to normalize them, even if the particular piece of data doesn't need to be.  It will not currently normalize objects that do not have id keys.

Check how your data is being modified and rearranged before by logging the output compared to input data to make sure there are no transcription errors.
