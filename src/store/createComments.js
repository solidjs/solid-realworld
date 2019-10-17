import { createState } from "solid-js";

export default function createComments(agent) {
  const [state, setState] = createState({
      isCreatingComment: false,
      isLoadingComments: false,
      comments: []
    }),
    store = {
      state,
      setArticleSlug(articleSlug) {
        if (state.articleSlug !== articleSlug)
          setState({ comments: [], articleSlug });
      },
      async loadComments() {
        setState({ isLoadingComments: true, commentErrors: undefined });
        try {
          const { comments } = await agent.Comments.forArticle(state.articleSlug);
          setState({ comments });
        } catch (err) {
          setState({
            commentErrors:
              err.response && err.response.body && err.response.body.errors
          });
          throw err;
        } finally {
          setState("isLoadingComments", false);
        }
      },
      async createComment(comment) {
        setState("isCreatingComment", true);
        try {
          await agent.Comments.create(state.articleSlug, comment);
          await store.loadComments();
        } finally {
          setState("isCreatingComment", false);
        }
      },
      async deleteComment(id) {
        const idx = state.comments.findIndex(c => c.id === id);
        if (idx > -1)
          setState("comments", s => [...s.slice(0, idx), ...s.slice(idx + 1)]);
        try {
          await agent.Comments.delete(state.articleSlug, id);
        } catch (err) {
          store.loadComments();
          throw err;
        }
      }
    };
  return store;
}
