import { createState } from "solid-js";

export default function createEditor(articlesStore) {
  const [state, setState] = createState({
      inProgress: false,
      title: "",
      description: "",
      body: "",
      tagList: []
    }),
    store = {
      state,
      setArticleSlug(articleSlug) {
        if (state.articleSlug !== articleSlug) {
          store.reset();
          setState({ articleSlug });
        }
      },
      reset() {
        setState({ title: "", description: "", body: "", tagList: [] });
      },
      setTitle(title) {
        setState({ title });
      },
      setDescription(description) {
        setState({ description });
      },
      setBody(body) {
        setState({ body });
      },
      addTag(tag) {
        if (state.tagList.includes(tag)) return;
        setState("tagList", state.tagList.length, tag);
      },
      removeTag(tag) {
        setState("tagList", s => s.filter(t => t !== tag));
      },
      async loadInitialData() {
        if (!state.articleSlug) return;
        setState("inProgress", true);
        try {
          const article = await articlesStore.loadArticle(state.articleSlug, {
            acceptCached: true
          });
          if (!article) throw new Error("Can't load original article");
          const { title, description, body, tagList } = article;
          setState({ title, description, body, tagList });
        } finally {
          setState("inProgress", false);
        }
      },
      async submit() {
        setState({ inProgress: true, errors: undefined });
        const { title, description, body, tagList, articleSlug: slug } = state,
          article = { title, description, body, tagList, slug };
        try {
          await (slug
            ? articlesStore.updateArticle(article)
            : articlesStore.createArticle(article));
        } catch (err) {
          setState({
            errors:
              err.response && err.response.body && err.response.body.errors
          });
          throw err;
        } finally {
          setState("inProgress", false);
        }
      }
    };
  return store;
}
