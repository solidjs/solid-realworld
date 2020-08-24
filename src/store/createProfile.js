export default function createProfile(agent, store, loadState, setState) {
  const [state, actions] = store;
  store[1] = {
    ...actions,
    loadProfile(username) {
      loadState({ profile: () => agent.Profile.get(username) });
    },
    async follow() {
      if (state.profile && !state.profile.following) {
        setState("profile", "following", true);
        try {
          await agent.Profile.follow(state.profile.username);
        } catch (err) {
          setState("profile", "following", false);
        }
      }
    },
    async unfollow() {
      if (state.profile && state.profile.following) {
        setState("profile", "following", false);
        try {
          await agent.Profile.unfollow(state.profile.username);
        } catch (err) {
          setState("profile", "following", true);
        }
      }
    }
  };
}
