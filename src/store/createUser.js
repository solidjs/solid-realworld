export default function createUser(agent, store, loadState, setState) {
  const [, actions] = store;
  store[1] = {
    ...actions,
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
