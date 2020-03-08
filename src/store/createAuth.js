export default function createAuth(agent, store, loadState, setState) {
  let [, actions] = store;
  store[1] = actions = {
    ...actions,
    async login(email, password) {
      const { user, errors } = await agent.Auth.login(email, password);
      if (errors) throw errors;
      actions.setToken(user.token);
      actions.pullUser();
    },
    async register(username, email, password) {
      const { user, errors } = await agent.Auth.register(username, email, password);
      if (errors) throw errors;
      actions.setToken(user.token);
      actions.pullUser();
    },
    logout() {
      setState({ token: undefined, currentUser: undefined });
    },
    pullUser() {
      let p;
      loadState({ currentUser: (p = agent.Auth.current()) });
      return p;
    },
    async updateUser(newUser) {
      const { user, errors } = await agent.Auth.save(newUser);
      if (errors) throw errors;
      setState({ currentUser: user });
    }
  };
}
