import { createState } from "solid-js";

export default function createComments(agent, store, loadState, setState) {
  let [state, actions] = store;
  store[1] = actions = {
    ...actions,
    loadComments(articleSlug) {
      if (state.articleSlug !== articleSlug) {
        setState({ articleSlug });
      }
      loadState({ comments: () => agent.Comments.forArticle(articleSlug) });
    },
    async createComment(comment) {
      const { errors } = await agent.Comments.create(state.articleSlug, comment);
      if (errors) throw errors;
    },
    async deleteComment(id) {
      setState("comments", cs => cs.filter(c => c.id !== id));
      try {
        await agent.Comments.delete(state.articleSlug, id);
      } catch (err) {
        actions.loadComments(state.articleSlug);
        throw err;
      }
    }
  };
}
