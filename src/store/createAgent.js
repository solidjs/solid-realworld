const API_ROOT = "https://api.realworld.io/api";

const encode = encodeURIComponent;

export default function createAgent([state, actions]) {
  async function send(method, url, data, resKey) {
    const headers = {},
      opts = { method, headers };

    if (data !== undefined) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(data);
    }

    if (state.token) headers["Authorization"] = `Token ${state.token}`;

    try {
      const response = await fetch(API_ROOT + url, opts);
      const json = await response.json();
      return resKey ? json[resKey] : json;
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        actions.logout();
      }
      return err;
    }
  }

  const Auth = {
    current: () => send("get", "/user", undefined, "user"),
    login: (email, password) => send("post", "/users/login", { user: { email, password } }),
    register: (username, email, password) =>
      send("post", "/users", { user: { username, email, password } }),
    save: user => send("put", "/user", { user })
  };

  const Tags = {
    getAll: () => send("get", "/tags", undefined, "tags")
  };

  const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
  const omitSlug = article => Object.assign({}, article, { slug: undefined });

  const Articles = {
    all: (page, lim = 10) => send("get", `/articles?${limit(lim, page)}`),
    byAuthor: (author, page) => send("get", `/articles?author=${encode(author)}&${limit(5, page)}`),
    byTag: (tag, page, lim = 10) => send("get", `/articles?tag=${encode(tag)}&${limit(lim, page)}`),
    del: slug => send("delete", `/articles/${slug}`),
    favorite: slug => send("post", `/articles/${slug}/favorite`),
    favoritedBy: (author, page) =>
      send("get", `/articles?favorited=${encode(author)}&${limit(5, page)}`),
    feed: () => send("get", "/articles/feed?limit=10&offset=0"),
    get: slug => send("get", `/articles/${slug}`, undefined, "article"),
    unfavorite: slug => send("delete", `/articles/${slug}/favorite`),
    update: article => send("put", `/articles/${article.slug}`, { article: omitSlug(article) }),
    create: article => send("post", "/articles", { article })
  };

  const Comments = {
    create: (slug, comment) => send("post", `/articles/${slug}/comments`, { comment }),
    delete: (slug, commentId) => send("delete", `/articles/${slug}/comments/${commentId}`),
    forArticle: slug => send("get", `/articles/${slug}/comments`, undefined, "comments")
  };

  const Profile = {
    follow: username => send("post", `/profiles/${username}/follow`),
    get: username => send("get", `/profiles/${username}`, undefined, "profile"),
    unfollow: username => send("delete", `/profiles/${username}/follow`)
  };

  return {
    Articles,
    Auth,
    Comments,
    Profile,
    Tags
  };
}
