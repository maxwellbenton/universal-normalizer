"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var normalize = function normalize() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "parents";
  var idKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["id", "username", "created_at"];

  //set up list of descendants to include the parent, remove 's' from each for ancestors list
  var entities = {};
  var results = [];
  entities[parent] = {};

  //currently only works with arrays as data parent

  //in a given object, check if any descendants are objects or arrays
  //if an object or array is found, it passes the value and key
  var checkForDescendantsAndAncestors = function checkForDescendantsAndAncestors(mother) {
    var parentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var keys = Object.keys(mother);
    for (var j = 0; j < keys.length; j++) {
      if (mother[keys[j]] !== null && _typeof(mother[keys[j]]) === "object") {
        if (Array.isArray(mother[keys[j]])) {
          if (parentType) parentType.substring(0, parentType.length - 1);

          mother[keys[j]] = convertToEntitiesAndReplaceObjects(keys[j], mother[keys[j]], parentType, mother.id);
        } else {
          if (mother[keys[j]]) mother[keys[j]] = convertToReferenceAndReplaceObject(keys[j], mother[keys[j]], parentType.substring(0, parentType.length - 1), mother.id);
        }
      }
    }
  };

  //given an array of objects, and the entityType they belong to,
  //add each object to it's entity object and replace the array elements with id references
  //checks recursively first for any nested descendants further down
  var convertToEntitiesAndReplaceObjects = function convertToEntitiesAndReplaceObjects(entityType, arrayToConvert, parentType, parentId) {
    var replacementIdArray = [];

    for (var k = 0; k < arrayToConvert.length; k++) {
      checkForDescendantsAndAncestors(arrayToConvert[k], entityType);

      addToEntityType(arrayToConvert[k], entityType);
      addParentReference(entities[entityType][arrayToConvert[k].id], parentType, parentId);

      replacementIdArray.push(arrayToConvert[k].id);
    }
    return replacementIdArray;
  };

  //adds object to it's entity type, with it's id as it's key
  var addToEntityType = function addToEntityType(object, entityType) {
    if (!entities[entityType]) entities[entityType] = {};
    entities[entityType] = _extends({}, entities[entityType], _defineProperty({}, object.id, _extends({}, entities[entityType][object.id], object)));
  };

  //adds object's parent id, as JSON nested object often don't know who they belong to
  var addParentReference = function addParentReference(entity, parentType, parentId) {
    entity = _extends({}, entity, _defineProperty({}, parentType + "_id", parentId));
  };

  //converts an ancestor object to an id reference and adds ancestor object to it's entity type
  //if ancestor key is not pointed to an object, returns the original value
  var convertToReferenceAndReplaceObject = function convertToReferenceAndReplaceObject(entityType, objectToConvert, parentType, parentId) {
    if ((typeof objectToConvert === "undefined" ? "undefined" : _typeof(objectToConvert)) == "object") {
      checkForDescendantsAndAncestors(objectToConvert);
      addToEntityType(objectToConvert, entityType);
      return objectToConvert.id;
    }
    return objectToConvert;
  };

  //begin normalization process by iterating over parent array of objects
  if (Array.isArray(data) && data[0]) {
    for (var i = 0; i < data.length; i++) {
      checkForDescendantsAndAncestors(data[i]);
      addToEntityType(data[i], parent);
      results.push(data[i].id);
    }

    return { entities: entities, results: results };
  } else if (data !== null && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
    convertToReferenceAndReplaceObject(parent, data, null);
    return { entities: entities, results: results };
  } else {
    return null;
  }
};

exports.default = normalize;
