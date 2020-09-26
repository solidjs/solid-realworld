import { createComputed, createMemo, useTransition, lazy } from "solid-js";
import { useStore, useRouter } from "../../store";
const Home = lazy(() => import("./Home"));

export default function() {
  const [store, { loadArticles, setPage }] = useStore(),
    { token, appName } = store,
    { location } = useRouter(),
    tab = createMemo(() => {
      const [url, search] = location().split("?");
      if (url) return;
      if (!search) return token ? "feed" : "all";
      const query = new URLSearchParams(search);
      return query.get("tab");
    }),
    [, start] = useTransition(),
    getPredicate = () => {
      switch (tab()) {
        case "feed":
          return { myFeed: true };
        case "all":
          return {};
        case undefined:
          return undefined;
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

  createComputed(() => loadArticles(getPredicate()));

  return Home({ handleSetPage, appName, token, tab, store });
}
