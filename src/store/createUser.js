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
      setState({ updatingUser: true });
      try {
        const { user } = await agent.Auth.save(newUser);
        setState({ currentUser: user });
      } finally {
        setState({ updatingUser: false });
      }
    }
  };
}
