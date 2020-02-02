export default function createEditor(store) {
  store.actions = {
    ...store.actions,
    async loadInitialData(articleSlug) {
      const article = await store.actions.loadArticle(articleSlug, {
        acceptCached: true
      });
      if (!article) throw new Error("Can't load original article");
      return article;
    },
    async submit(article) {
      await (article.slug
        ? store.actions.updateArticle(article)
        : store.actions.createArticle(article));
    }
  };
  return store;
}
