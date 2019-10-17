import { useStore } from "../store";

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
        <Link to={`/@${article.author.username}`}>
          <img src={article.author.image} alt="" />
        </Link>

        <div class="info">
          <Link class="author" to={`/@${article.author.username}`}>
            {article.author.username}
          </Link>
          <span class="date">
          {new Date(article.createdAt).toDateString()}
        </span>
        </div>

        <div class="pull-xs-right">
          <button
            class={(article.favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS)}
            onClick={handleClickFavorite}
          >
            <i class="ion-heart" /> {(article.favoritesCount)}
          </button>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} class="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul class="tag-list">{
          article.tagList.map(tag =>
            <li class="tag-default tag-pill tag-outline">{tag}</li>
          )
        }</ul>
      </Link>
    </div>
  );
}