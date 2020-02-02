export default () => {
  const handleClick = ev => {
      ev.preventDefault();
      profile.following ? ProfileStore.unfollow() : ProfileStore.follow();
    },
    handleSetPage = page => {
      ArticlesStore.setPage(page);
      ArticlesStore.loadArticles();
    };

  return (
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img src={profile.image} class="user-img" alt="" />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>
              {isUser && (
                <Link
                  to="/settings"
                  class="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i class="ion-gear-a" /> Edit Profile Settings
                </Link>
              )}
              {!isUser && (
                <button
                  class="btn btn-sm action-btn"
                  classList={{
                    "btn-secondary": profile.following,
                    "btn-outline-secondary": !profile.following
                  }}
                  onClick={handleClick}
                >
                  <i class="ion-plus-round" />
                  &nbsp;
                  {profile.following ? "Unfollow" : "Follow"} {profile.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <NavLink
                    class="nav-link"
                    isActive={(match, location) => {
                      return location.pathname.match("/favorites") ? 0 : 1;
                    }}
                    to={`/@${profile.username}`}
                  >
                    My Articles
                  </NavLink>
                </li>

                <li class="nav-item">
                  <NavLink
                    class="nav-link"
                    to={`/@${profile.username}/favorites`}
                  >
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            <ArticleList
              articles={ArticlesStore.state.articles}
              totalPagesCount={ArticlesStore.state.totalPagesCount}
              onSetPage={handleSetPage}
              loading={ArticlesStore.state.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
