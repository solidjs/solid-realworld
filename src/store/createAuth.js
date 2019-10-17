import { createState } from "solid-js";

export default function createAuth(agent, commonStore, userStore) {
  const [state, setState] = createState({
    isProgress: false,
    values: {
      username: "",
      email: "",
      password: ""
    }
  });
  return {
    state,
    setUsername(username) {
      setState("values", { username });
    },
    setEmail(email) {
      setState("values", { email });
    },
    setPassword(password) {
      setState("values", { password });
    },
    reset() {
      setState("values", { username: "", email: "", password: "" });
    },
    async login() {
      setState({ inProgress: true, errors: undefined });
      try {
        const { user } = await agent.Auth.login(
          state.values.email,
          state.values.password
        );
        commonStore.setToken(user.token);
        await userStore.pullUser();
      } catch (err) {
        setState({
          errors:
            err.response && err.response.body && err.response.body.errors
        });
        throw err;
      } finally {
        setState({ inProgress: false });
      }
    },
    async register() {
      setState({ inProgress: true, errors: undefined });
      try {
        const { user } = await agent.Auth.register(
          state.values.username,
          state.values.email,
          state.values.password
        );
        commonStore.setToken(user.token);
        await userStore.pullUser();
      } catch (err) {
        setState({
          errors:
            err.response && err.response.body && err.response.body.errors
        });
        throw err;
      } finally {
        setState({ inProgress: false });
      }
    },
    logout() {
      commonStore.setToken(undefined);
      userStore.forgetUser();
    }
  };
}
