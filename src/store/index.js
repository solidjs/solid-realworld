import { createContext, useContext, createState } from "solid-js";
import createAgent from "./createAgent";
import createArticles from "./createArticles";
import createAuth from "./createAuth";
import createCommon from "./createCommon";
import createComments from "./createComments";
import createProfile from "./createProfile";
import createRouteHandler from "./createRouteHandler";

const StoreContext = createContext();
const RouterContext = createContext();
export function Provider(props) {
  let articles, comments, tags, profile, currentUser;
  const router = createRouteHandler(""),
    [state, setState] = createState({
      get articles() {
        return articles();
      },
      get comments() {
        return comments();
      },
      get tags() {
        return tags();
      },
      get profile() {
        return profile();
      },
      get currentUser() {
        return currentUser();
      },
      page: 0,
      totalPagesCount: 0,
      token: localStorage.getItem("jwt"),
      appName: "conduit"
    }),
    actions = {},
    store = [state, actions],
    agent = createAgent(store);

  articles = createArticles(agent, actions, state, setState);
  comments = createComments(agent, actions, state, setState);
  tags = createCommon(agent, actions, state, setState);
  profile = createProfile(agent, actions, state, setState);
  currentUser = createAuth(agent, actions, setState);

  return (
    <RouterContext.Provider value={router}>
      <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    </RouterContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export function useRouter() {
  return useContext(RouterContext);
}
