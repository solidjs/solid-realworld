import { createEffect } from "solid-js";
import { useStore } from "../store";
import NavLink from "./NavLink";
import ArticleList from "./ArticleList";

const qsParse = () => "";

export default () => {
  const [CommonStore, UserStore, ArticlesStore] = useStore(
      "common",
      "user",
      "articles"
    ),
    getTab = () => qsParse(window.location.search).tab || "all",
    getTag = () => qsParse(window.location.search).tag || "",
    getPredicate = () => {
      switch (getTab()) {
        case "feed":
          return { myFeed: true };
        case "tag":
          return { tag: qsParse(window.location.search).tag };
        default:
          return {};
      }
    },
    handleTabChange = tab => {
      if (props.location.query.tab === tab) return;
      props.router.push({ ...props.location, query: { tab } });
    },
    handleSetPage = page => {
      ArticlesStore.setPage(page);
      ArticlesStore.loadArticles();
    };

  createEffect(() => {
    // if (
    //   getTab(props) !== getTab(previousProps) ||
    //   getTag(props) !== getTag(previousProps)
    // ) {
    ArticlesStore.setPredicate(getPredicate());
    ArticlesStore.loadArticles();
    // }
  });

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
                    <NavLink class="nav-link" route="?tab=feed">
                      Your Feed
                    </NavLink>
                  </li>
                </Show>
                <li class="nav-item">
                  <NavLink class="nav-link" route="?tab=all">
                    Global Feed
                  </NavLink>
                </li>
                {/* <Show when={props.tag}>
                  <li className="nav-item">
                    <a href="" className="nav-link active">
                      <i className="ion-pound" /> {props.tag}
                    </a>
                  </li>
                </Show> */}
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
                      <a
                        href={`#/?tab=tag&tag=${tag}`}
                        class="tag-pill tag-default"
                      >
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
