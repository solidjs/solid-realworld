import { lazy } from "solid-js";
import { useStore } from "./store";

const NavBar = lazy(() => import("./components/NavBar")),
  Home = lazy(() => import("./components/Home")),
  Editor = lazy(() => import("./components/Editor")),
  Settings = lazy(() => import("./components/Settings")),
  Auth = lazy(() => import("./components/Auth")),
  Article = lazy(() => import("./components/Article")),
  Profile = lazy(() => import("./components/Profile"));

export default () => {
  const [CommonStore, UserStore, { match, getParams }] = useStore(
    "common",
    "user",
    "router"
  );

  if (!CommonStore.state.token) CommonStore.setAppLoaded();
  else UserStore.pullUser().finally(() => CommonStore.setAppLoaded());

  return (
    <>
      <NavBar />
      <Show when={CommonStore.state.appLoaded}>
        <Switch>
          <Match when={match("editor", /^#\/editor\/?(.*)/)}><Editor {...getParams()} /></Match>
          <Match when={match("settings", /^#\/settings/)}><Settings /></Match>
          <Match when={match("login", /^#\/login/)}><Auth /></Match>
          <Match when={match("register", /^#\/register/)}><Auth /></Match>
          <Match when={match("article", /^#\/article\/(.*)/)}><Article {...getParams()} /></Match>
          <Match when={match("profile", /^#\/@([^/]*)\/?(favorites)?/)}><Profile {...getParams()} /></Match>
          <Match when={match("", /^#?$/)}><Home /></Match>
        </Switch>
      </Show>
    </>
  );
};
