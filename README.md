# Universal Normalizer

Universal Normalizer is a simple, automatic normalizer of nested JSON data, converting nested arrays and objects into relational data sets.  Normalization is helpful in situations where you are dealing with nested JSON data from an API, particularly APIs from relational databases.  Normalizing your data will help you maintain data integrity, preserve data relationships on your frontend, standardize data references in your code and give you some significant performance boosts when handling a lot of data.

Universal Normalizer will recursively check through any array or object it is given for any nested arrays or objects.  For each one found, including the top level object or array, the normalizer does the following:

For objects:

* Checks for any nested arrays or objects
* Using an id key or an alternative provided by the user, a key:value pair, ```[object.id]: object```, is created in a separate, new entity object.  This object is organized by the keys of all objects or arrays the function finds during recursion.
* If not already present, the id of the parent object is added to the new object so each nested child has a reference to its parent
* The object is then replaced by the value of its id

For arrays of objects:

* Iterates over the array checking each object within
* Adds each to their respective entity objects
* Replaces the object with its id value

This process eliminates duplicate data, changing objects to references, creating a single source of truth for related data, and de-nesting all related data into a table-like structure.  

This prevents O(N^2) situations by keeping all related data at the same level.  It also allows for instant lookup instead of having to iterate through an array.  This allows for O(1) read, update and delete actions, improving efficiency, especially with large data sets.



## Installation

To install:

```npm install universal-normalizer```

Import into a JavaScript file by including ```import normalize from 'universal-normalizer'```

## Usage

The normalize() function takes one required and two optional argument.

```const output = normalize(data, parentKey, idKeys)```

### data (required, {Object} or [Array])

The original JSON array or object, such as an array of users or messages.

### parentKey (optional, but recommended, "String")

A string representing a key for the top level object or array of objects.  If you pass in an array of users, parentKey would be "users".  This is used to add the top level object(s) to their corresponding entities object.  If no parentKey is provided, the top level objects will be move to a entities.parents object.

### idKeys (optional, [Array])

An array of strings that can be used as unique keys.  For instance, if you wanted to store users by their username, put ["username"] here.  The normalize function checks for these keys first before looking for an "id" key to use for copying.

## Cautions

The normalize() function modifies your objects, will overwrite and add values in your data.  Because of the general purpose of this function, not all of these values may be necessary or relevant.  Say for instance, you pass in a JSON object of a song, and the song has a nested 'album' object.  Both song and album will be copied to new entities, but while a song object may need to store an album id, the album will also get assigned a song id even though it likely has an array of songs that belong to it already.  This id would get replaced every time a duplicate of the album object is found in a song.

The normalize() function is indiscriminate about what objects and arrays it finds and will try to normalize them, even if the particular piece of data doesn't need to be.

Check how your data is being modified and rearranged before by logging the output compared to input data to make sure there are no transcription errors.
