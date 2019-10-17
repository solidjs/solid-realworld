import { useContext, createContext } from "solid-js";
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

export function Provider(props) {
  const agent = createAgent(),
    articles = createArticles(agent),
    comments = createComments(agent),
    common = createCommon(agent),
    editor = createEditor(articles),
    profile = createProfile(agent),
    user = createUser(agent),
    auth = createAuth(agent, common, user),
    router = createRouteHandler(''),
    value = { articles, auth, common, comments, editor, profile, user, router };
  agent.configure(auth, common);

  return (
    <StoreContext.Provider value={value}>
      {(props.children)}
    </StoreContext.Provider>
  );
}

export function useStore(...names) {
  const stores = useContext(StoreContext);
  return names.map(name => stores[name]);
}
