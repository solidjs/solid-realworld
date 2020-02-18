import ArticlePreview from "./ArticlePreview";

export default props => {
  const handlePage = (e, v) => {
    e.preventDefault();
    props.onSetPage(v);
    setTimeout(() => window.scrollTo(0, 0), 200);
  };
  return (
    <Suspense fallback={<div class="article-preview">Loading articles...</div>}>
      <For
        each={props.articles}
        fallback={<div class="article-preview">No articles are here... yet.</div>}
      >
        {article => <ArticlePreview article={article} />}
      </For>
      <Show when={props.totalPagesCount > 1}>
        <nav>
          <ul class="pagination">
            <For each={[...Array(props.totalPagesCount).keys()]}>
              {v => (
                <li
                  model={v}
                  class="page-item"
                  classList={{ active: props.currentPage === v }}
                  onClick={handlePage}
                >
                  <a class="page-link" href="" textContent={v + 1} />
                </li>
              )}
            </For>
          </ul>
        </nav>
      </Show>
    </Suspense>
  );
};
