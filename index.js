"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === "function" &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var entities = {};
var prevEntities = { entities: {} };
var results = [];
var test = 0;

var isObject = function isObject(item) {
  return (
    item &&
    (typeof item === "undefined" ? "undefined" : _typeof(item)) === "object" &&
    !Array.isArray(item)
  );
};

function unique(array) {
  var seen = {};
  return array.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

//in a given object, check if any descendants are objects or arrays
//if an object or array is found, it passes the value and key
var checkForNestedObjects = function checkForNestedObjects(object) {
  var objectTableName =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var keys = Object.keys(object);
  for (var j = 0; j < keys.length; j++) {
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
var convertToEntitiesAndReplaceObjects = function convertToEntitiesAndReplaceObjects(
  entityTableName,
  arrayToConvert,
  parentTableName,
  parentId
) {
  var replacementIdArray = [];

  for (var k = 0; k < arrayToConvert.length; k++) {
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
var convertToReferenceAndReplaceObject = function convertToReferenceAndReplaceObject(
  entityTableName,
  objectToConvert,
  parentTableName,
  parentId
) {
  if (
    (typeof objectToConvert === "undefined"
      ? "undefined"
      : _typeof(objectToConvert)) === "object"
  ) {
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
var addObjectToEntityTable = function addObjectToEntityTable(
  object,
  entityTableName
) {
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
  entities[entityTableName] = _extends(
    {},
    entities[entityTableName],
    _defineProperty(
      {},
      object.id,
      _extends(
        {},
        prevEntities.entities[entityTableName][object.id],
        entities[entityTableName][object.id],
        object
      )
    )
  );
};

//adds object's parent id, as JSON nested object often don't know who they belong to
var addParentReference = function addParentReference(
  entityTableName,
  objectToConvert,
  parentTableName,
  parentId
) {
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
  entities[entityTableName][objectToConvert.id] = _extends(
    {},
    entities[entityTableName][objectToConvert.id],
    _defineProperty(
      {},
      parentTableName,
      [].concat(
        _toConsumableArray(
          entities[entityTableName][objectToConvert.id][parentTableName]
        ),
        [parentId]
      )
    )
  );
};

var normalize = function normalize(data, parentTableName, previousEntities) {
  var options =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  //options:
  //[] => additional idKeys to search
  //boolean (true) => merge singular, plural
  //boolean (false) => id assignment for objects without them

  if (!data) return;
  if (!parentTableName) return data;
  if (
    !(Array.isArray(data) && data[0]) &&
    !(
      data !== null &&
      (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object"
    )
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
    for (var i = 0; i < data.length; i++) {
      // if (!data[i].id)
      //   data[i].id = Math.random()
      //     .toString(36)
      //     .substr(2, 9);
      checkForNestedObjects(data[i], parentTableName);
      addObjectToEntityTable(data[i], parentTableName);
      results.push(data[i].id);
    }
    test += 1;
    return { entities: entities };
  } else if (
    data !== null &&
    (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object"
  ) {
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
    return { entities: entities };
  } else {
    return data;
  }
};

exports.default = normalize;
