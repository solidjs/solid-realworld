import { createState } from "solid-js";

export default function createProfile(agent) {
  const [state, setState] = createState();
  return {
    state,
    async loadProfile(username) {
      setState("isLoadingProfile", true);
      try {
        const { profile } = await agent.Profile.get(username);
        setState({ profile });
      } finally {
        setState("isLoadingProfile", false);
      }
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
