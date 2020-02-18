import NavLink from "../../components/NavLink";
import ArticleList from "../../components/ArticleList";

export default ({ appName, token, handleSetPage, tab, store }) => {
  return (
    <div class="home-page">
      {!token && (
        <div class="banner">
          <div class="container">
            <h1
              class="logo-font"
              textContent={appName}
            />
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      )}

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                {token && (
                  <li class="nav-item">
                    <NavLink
                      class="nav-link"
                      href="?tab=feed"
                      active={tab() === "feed"}
                    >
                      Your Feed
                    </NavLink>
                  </li>
                )}
                <li class="nav-item">
                  <NavLink
                    class="nav-link"
                    href="?tab=all"
                    active={tab() === "all"}
                  >
                    Global Feed
                  </NavLink>
                </li>
                <Show when={tab() !== "all" && tab() !== "feed"}>
                  <li class="nav-item">
                    <a href="" class="nav-link active">
                      <i class="ion-pound" /> {tab()}
                    </a>
                  </li>
                </Show>
              </ul>
            </div>

            <ArticleList
              articles={Object.values(store.articles)}
              totalPagesCount={store.totalPagesCount}
              currentPage={store.page}
              onSetPage={handleSetPage}
            />
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <Suspense fallback="Loading tags...">
                <div class="tag-list">
                  <For each={store.tags}>
                    {tag => (
                      <a href={`#/?tab=${tag}`} class="tag-pill tag-default">
                        {tag}
                      </a>
                    )}
                  </For>
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
