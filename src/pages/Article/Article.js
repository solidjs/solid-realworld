import { createState } from "solid-js";
import marked from "marked";
import NavLink from "../../components/NavLink";
import { useStore } from "../../store";

const ArticleActions = props => {
  const handleDelete = () => props.onDelete(props.article.slug);

  return (
    <Show when={props.canModify} fallback={<span />}>
      <span>
        <NavLink
          href={`editor/${props.article?.slug}`}
          route="editor"
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="ion-edit" /> Edit Article
        </NavLink>
        <button class="btn btn-outline-danger btn-sm" onClick={handleDelete}>
          <i class="ion-trash-a" /> Delete Article
        </button>
      </span>
    </Show>
  );
};

const ArticleMeta = props => {
  const article = props.article;
  return (
    <div class="article-meta">
      <NavLink href={`@${props.article?.author.username}`} route="profile">
        <img src={props.article?.author.image} alt="" />
      </NavLink>

      <div class="info">
        <NavLink
          href={`@${props.article?.author.username}`}
          route="profile"
          class="author"
        >
          {props.article?.author.username}
        </NavLink>
        <span class="date">
          {new Date(props.article?.createdAt).toDateString()}
        </span>
      </div>

      <ArticleActions
        canModify={props.canModify}
        article={props?.article}
        onDelete={props.onDelete}
      />
    </div>
  );
};

const Comment = props => {
  const comment = props.comment;
  const show =
    props.currentUser && props.currentUser.username === comment.author.username;
  return (
    <div class="card">
      <div class="card-block">
        <p class="card-text">{comment.body}</p>
      </div>
      <div class="card-footer">
        <NavLink
          href={`@${comment.author.username}`}
          route="profile"
          class="comment-author"
        >
          <img src={comment.author.image} class="comment-author-img" alt="" />
        </NavLink>
        &nbsp;
        <NavLink
          href={`@${comment.author.username}`}
          route="profile"
          class="comment-author"
        >
          {comment.author.username}
        </NavLink>
        <span class="date-posted">
          {new Date(comment.createdAt).toDateString()}
        </span>
        {show && (
          <span class="mod-options">
            <i class="ion-trash-a" onClick={() => props.onDelete(comment.id)} />
          </span>
        )}
      </div>
    </div>
  );
};

const CommentInput = props => {
  const [, { createComment }] = useStore(),
    [state, setState] = createState({ body: "" }),
    handleBodyChange = ev => setState({ body: ev.target.value }),
    createCommentHandler = ev => {
      ev.preventDefault();
      createComment({ body: state.body }).then(() => setState({ body: "" }));
    };
  return (
    <form class="card comment-form" onSubmit={createCommentHandler}>
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          value={state.body}
          disabled={store.isCreatingComment}
          onChange={handleBodyChange}
          rows="3"
        />
      </div>
      <div class="card-footer">
        <img src={props.currentUser.image} class="comment-author-img" alt="" />
        <button class="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>
  );
};

const CommentContainer = props => (
  <div class="col-xs-12 col-md-8 offset-md-2">
    <Show
      when={props.currentUser}
      fallback={
        <p>
          <NavLink route="login">Sign in</NavLink>
          &nbsp;or&nbsp;
          <NavLink route="register">sign up</NavLink>
          &nbsp;to add comments on this article.
        </p>
      }
    >
      <list-errors errors={props.errors} />
      <CommentInput slug={props.slug} currentUser={props.currentUser} />
    </Show>
    <For each={props.comments}>
      {comment => (
        <Comment
          comment={comment}
          currentUser={props.currentUser}
          slug={props.slug}
          key={comment.id}
          onDelete={props.onDelete}
        />
      )}
    </For>
  </div>
);

export default ({ slug }) => {
  let canModify;
  const [store, { deleteArticle, deleteComment }] = useStore(),
    article = () => store.articles[slug],
    handleDeleteArticle = slug =>
      deleteArticle(slug).then(() => {
        // this.props.history.replace("/")
      });

  return (
    <div class="article-page">
      {
        ((canModify =
          store.currentUser &&
          store.currentUser.username === article()?.author.username),
        (
          <>
            <div class="banner">
              <div class="container">
                <h1>{article()?.title}</h1>
                <ArticleMeta
                  article={article()}
                  canModify={canModify}
                  onDelete={handleDeleteArticle}
                />
              </div>
            </div>

            <div class="container page">
              <div class="row article-content">
                <div class="col-xs-12">
                  <div
                    innerHTML={
                      article() && marked(article()?.body, { sanitize: true })
                    }
                  />

                  <ul class="tag-list">
                    {article()?.tagList.map(tag => (
                      <li class="tag-default tag-pill tag-outline">{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <hr />

              <div class="article-actions">
                <ArticleMeta
                  article={article()}
                  canModify={canModify}
                  onDelete={handleDeleteArticle}
                />
              </div>

              <div class="row">
                <CommentContainer
                  comments={store.comments}
                  errors={store.commentErrors}
                  slug={slug}
                  currentUser={store.currentUser}
                  onDelete={deleteComment}
                />
              </div>
            </div>
          </>
        ))
      }
    </div>
  );
};
