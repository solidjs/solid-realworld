import { useStore } from "../store";
import NavLink from "./NavLink";

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

export default ({ article }) => {
  const [{ token }, { unmakeFavorite, makeFavorite }] = useStore(),
    { title, description, slug, createdAt, tagList, author: { username, image }} = article;

  const handleClickFavorite = e => {
    e.preventDefault();
    article.favorited
      ? unmakeFavorite(slug)
      : makeFavorite(slug);
  };

  return (
    <div class="article-preview">
      <div class="article-meta">
        <NavLink href={`@${username}`} route="profile">
          <img src={image} alt="" />
        </NavLink>

        <div class="info">
          <NavLink class="author" href={`@${username}`} route="profile">
            {username}
          </NavLink>
          <span class="date" textContent={/*@once*/new Date(createdAt).toDateString()} />
        </div>

        {token && (
          <div class="pull-xs-right">
            <button
              class={article.favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS}
              onClick={handleClickFavorite}
            >
              <i class="ion-heart" /> {article.favoritesCount}
            </button>
          </div>
        )}
      </div>

      <NavLink href={`article/${slug}`} route="article" class="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          {/*@once*/
          tagList.map(tag => (
            <li class="tag-default tag-pill tag-outline" textContent={tag} />
          ))}
        </ul>
      </NavLink>
    </div>
  );
};
