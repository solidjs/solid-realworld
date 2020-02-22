export default function createEditor(store) {
  const [, actions] = store;
  store[1] = {
    ...actions,
    async loadInitialData(articleSlug) {
      const article = await actions.loadArticle(articleSlug, {
        acceptCached: true
      });
      if (!article) throw new Error("Can't load original article");
      return article;
    },
    async submit(article) {
      await (article.slug
        ? actions.updateArticle(article)
        : actions.createArticle(article));
    }
  };
}
