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
            <For each={[...Array(props.totalPagesCount).keys()]}>
              {v => (
                <li
                  model={v}
                  class="page-item"
                  classList={{ active: props.currentPage === v }}
                  onClick={onSetPage}
                >
                  <a class="page-link" href="" textContent={v + 1} />
                </li>
              )}
            </For>
          </ul>
        </nav>
      </Show>
    </Show>
  );
};
