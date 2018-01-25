let entities = {};
let results = [];

//in a given object, check if any descendants are objects or arrays
//if an object or array is found, it passes the value and key
const checkForNestedObjects = (object, objectTableName = null) => {
  let keys = Object.keys(object);
  for (let j = 0; j < keys.length; j++)
    if (object[keys[j]] !== null && typeof object[keys[j]] === "object") {
      if (Array.isArray(object[keys[j]])) {
        object[keys[j]] = convertToEntitiesAndReplaceObjects(
          keys[j],
          object[keys[j]],
          objectTableName,
          object.id
        );
      } else {
        if (object[keys[j]])
          object[keys[j]] = convertToReferenceAndReplaceObject(
            keys[j],
            object[keys[j]],
            objectTableName,
            object.id
          );
      }
    }
};

//given an array of objects, and the entityTableName they belong to,
//add each object to it's entity object and replace the array elements with id references
//checks recursively first for any nested descendants further down
const convertToEntitiesAndReplaceObjects = (
  entityTableName,
  arrayToConvert,
  parentTableName,
  parentId
) => {
  let replacementIdArray = [];

  for (let k = 0; k < arrayToConvert.length; k++) {
    checkForNestedObjects(arrayToConvert[k], entityTableName);

    addObjectToEntityTable(arrayToConvert[k], entityTableName);
    addParentReference(
      entities[entityTableName][arrayToConvert[k].id],
      parentTableName,
      parentId
    );

    replacementIdArray.push(arrayToConvert[k].id);
  }
  return replacementIdArray;
};

//converts an ancestor object to an id reference and adds ancestor object to it's entity type
//if ancestor key is not pointed to an object, returns the original value
const convertToReferenceAndReplaceObject = (
  entityTableName,
  objectToConvert,
  parentTableName,
  parentId
) => {
  if (typeof objectToConvert === "object") {
    if (!objectToConvert.id)
      objectToConvert.id = Math.random()
        .toString(36)
        .substr(2, 9);
    checkForNestedObjects(objectToConvert, parentTableName);
    addObjectToEntityTable(objectToConvert, entityTableName);
    addParentReference(
      entities[entityTableName][objectToConvert.id],
      parentTableName,
      parentId
    );
    return objectToConvert.id;
  }
  return objectToConvert;
};

//adds object to it's entity type, with it's id as it's key
const addObjectToEntityTable = (
  object,
  entityTableName,
  previousEntityTable
) => {
  if (!entities[entityTableName]) entities[entityTableName] = {};
  if (!entities[entityTableName][object.id])
    entities[entityTableName][object.id] = {};
  entities[entityTableName] = {
    ...entities[entityTableName],
    [object.id]: { ...entities[entityTableName][object.id], ...object }
  };
};

//adds object's parent id, as JSON nested object often don't know who they belong to
const addParentReference = (entity, parentTableName, parentId) => {
  if (!parentTableName) return;
  if (!parentId) return;

  if (!entity.id)
    entity.id = Math.random()
      .toString(36)
      .substr(2, 9);
  if (!entities[parentTableName]) entities[parentTableName] = {};
  if (!entities[parentTableName][entity.id])
    entities[parentTableName][entity.id] = {};

  if (!entities[parentTableName][entity.id][parentTableName])
    entities[parentTableName][entity.id][parentTableName] = [];

  entities[parentTableName][entity.id] = {
    ...entities[parentTableName][entity.id],
    [parentTableName]: [
      ...entities[parentTableName][entity.id][parentTableName],
      parentId
    ]
  };
};

const normalize = (
  data = [],
  parentTableName = "parents",
  previousEntityTable,
  idKeys
) => {
  entities[parentTableName] = {};

  //begin normalization process by iterating over parent array of objects
  // debugger;
  if (Array.isArray(data) && data[0]) {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].id)
        data[i].id = Math.random()
          .toString(36)
          .substr(2, 9);
      checkForNestedObjects(data[i], parentTableName);
      addObjectToEntityTable(data[i], parentTableName, previousEntityTable);
      results.push(data[i].id);
    }
    return { entities, results };
  } else if (data !== null && typeof data === "object") {
    if (!data.id)
      data.id = Math.random()
        .toString(36)
        .substr(2, 9);
    convertToReferenceAndReplaceObject(
      parentTableName,
      data,
      parentTableName,
      "-1"
    );
    return { entities, results };
  } else {
    return null;
  }
};

// export default normalize;
