import { selectWhen } from "solid-js/dom";
import LoadingSpinner from "./LoadingSpinner";
import ArticlePreview from "./ArticlePreview";

export default props => {
  const onSetPage = (e, v) => {
    e.preventDefault();
    props.onSetPage(v);
  };

  return (
    <Show
      when={props.articles.length}
      fallback={
        <Show when={!props.loading} fallback={<LoadingSpinner />}>
          <div class="article-preview">No articles are here... yet.</div>
        </Show>
      }
    >
      <For each={props.articles}>
        {article => <ArticlePreview article={article} />}
      </For>
      <Show when={props.totalPagesCount > 1}>
        <nav>
          <ul className="pagination">
            <For
              each={[...Array(props.totalPagesCount).keys()]}
              transform={selectWhen(() => props.currentPage, "active")}
            >
              {v => (
                <li model={v} class="page-item" onClick={onSetPage}>
                  <a class="page-link" href="">
                    {v + 1}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </Show>
    </Show>
  );
};
