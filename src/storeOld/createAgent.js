const API_ROOT = "https://conduit.productionready.io/api";

const encode = encodeURIComponent;

export default function createAgent() {
  let authStore, commonStore;

  async function send(method, url, data) {
    const headers = {},
      opts = { method, headers };

    if (data !== undefined) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(data);
    }

    if (commonStore.state.token)
      headers["Authorization"] = `Token ${commonStore.state.token}`;

    try {
      const response = await fetch(API_ROOT + url, opts);
      // if (response.status !== 200) throw response;
      return await response.json();
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        authStore.logout();
      }
      return err;
    }
  }

  const Auth = {
    current: () => send("get", "/user"),
    login: (email, password) =>
      send("post", "/users/login", { user: { email, password } }),
    register: (username, email, password) =>
      send("post", "/users", { user: { username, email, password } }),
    save: user => send("put", "/user", { user })
  };

  const Tags = {
    getAll: () => send("get", "/tags")
  };

  const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
  const omitSlug = article => Object.assign({}, article, { slug: undefined });

  const Articles = {
    all: (page, lim = 10) => send("get", `/articles?${limit(lim, page)}`),
    byAuthor: (author, page, query) =>
      send("get", `/articles?author=${encode(author)}&${limit(5, page)}`),
    byTag: (tag, page, lim = 10) =>
      send("get", `/articles?tag=${encode(tag)}&${limit(lim, page)}`),
    del: slug => send("delete", `/articles/${slug}`),
    favorite: slug => send("post", `/articles/${slug}/favorite`),
    favoritedBy: (author, page) =>
      send("get", `/articles?favorited=${encode(author)}&${limit(5, page)}`),
    feed: () => send("get", "/articles/feed?limit=10&offset=0"),
    get: slug => send("get", `/articles/${slug}`),
    unfavorite: slug => send("delete", `/articles/${slug}/favorite`),
    update: article =>
      send("put", `/articles/${article.slug}`, { article: omitSlug(article) }),
    create: article => send("post", "/articles", { article })
  };

  const Comments = {
    create: (slug, comment) =>
      send("post", `/articles/${slug}/comments`, { comment }),
    delete: (slug, commentId) =>
      send("delete", `/articles/${slug}/comments/${commentId}`),
    forArticle: slug => send("get", `/articles/${slug}/comments`)
  };

  const Profile = {
    follow: username => send("post", `/profiles/${username}/follow`),
    get: username => send("get", `/profiles/${username}`),
    unfollow: username => send("delete", `/profiles/${username}/follow`)
  };

  return {
    configure(auth, common) {
      authStore = auth;
      commonStore = common;
    },
    Articles,
    Auth,
    Comments,
    Profile,
    Tags
  };
}
