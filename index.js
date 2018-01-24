const normalize = (
  data = [],
  parent = "parents",
  idKeys = ["id", "username", "created_at"]
) => {
  //set up list of descendants to include the parent, remove 's' from each for ancestors list
  let entities = {};
  let results = [];
  entities[parent] = {};

  //currently only works with arrays as data parent

  //in a given object, check if any descendants are objects or arrays
  //if an object or array is found, it passes the value and key
  const checkForDescendantsAndAncestors = (mother, parentType = null) => {
    let keys = Object.keys(mother);
    for (let j = 0; j < keys.length; j++)
      if (mother[keys[j]] !== null && typeof mother[keys[j]] === "object") {
        if (Array.isArray(mother[keys[j]])) {
          if (parentType) parentType.substring(0, parentType.length - 1);

          mother[keys[j]] = convertToEntitiesAndReplaceObjects(
            keys[j],
            mother[keys[j]],
            parentType,
            mother.id
          );
        } else {
          if (mother[keys[j]])
            mother[keys[j]] = convertToReferenceAndReplaceObject(
              keys[j],
              mother[keys[j]],
              parentType.substring(0, parentType.length - 1),
              mother.id
            );
        }
      }
  };

  //given an array of objects, and the entityType they belong to,
  //add each object to it's entity object and replace the array elements with id references
  //checks recursively first for any nested descendants further down
  const convertToEntitiesAndReplaceObjects = (
    entityType,
    arrayToConvert,
    parentType,
    parentId
  ) => {
    let replacementIdArray = [];

    for (let k = 0; k < arrayToConvert.length; k++) {
      checkForDescendantsAndAncestors(arrayToConvert[k], entityType);

      addToEntityType(arrayToConvert[k], entityType);
      addParentReference(
        entities[entityType][arrayToConvert[k].id],
        parentType,
        parentId
      );

      replacementIdArray.push(arrayToConvert[k].id);
    }
    return replacementIdArray;
  };

  //adds object to it's entity type, with it's id as it's key
  const addToEntityType = (object, entityType) => {
    if (!entities[entityType]) entities[entityType] = {};
    entities[entityType] = {
      ...entities[entityType],
      [object.id]: { ...entities[entityType][object.id], ...object }
    };
  };

  //adds object's parent id, as JSON nested object often don't know who they belong to
  const addParentReference = (entity, parentType, parentId) => {
    entity = { ...entity, [parentType + "_id"]: parentId };
  };

  //converts an ancestor object to an id reference and adds ancestor object to it's entity type
  //if ancestor key is not pointed to an object, returns the original value
  const convertToReferenceAndReplaceObject = (
    entityType,
    objectToConvert,
    parentType,
    parentId
  ) => {
    if (typeof objectToConvert == "object") {
      checkForDescendantsAndAncestors(objectToConvert);
      addToEntityType(objectToConvert, entityType);
      return objectToConvert.id;
    }
    return objectToConvert;
  };

  //begin normalization process by iterating over parent array of objects
  if (Array.isArray(data) && data[0]) {
    for (let i = 0; i < data.length; i++) {
      checkForDescendantsAndAncestors(data[i]);
      addToEntityType(data[i], parent);
      results.push(data[i].id);
    }

    return { entities, results };
  } else if (data !== null && typeof data === "object") {
    convertToReferenceAndReplaceObject(parent, data, null, null);
    return { entities, results };
  } else {
    return null;
  }
};

export default normalize;
