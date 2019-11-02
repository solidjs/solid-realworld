import { useStore } from "../store";
import NavLink from "./NavLink";

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

export default ({ article }) => {
  const [ArticlesStore] = useStore("article");

  const handleClickFavorite = e => {
    e.preventDefault();
    if (article.favorited) {
      ArticlesStore.unmakeFavorite(article.slug);
    } else {
      ArticlesStore.makeFavorite(article.slug);
    }
  };

  return (
    <div class="article-preview">
      <div class="article-meta">
        <NavLink to={`/@${article.author.username}`}>
          <img src={article.author.image} alt="" />
        </NavLink>

        <div class="info">
          <NavLink class="author" to={`/@${article.author.username}`}>
            {article.author.username}
          </NavLink>
          <span class="date">{new Date(article.createdAt).toDateString()}</span>
        </div>

        <div class="pull-xs-right">
          <button
            class={article.favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS}
            onClick={handleClickFavorite}
          >
            <i class="ion-heart" /> {article.favoritesCount}
          </button>
        </div>
      </div>

      <NavLink to={`/article/${article.slug}`} class="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          <For each={article.tagList}>
            {tag => <li class="tag-default tag-pill tag-outline">{tag}</li>}
          </For>
        </ul>
      </NavLink>
    </div>
  );
};
