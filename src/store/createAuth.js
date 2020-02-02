export default function createAuth(agent, store, loadState, setState) {
  const [, actions] = store;
  store[1] = {
    ...actions,
    async login(email, password) {
      const { user } = await agent.Auth.login(email, password);
      actions.setToken(user.token);
      actions.pullUser();
    },
    async register(username, email, password) {
      const { user } = await agent.Auth.register(username, email, password);
      actions.setToken(user.token);
      actions.pullUser();
    },
    logout() {
      setState({ token: undefined, currentUser: undefined });
    }
  };
}
