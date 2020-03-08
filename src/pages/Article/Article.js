import marked from "marked";
import NavLink from "../../components/NavLink";
import { useStore } from "../../store";

import Comments from "./Comments";

const ArticleMeta = props => (
  <div class="article-meta">
    <NavLink href={`@${props.article?.author.username}`} route="profile">
      <img src={props.article?.author.image} alt="" />
    </NavLink>

    <div class="info">
      <NavLink href={`@${props.article?.author.username}`} route="profile" class="author">
        {props.article?.author.username}
      </NavLink>
      <span class="date">{new Date(props.article?.createdAt).toDateString()}</span>
    </div>

    <Show when={props.canModify} fallback={<span />}>
      <span>
        <NavLink
          href={`editor/${props.article.slug}`}
          route="editor"
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="ion-edit" /> Edit Article
        </NavLink>
        <button class="btn btn-outline-danger btn-sm" onClick={props.onDelete}>
          <i class="ion-trash-a" /> Delete Article
        </button>
      </span>
    </Show>
  </div>
);

export default ({ slug }) => {
  const [store, { deleteArticle }] = useStore(),
    article = () => store.articles[slug],
    canModify = () =>
      store.currentUser && store.currentUser.username === article()?.author.username,
    handleDeleteArticle = () => deleteArticle(slug).then(() => (location.hash = "/"));

  return (
    <div class="article-page">
      <div class="banner">
        <div class="container">
          <h1>{article()?.title}</h1>
          <ArticleMeta article={article()} canModify={canModify()} onDelete={handleDeleteArticle} />
        </div>
      </div>

      <div class="container page">
        <div class="row article-content">
          <div class="col-xs-12">
            <div innerHTML={article() && marked(article()?.body, { sanitize: true })} />

            <ul class="tag-list">
              {article()?.tagList.map(tag => (
                <li class="tag-default tag-pill tag-outline">{tag}</li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div class="article-actions" />

        <div class="row">
          <Comments />
        </div>
      </div>
    </div>
  );
};
