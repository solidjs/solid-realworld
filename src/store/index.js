import { createResourceState, createContext, useContext } from "solid-js";
import createAgent from "./createAgent";
import createArticles from "./createArticles";
import createAuth from "./createAuth";
import createUser from "./createUser";
import createCommon from "./createCommon";
import createComments from "./createComments";
import createEditor from "./createEditor";
import createProfile from "./createProfile";
import createRouteHandler from "./createRouteHandler";

const StoreContext = createContext();
const RouterContext = createContext();
export function Provider(props) {
  const [articles, loadArticles] = createResourceState(),
    [state, loadState, setState] = createResourceState({
      articles,
      page: 0,
      totalPagesCount: 0,
      token: window.localStorage.getItem("jwt"),
      appName: "Conduit",
      appLoaded: false
    }),
    store = [state, {}],
    router = createRouteHandler(""),
    agent = createAgent(store);

  createArticles(agent, store, loadState, setState, loadArticles);
  createComments(agent, store, loadState, setState);
  createCommon(agent, store, loadState, setState);
  // createEditor(store, setState);
  createProfile(agent, store, loadState, setState);
  createUser(agent, store, loadState, setState);
  createAuth(agent, store, loadState, setState);

  return (
    <RouterContext.Provider value={router}>
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
    </RouterContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export function useRouter() {
  return useContext(RouterContext);
}
