const LIMIT = 10;

export default function createArticles(
  agent,
  store,
  loadState,
  setState,
  loadArticle
) {
  const [state, actions] = store;
  store[1] = {
    ...actions,
    clear: () => setState({ articles: {}, page: 0 }),
    setPage: page => setState({ page }),
    loadArticles(predicate) {
      const articles = $req(predicate).then(({ articles, articlesCount }) => {
        setState({ totalPagesCount: Math.ceil(articlesCount / LIMIT) });
        return articles.reduce((memo, article) => {
          memo[article.slug] = article;
          return memo;
        }, {});
      });
      loadState({ articles });
    },
    async loadArticle(slug, { acceptCached = false } = {}) {
      if (acceptCached) {
        const article = state.articles[slug];
        if (article) return article;
      }
      const p = agent.Articles.get(slug);
      loadArticle({ [slug]: p });
      return p;
    },
    async makeFavorite(slug) {
      const article = state.articles[slug];
      if (article && !article.favorited) {
        setState("articles", slug, s => ({
          favorited: true,
          favoritesCount: s.favoritesCount + 1
        }));
        try {
          return await agent.Articles.favorite(slug);
        } catch (err) {
          setState("articles", slug, s => ({
            favorited: false,
            favoritesCount: s.favoritesCount - 1
          }));
          throw err;
        }
      }
    },
    async unmakeFavorite(slug) {
      const article = state.articles[slug];
      if (article && article.favorited) {
        setState("articles", slug, s => ({
          favorited: false,
          favoritesCount: s.favoritesCount - 1
        }));
        try {
          return await agent.Articles.unfavorite(slug);
        } catch (err) {
          setState("articles", slug, s => ({
            favorited: true,
            favoritesCount: s.favoritesCount + 1
          }));
          throw err;
        }
      }
    },
    async createArticle(newArticle) {
      const { article } = await agent.Articles.create(newArticle);
      setState("articles", { [article.slug]: article });
      return article;
    },
    async updateArticle(data) {
      const { article } = await agent.Articles.update(data);
      setState("articles", { [article.slug]: article });
      return article;
    },
    async deleteArticle(slug) {
      const article = state.articles[slug];
      setState("articles", { [slug]: undefined });
      try {
        return await agent.Articles.del(slug);
      } catch (err) {
        setState("articles", { [slug]: article });
        throw err;
      }
    }
  };

  function $req(predicate) {
    if (predicate.myFeed) return agent.Articles.feed(state.page, LIMIT);
    if (predicate.favoritedBy)
      return agent.Articles.favoritedBy(predicate.favoritedBy, state.page, LIMIT);
    if (predicate.tag)
      return agent.Articles.byTag(predicate.tag, state.page, LIMIT);
    if (predicate.author)
      return agent.Articles.byAuthor(predicate.author, state.page, LIMIT);
    return agent.Articles.all(state.page, LIMIT, predicate);
  }
}
