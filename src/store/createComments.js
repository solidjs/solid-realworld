import { createState } from "solid-js";

export default function createComments(agent, store, loadState, setState) {
  const [state, actions] = store;
  store[1] = {
    ...actions,
    loadComments(articleSlug) {
      if (state.articleSlug !== articleSlug) {
        setState({ articleSlug });
      }
      loadState({ comments: agent.Comments.forArticle(articleSlug) });
    },
    async createComment(comment) {
      const { errors } = await agent.Comments.create(state.articleSlug, comment);
      if (errors) throw errors;
    },
    async deleteComment(id) {
      const idx = state.comments.findIndex(c => c.id === id);
      if (idx > -1) setState("comments", s => [...s.slice(0, idx), ...s.slice(idx + 1)]);
      try {
        await agent.Comments.delete(state.articleSlug, id);
      } catch (err) {
        store[1].loadComments(state.articleSlug);
        throw err;
      }
    }
  };
}
