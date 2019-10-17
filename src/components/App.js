import { lazy } from "solid-js";
import { useStore } from "../store";

const NavBar = lazy(() => import("./NavBar")),
  Home = lazy(() => import("./Home")),
  Editor = lazy(() => import("./Editor")),
  Settings = lazy(() => import("./Settings")),
  Auth = lazy(() => import("./Auth")),
  Article = lazy(() => import("./Article"));

export default () => {
  const [CommonStore, UserStore, { match }] = useStore(
    "common",
    "user",
    "router"
  );

  if (!CommonStore.state.token) CommonStore.setAppLoaded();
  else UserStore.pullUser().finally(() => CommonStore.setAppLoaded());

  return <>
    <NavBar />
    <Show when={(CommonStore.state.appLoaded)}>
      <Switch>
        <Match when={(match(''))}><Home /></Match>
        <Match when={(match('editor'))}><Editor /></Match>
        <Match when={(match('settings'))}><Settings /></Match>
        <Match when={(match('login'))}><Auth /></Match>
        <Match when={(match('register'))}><Auth /></Match>
        <Match when={(match('article'))}><Article /></Match>
      </Switch>
    </Show>
  </>;
};
