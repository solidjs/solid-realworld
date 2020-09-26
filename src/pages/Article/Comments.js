import { createState } from "solid-js";
import NavLink from "../../components/NavLink";
import ListErrors from "../../components/ListErrors";
import { useStore } from "../../store";

const Comment = ({ comment, currentUser, onDelete }) => {
  const show = currentUser && currentUser.username === comment.author.username,
    {
      id,
      body,
      author: { username, image },
      createdAt
    } = comment;
  return (
    <div class="card">
      <div class="card-block">
        <p class="card-text" textContent={body} />
      </div>
      <div class="card-footer">
        <NavLink href={`@${username}`} route="profile" class="comment-author">
          <img src={image} class="comment-author-img" alt="" />
        </NavLink>
        &nbsp;
        <NavLink href={`@${username}`} route="profile" class="comment-author">
          {username}
        </NavLink>
        <span class="date-posted">{new Date(createdAt).toDateString()}</span>
        {show && (
          <span class="mod-options">
            <i class="ion-trash-a" onClick={[onDelete, id]} />
          </span>
        )}
      </div>
    </div>
  );
};

const CommentInput = ({ slug, createComment, loadComments, currentUser }) => {
  const [state, setState] = createState({ body: "" }),
    handleBodyChange = ev => setState({ body: ev.target.value }),
    createCommentHandler = ev => {
      ev.preventDefault();
      setState({ isCreatingComment: true });
      createComment({ body: state.body })
        .then(() => {
          setState({ body: "" });
          loadComments(slug);
        })
        .catch(errors => setState({ errors }))
        .finally(() => setState({ isCreatingComment: false }));
    };
  return (
    <>
      <ListErrors errors={state.errors} />
      <form class="card comment-form" onSubmit={createCommentHandler}>
        <div class="card-block">
          <textarea
            class="form-control"
            placeholder="Write a comment..."
            value={state.body}
            disabled={state.isCreatingComment}
            onChange={handleBodyChange}
            rows="3"
          />
        </div>
        <div class="card-footer">
          <img src={currentUser.image} class="comment-author-img" alt="" />
          <button class="btn btn-sm btn-primary" type="submit">
            Post Comment
          </button>
        </div>
      </form>
    </>
  );
};

export default () => {
  const [store, { createComment, deleteComment, loadComments }] = useStore(),
    { currentUser, articleSlug } = store,
    handleDeleteComment = commentId => deleteComment(commentId);
  return (
    <div class="col-xs-12 col-md-8 offset-md-2">
      {currentUser ? (
        <CommentInput
          slug={articleSlug}
          currentUser={currentUser}
          createComment={createComment}
          loadComments={loadComments}
        />
      ) : (
        <p>
          <NavLink route="login">Sign in</NavLink>
          &nbsp;or&nbsp;
          <NavLink route="register">sign up</NavLink>
          &nbsp;to add comments on this article.
        </p>
      )}
      <Suspense fallback="Loading comments">
        <For each={store.comments}>
          {comment => (
            <Comment comment={comment} currentUser={currentUser} onDelete={handleDeleteComment} />
          )}
        </For>
      </Suspense>
    </div>
  );
};
