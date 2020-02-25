import { createEffect } from "solid-js";

export default function createCommon(agent, store, loadState, setState) {
  const [state, actions] = store;
  loadState({
    tags: agent.Tags.getAll().then(tags => tags.map(t => t.toLowerCase()))
  });
  createEffect(() => {
    state.token ? localStorage.setItem("jwt", state.token) : localStorage.removeItem("jwt");
  });
  store[1] = {
    ...actions,
    setToken(token) {
      setState({ token });
    }
  };
}
