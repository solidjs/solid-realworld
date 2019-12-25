import { createState } from "solid-js";
import marked from "marked";
import NavLink from "./NavLink";
import { useStore } from "../store";

const ArticleActions = props => {
  const article = props.article;
  const handleDelete = () => props.onDelete(article.slug);

  return (
    <Show when={props.canModify} fallback={<span />}>
      <span>
        <NavLink
          href={`editor/${article.slug}`}
          route="editor"
          className="btn btn-outline-secondary btn-sm"
        >
          <i className="ion-edit" /> Edit Article
        </NavLink>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleDelete}
        >
          <i className="ion-trash-a" /> Delete Article
        </button>
      </span>
    </Show>
  );
};

const ArticleMeta = props => {
  const article = props.article;
  return (
    <div className="article-meta">
      <NavLink href={`@${article.author.username}`} route="profile">
        <img src={article.author.image} alt="" />
      </NavLink>

      <div className="info">
        <NavLink href={`@${article.author.username}`} route="profile" className="author">
          {article.author.username}
        </NavLink>
        <span className="date">
          {new Date(article.createdAt).toDateString()}
        </span>
      </div>

      <ArticleActions
        canModify={props.canModify}
        article={article}
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
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <NavLink href={`@${comment.author.username}`} route="profile" className="comment-author">
          <img
            src={comment.author.image}
            className="comment-author-img"
            alt=""
          />
        </NavLink>
        &nbsp;
        <NavLink href={`@${comment.author.username}`} route="profile" className="comment-author">
          {comment.author.username}
        </NavLink>
        <span className="date-posted">
          {new Date(comment.createdAt).toDateString()}
        </span>
        {show && (
          <span className="mod-options">
            <i
              className="ion-trash-a"
              onClick={() => props.onDelete(comment.id)}
            />
          </span>
        )}
      </div>
    </div>
  );
};

const CommentInput = props => {
  const [CommentsStore] = useStore("comments"),
    [state, setState] = createState({ body: "" }),
    handleBodyChange = ev => setState({ body: ev.target.value }),
    createComment = ev => {
      ev.preventDefault();
      CommentsStore.createComment({ body: state.body }).then(() =>
        setState({ body: "" })
      );
    };
  return (
    <form className="card comment-form" onSubmit={createComment}>
      <div className="card-block">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          value={state.body}
          disabled={CommentsStore.state.isCreatingComment}
          onChange={handleBodyChange}
          rows="3"
        />
      </div>
      <div className="card-footer">
        <img
          src={props.currentUser.image}
          className="comment-author-img"
          alt=""
        />
        <button className="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>
  );
};

const CommentContainer = props => (
  <div className="col-xs-12 col-md-8 offset-md-2">
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

export default props => {
  let canModify;
  const [ArticlesStore, CommentsStore, UserStore] = useStore(
      "articles",
      "comments",
      "user"
    ),
    slug = props.params[0],
    article = () => ArticlesStore.state.articlesRegistry[slug],
    handleDeleteArticle = slug =>
      ArticlesStore.deleteArticle(slug).then(() => {
        // this.props.history.replace("/")
      }),
    handleDeleteComment = id => CommentsStore.deleteComment(id);

  ArticlesStore.loadArticle(slug, { acceptCached: true });
  CommentsStore.setArticleSlug(slug);
  CommentsStore.loadComments();

  return (
    <div class="article-page">
      <Show when={article()}>
        {
          ((canModify =
            UserStore.state.currentUser &&
            UserStore.state.currentUser.username === article.author.username),
          (
            <>
              <div className="banner">
                <div className="container">
                  <h1>{article().title}</h1>
                  <ArticleMeta
                    article={article()}
                    canModify={canModify}
                    onDelete={handleDeleteArticle}
                  />
                </div>
              </div>

              <div class="container page">
                <div className="row article-content">
                  <div className="col-xs-12">
                    <div innerHTML={marked(article().body, { sanitize: true })} />

                    <ul className="tag-list">
                      {article().tagList.map(tag => {
                        return (
                          <li className="tag-default tag-pill tag-outline">
                            {tag}
                          </li>
                        );
                      })}
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
                    comments={CommentsStore.state.comments}
                    errors={CommentsStore.state.commentErrors}
                    slug={slug}
                    currentUser={UserStore.state.currentUser}
                    onDelete={handleDeleteComment}
                  />
                </div>
              </div>
            </>
          ))
        }
      </Show>
    </div>
  );
};
