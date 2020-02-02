import { lazy } from "solid-js";
import { useStore, useRouter } from "./store";
import NavBar from "./components/NavBar";

const Home = lazy(() => import("./components/Home")),
  Editor = lazy(() => import("./components/Editor")),
  Settings = lazy(() => import("./components/Settings")),
  Auth = lazy(() => import("./components/Auth")),
  Article = lazy(() => import("./components/Article")),
  Profile = lazy(() => import("./components/Profile"));

export default () => {
  const [store, { setAppLoaded, pullUser }] = useStore(),
    { match, getParams } = useRouter();

  if (!store.token) setAppLoaded();
  else pullUser().finally(() => setAppLoaded());

  return (
    <>
      <NavBar />
      <Show when={store.appLoaded}>
        <Suspense fallback={"Loading..."}>
          <Switch>
            <Match when={match("editor", /^editor\/?(.*)/)}><Editor {...getParams()} /></Match>
            <Match when={match("settings", /^settings/)}><Settings /></Match>
            <Match when={match("login", /^login/)}><Auth /></Match>
            <Match when={match("register", /^register/)}><Auth /></Match>
            <Match when={match("article", /^article\/(.*)/)}><Article {...getParams()} /></Match>
            <Match when={match("profile", /^@([^/]*)\/?(favorites)?/)}><Profile {...getParams()} /></Match>
            <Match when={match("", /^#?$/)}><Home /></Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  );
};
