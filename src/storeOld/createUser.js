import { createState } from "solid-js";

export default function createUser(agent) {
  const [state, setState] = createState();
  return {
    state,
    forgetUser() {
      setState("currentUser", undefined);
    },
    async pullUser() {
      setState({ loadingUser: true });
      try {
        const { user } = await agent.Auth.current();
        setState({ currentUser: user });
      } finally {
        setState({ loadingUser: false });
      }
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
