import { createEffect, createMemo, useTransition } from "solid-js";
import { useStore, useRouter } from "../store";
import NavLink from "./NavLink";
import ArticleList from "./ArticleList";

export default () => {
  const [store, { loadArticles, setPage }] = useStore(),
    { token, appName } = store,
    { location } = useRouter(),
    tab = createMemo(() => {
      const search = location().split("?")[1];
      if (!search) return token ? "feed" : "all";
      const query = new URLSearchParams(search);
      return query.get("tab");
    }),
    [, start] = useTransition({ timeoutMs: 250 }),
    getPredicate = () => {
      switch (tab()) {
        case "feed":
          return { myFeed: true };
        case "all":
          return {};
        default:
          return { tag: tab() };
      }
    },
    handleSetPage = page => {
      start(() => {
        setPage(page);
        loadArticles(getPredicate());
      });
    };

  createEffect(() => start(() => loadArticles(getPredicate())));

  return (
    <div class="home-page">
      {!token && (
        <div class="banner">
          <div class="container">
            <h1
              class="logo-font"
              textContent={/*@once*/ appName.toLowerCase()}
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

            <Suspense
              fallback={<div class="article-preview">Loading articles...</div>}
            >
              <ArticleList
                articles={Object.values(store.articles)}
                totalPagesCount={store.totalPagesCount}
                currentPage={store.page}
                onSetPage={handleSetPage}
              />
            </Suspense>
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
