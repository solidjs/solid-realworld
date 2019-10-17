import { createState, createEffect } from "solid-js";

export default function createCommon(agent) {
  const [state, setState] = createState({
    token: window.localStorage.getItem('jwt'),
    appLoaded: false,
    tags: [],
    isLoadingTags: false
  });
  createEffect(() => {
    if (state.token) {
      window.localStorage.setItem('jwt', token);
    } else {
      window.localStorage.removeItem('jwt');
    }
  });
  return {
    state,
    appName: 'Conduit',
    setToken(token) { setState({ token }); },
    setAppLoaded() { setState('appLoaded', true); },
    async loadTags() {
      setState('isLoadingTags', true);
      try {
        const { tags } = agent.Tags.getAll();
        setState({ tags: tags.map(t => t.toLowerCase()) });
      } finally {
        setState('isLoadingTags', false);
      }
    }
  }
}

