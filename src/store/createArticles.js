import { createState, createMemo } from "solid-js";

const LIMIT = 10;

export default function createArticles(agent) {
  const [state, setState] = createState({
      isLoading: false,
      page: 0,
      totalPagesCount: 0,
      articlesRegistry: {},
      predicate: {}
    }),
    store = {
      state,
      getArticles: createMemo(() => Object.values(state.articlesRegistry)),
      getArticle: slug => state.articlesRegistry[slug],
      clear: () => setState({ articlesRegistry: {}, page: 0 }),
      setPage: page => setState({ page }),
      setPredicate: predicate => {
        if (JSON.stringify(predicate) === JSON.stringify(state.predicate))
          return;
        store.clear();
        setState({ predicate });
      },
      $req() {
        if (state.predicate.myFeed)
          return agent.Articles.feed(state.page, LIMIT);
        if (state.predicate.favoritedBy)
          return agent.Articles.favoritedBy(
            state.predicate.favoritedBy,
            state.page,
            LIMIT
          );
        if (state.predicate.tag)
          return agent.Articles.byTag(state.predicate.tag, state.page, LIMIT);
        if (state.predicate.author)
          return agent.Articles.byAuthor(
            state.predicate.author,
            state.page,
            LIMIT
          );
        return agent.Articles.all(state.page, LIMIT, state.predicate);
      },
      async loadArticles() {
        setState({ isLoading: true });
        try {
          const { articles, articlesCount } = await store.$req();
          articlesRegistry = articles.reduce((memo, article) => {
            memo[article.slug] = article;
            return memo;
          }, {});

          setState({
            articlesRegistry,
            totalPagesCount: Math.ceil(articlesCount / LIMIT)
          });
        } finally {
          setState({ isLoading: false });
        }
      },
      async loadArticle(slug, { acceptCached = false } = {}) {
        if (acceptCached) {
          const article = store.getArticle(slug);
          if (article) return article;
        }
        setState({ isLoading: true });
        try {
          const { article } = await agent.Articles.get(slug);
          setState("articlesRegistry", { [article.slug]: article });
          return article;
        } finally {
          setState({ isLoading: false });
        }
      },
      async makeFavorite(slug) {
        const article = store.getArticle(slug);
        if (article && !article.favorited) {
          setState("articlesRegistry", slug, s => ({
            favorited: true,
            favoritesCount: s.favoritesCount + 1
          }));
          try {
            return await agent.Articles.favorite(slug);
          } catch (err) {
            setState("articlesRegistry", slug, s => ({
              favorited: false,
              favoritesCount: s.favoritesCount - 1
            }));
            throw err;
          }
        }
      },
      async unmakeFavorite(slug) {
        const article = store.getArticle(slug);
        if (article && article.favorited) {
          setState("articlesRegistry", slug, s => ({
            favorited: false,
            favoritesCount: s.favoritesCount - 1
          }));
          try {
            return await agent.Articles.unfavorite(slug);
          } catch (err) {
            setState("articlesRegistry", slug, s => ({
              favorited: true,
              favoritesCount: s.favoritesCount + 1
            }));
            throw err;
          }
        }
      },
      async createArticle(newArticle) {
        const { article } = await agent.Articles.create(newArticle);
        setState("articleRegistry", { [article.slug]: article });
        return article;
      },
      async updateArticle(data) {
        const { article } = await agent.Articles.update(data);
        setState("articleRegistry", { [article.slug]: article });
        return article;
      },
      async deleteArticle(slug) {
        setState("articlesRegistry", { [slug]: undefined });
        try {
          return await agent.Articles.del(slug);
        } catch (err) {
          store.loadArticles();
          throw err;
        }
      }
    };
  return store;
}
