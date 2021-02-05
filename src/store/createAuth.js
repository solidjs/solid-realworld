import { createSignal, createResource, batch } from "solid-js";

export default function createAuth(agent, actions, setState) {
  const [loggedIn, setLoggedIn] = createSignal(false),
    [currentUser, { mutate }] = createResource(loggedIn, agent.Auth.current);
  Object.assign(actions, {
    pullUser: () => setLoggedIn(true),
    async login(email, password) {
      const { user, errors } = await agent.Auth.login(email, password);
      if (errors) throw errors;
      actions.setToken(user.token);
      setLoggedIn(true);
    },
    async register(username, email, password) {
      const { user, errors } = await agent.Auth.register(username, email, password);
      if (errors) throw errors;
      actions.setToken(user.token);
      setLoggedIn(true);
    },
    logout() {
      batch(() => {
        setState({ token: undefined });
        mutate(undefined);
      })
    },
    async updateUser(newUser) {
      const { user, errors } = await agent.Auth.save(newUser);
      if (errors) throw errors;
      mutate(user);
    }
  });
  return currentUser;
}
