let entities = {};
let prevEntities = { entities: {} };
let results = [];
let test = 0;

const isObject = item => {
  return item && typeof item === "object" && !Array.isArray(item);
};

function unique(array) {
  var seen = {};
  return array.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

//in a given object, check if any descendants are objects or arrays
//if an object or array is found, it passes the value and key
const checkForNestedObjects = (object, objectTableName = null) => {
  let keys = Object.keys(object);
  for (let j = 0; j < keys.length; j++) {
    if (isObject(object[keys[j]]))
      object[keys[j]] = convertToReferenceAndReplaceObject(
        keys[j],
        object[keys[j]],
        objectTableName,
        object.id
      );
    if (Array.isArray(object[keys[j]])) {
      object[keys[j]] = convertToEntitiesAndReplaceObjects(
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
      entityTableName,
      arrayToConvert[k],
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
      entityTableName,
      objectToConvert,
      parentTableName,
      parentId
    );
    return objectToConvert.id;
  }
  return objectToConvert;
};

//adds object to it's entity type, with it's id as it's key
const addObjectToEntityTable = (object, entityTableName) => {
  if (prevEntities.entities[entityTableName + "s"]) {
    entityTableName = entityTableName + "s";
  }
  if (
    prevEntities.entities[
      entityTableName.substring(0, entityTableName.length - 1)
    ]
  ) {
    entityTableName = entityTableName.substring(0, entityTableName.length - 1);
  }
  //

  if (!entities[entityTableName]) entities[entityTableName] = {};
  if (!prevEntities.entities[entityTableName])
    prevEntities.entities[entityTableName] = {};
  if (!entities[entityTableName][object.id])
    entities[entityTableName][object.id] = {};

  if (!prevEntities.entities[entityTableName][object.id])
    prevEntities.entities[entityTableName][object.id] = {};

  // debugger;
  //
  entities[entityTableName] = {
    ...entities[entityTableName],
    [object.id]: {
      ...prevEntities.entities[entityTableName][object.id],
      ...entities[entityTableName][object.id],
      ...object
    }
  };
};

//adds object's parent id, as JSON nested object often don't know who they belong to
const addParentReference = (
  entityTableName,
  objectToConvert,
  parentTableName,
  parentId
) => {
  if (!parentTableName) return;
  if (!parentId) return;

  if (prevEntities.entities[entityTableName + "s"]) {
    entityTableName = entityTableName + "s";
  }
  if (
    prevEntities.entities[
      entityTableName.substring(0, entityTableName.length - 1)
    ]
  ) {
    entityTableName = entityTableName.substring(0, entityTableName.length - 1);
  }
  // if (!objectToConvert.id)
  //   objectToConvert.id = Math.random()
  //     .toString(36)
  //     .substr(2, 9);
  if (!entities[entityTableName]) entities[entityTableName] = {};

  if (!entities[entityTableName][objectToConvert.id])
    entities[entityTableName][objectToConvert.id] = {};

  if (!entities[entityTableName][objectToConvert.id][parentTableName])
    entities[entityTableName][objectToConvert.id][parentTableName] = [];
  // if (entityTableName === "posts") debugger;
  //
  entities[entityTableName][objectToConvert.id] = {
    ...entities[entityTableName][objectToConvert.id],
    [parentTableName]: [
      ...entities[entityTableName][objectToConvert.id][parentTableName],
      parentId
    ]
  };
};

const normalize = (data, parentTableName, previousEntities, options = {}) => {
  //options:
  //[] => additional idKeys to search
  //boolean (true) => merge singular, plural
  //boolean (false) => id assignment for objects without them

  if (!data) return;
  if (!parentTableName) return data;
  if (
    !(Array.isArray(data) && data[0]) &&
    !(data !== null && typeof data === "object")
  )
    return data;
  if (previousEntities) prevEntities = previousEntities;

  if (prevEntities.entities[parentTableName + "s"])
    parentTableName = parentTableName + "s";
  if (
    prevEntities.entities[
      parentTableName.substring(0, parentTableName.length - 1)
    ]
  )
    parentTableName = parentTableName.substring(0, parentTableName.length - 1);

  if (!entities[parentTableName]) entities[parentTableName] = {};

  // if (!prevEntities[parentTableName]) prevEntities[parentTableName] = {};
  //begin normalization process by iterating over parent array of objects

  if (Array.isArray(data) && data[0]) {
    for (let i = 0; i < data.length; i++) {
      // if (!data[i].id)
      //   data[i].id = Math.random()
      //     .toString(36)
      //     .substr(2, 9);
      checkForNestedObjects(data[i], parentTableName);
      addObjectToEntityTable(data[i], parentTableName);
      results.push(data[i].id);
    }
    test += 1;
    return { entities };
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
    test += 1;
    return { entities };
  } else {
    return data;
  }
};

// export default normalize;
