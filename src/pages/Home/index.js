import { createEffect, createMemo, useTransition, lazy } from "solid-js";
import { useStore, useRouter } from "../../store";
const Home = lazy(() => import("./Home"));

export default function() {
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

  return Home({ handleSetPage, appName, token, tab, store });
}
