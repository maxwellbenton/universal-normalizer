"use strict";

function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

var usersPostsCommentsCreator = function usersPostsCommentsCreator() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var usersPostsComments = [];

  var _loop = function _loop(i) {
    var randomLength = new Array(Math.ceil(Math.random() * 10)).fill(null);

    usersPostsComments.push({
      id: i + 1,
      username: randomLength
        .map(function(e) {
          return possible.split(
            ""
          )[Math.floor(Math.random() * possible.length)];
        })
        .join(""),
      posts: randomLength.map(function(e, i) {
        return {
          id: (i + 1) * Math.ceil(Math.random() * 10000),
          imgUrl: "https://i.redd.it/l4ln1550f3a01.jpg",
          comments: randomLength.map(function(e, i) {
            return {
              id: (100 - i) * Math.ceil(Math.random() * 10000),
              content:
                "Supply chain and resource distribution " +
                randomLength
                  .map(function(e) {
                    return possible.split(
                      ""
                    )[Math.floor(Math.random() * possible.length)];
                  })
                  .join(""),
              post: (i + 1) * randomLength.length,
              user: i + 1
            };
          })
        };
      })
    });
  };

  for (var i = 0; i < 10; i++) {
    _loop(i);
  }

  return usersPostsComments;
};

var commentsPostUserCreator = function commentsPostUserCreator() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var commentsPostUserCreator = [];

  for (var i = 0; i < 10; i++) {
    var _randomLength = new Array(Math.ceil(Math.random() * 10)).fill(null);

    commentsPostUserCreator.push({
      id: (100 - i) * Math.ceil(Math.random() * 10000),
      content:
        "Supply chain and resource distribution " +
        _randomLength
          .map(function(e) {
            return possible.split(
              ""
            )[Math.floor(Math.random() * possible.length)];
          })
          .join(""),
      post: {
        id: (i + 1) * Math.ceil(Math.random() * 1000000),
        imgUrl: "https://i.redd.it/l4ln1550f3a01.jpg"
      },
      user: {
        id: i + 1,
        username: _randomLength
          .map(function(e) {
            return possible.split(
              ""
            )[Math.floor(Math.random() * possible.length)];
          })
          .join("")
      }
    });
  }

  return commentsPostUserCreator;
};

var postsUserCommentsCreator = function postsUserCommentsCreator() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var postsUserCommentsCreator = [];

  var _loop2 = function _loop2(i) {
    var randomLength = new Array(Math.ceil(Math.random() * 10)).fill(null);

    postsUserCommentsCreator.push({
      id: (i + 1) * Math.ceil(Math.random() * 1000000),
      imgUrl: "https://i.redd.it/l4ln1550f3a01.jpg",
      user: {
        id: i + 1,
        username: randomLength
          .map(function(e) {
            return possible.split(
              ""
            )[Math.floor(Math.random() * possible.length)];
          })
          .join("")
      },
      comments: randomLength.map(function(e, i) {
        return {
          id: (100 - i) * Math.ceil(Math.random() * 10000),
          content:
            "Supply chain and resource distribution " +
            randomLength
              .map(function(e) {
                return possible.split(
                  ""
                )[Math.floor(Math.random() * possible.length)];
              })
              .join(""),
          post: (i + 1) * randomLength.length,
          user: i + 1
        };
      })
    });
  };

  for (var i = 0; i < 10; i++) {
    _loop2(i);
  }

  return postsUserCommentsCreator;
};
