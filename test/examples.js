function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

const usersPostsCommentsCreator = () => {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let usersPostsComments = [];

  for (let i = 0; i < 10; i++) {
    let randomLength = new Array(Math.ceil(Math.random() * 10)).fill(null);

    usersPostsComments.push({
      id: i + 1,
      username: randomLength
        .map(
          e => possible.split("")[Math.floor(Math.random() * possible.length)]
        )
        .join(""),
      posts: randomLength.map((e, i) => ({
        id: (i + 1) * Math.ceil(Math.random() * 10000),
        imgUrl: "https://i.redd.it/l4ln1550f3a01.jpg",
        comments: randomLength.map((e, i) => ({
          id: (100 - i) * Math.ceil(Math.random() * 10000),
          content:
            "Supply chain and resource distribution " +
            randomLength
              .map(
                e =>
                  possible.split("")[
                    Math.floor(Math.random() * possible.length)
                  ]
              )
              .join(""),
          post: (i + 1) * randomLength.length,
          user: i + 1
        }))
      }))
    });
  }

  return usersPostsComments;
};

const commentsPostUserCreator = () => {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let commentsPostUserCreator = [];

  for (let i = 0; i < 10; i++) {
    let randomLength = new Array(Math.ceil(Math.random() * 10)).fill(null);

    commentsPostUserCreator.push({
      id: (100 - i) * Math.ceil(Math.random() * 10000),
      content:
        "Supply chain and resource distribution " +
        randomLength
          .map(
            e => possible.split("")[Math.floor(Math.random() * possible.length)]
          )
          .join(""),
      post: {
        id: (i + 1) * Math.ceil(Math.random() * 1000000),
        imgUrl: "https://i.redd.it/l4ln1550f3a01.jpg"
      },
      user: {
        id: i + 1,
        username: randomLength
          .map(
            e => possible.split("")[Math.floor(Math.random() * possible.length)]
          )
          .join("")
      }
    });
  }

  return commentsPostUserCreator;
};

const postsUserCommentsCreator = () => {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let postsUserCommentsCreator = [];

  for (let i = 0; i < 10; i++) {
    let randomLength = new Array(Math.ceil(Math.random() * 10)).fill(null);

    postsUserCommentsCreator.push({
      id: (i + 1) * Math.ceil(Math.random() * 1000000),
      imgUrl: "https://i.redd.it/l4ln1550f3a01.jpg",
      user: {
        id: i + 1,
        username: randomLength
          .map(
            e => possible.split("")[Math.floor(Math.random() * possible.length)]
          )
          .join("")
      },
      comments: randomLength.map((e, i) => ({
        id: (100 - i) * Math.ceil(Math.random() * 10000),
        content:
          "Supply chain and resource distribution " +
          randomLength
            .map(
              e =>
                possible.split("")[Math.floor(Math.random() * possible.length)]
            )
            .join(""),
        post: (i + 1) * randomLength.length,
        user: i + 1
      }))
    });
  }

  return postsUserCommentsCreator;
};
