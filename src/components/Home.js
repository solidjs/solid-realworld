import { createEffect, createSignal } from "solid-js";
import { useStore } from "../store";
import NavLink from "./NavLink";
import ArticleList from "./ArticleList";

const qsParse = () => "";

export default () => {
  const [CommonStore, UserStore, ArticlesStore, { location }] = useStore(
      "common",
      "user",
      "articles",
      "router"
    ),
    [tab, setTab] = createSignal(CommonStore.state.token ? "feed" : "all"),
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
      ArticlesStore.setPage(page);
      ArticlesStore.loadArticles();
    };

  createEffect(() => {
    const search = location().split("?")[1];
    if (!search) return setTab("all");
    const query = new URLSearchParams(search);
    setTab(query.get("tab"));
  });
  createEffect(() => {
    ArticlesStore.setPredicate(getPredicate());
    ArticlesStore.loadArticles();
  });
  CommonStore.loadTags();

  return (
    <div class="home-page">
      <Show when={!CommonStore.state.token}>
        <div class="banner">
          <div class="container">
            <h1 class="logo-font">{CommonStore.appName.toLowerCase()}</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>
      </Show>

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <Show when={UserStore.state.currentUser}>
                  <li class="nav-item">
                    <NavLink
                      class="nav-link"
                      href="?tab=feed"
                      active={tab() === "feed"}
                    >
                      Your Feed
                    </NavLink>
                  </li>
                </Show>
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
                  <li className="nav-item">
                    <a href="" className="nav-link active">
                      <i className="ion-pound" /> {tab()}
                    </a>
                  </li>
                </Show>
              </ul>
            </div>

            <ArticleList
              articles={ArticlesStore.getArticles()}
              loading={ArticlesStore.state.isLoading}
              totalPagesCount={ArticlesStore.state.totalPagesCount}
              currentPage={ArticlesStore.state.page}
              onSetPage={handleSetPage}
            />
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <Show when={CommonStore.state.tags}>
                <div class="tag-list">
                  <For each={CommonStore.state.tags}>
                    {tag => (
                      <a href={`#/?tab=${tag}`} class="tag-pill tag-default">
                        {tag}
                      </a>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
