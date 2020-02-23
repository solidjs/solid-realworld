import { useStore } from "../store";
import ListErrors from "../components/ListErrors";
import { createState } from "solid-js";

export default () => {
  const [store, { logout, updateUser }] = useStore(),
    [state, setState] = createState({
      image: store.currentUser.image || "",
      username: store.currentUser.username,
      bio: store.currentUser.bio || "",
      email: store.currentUser.email,
      password: ""
    }),
    updateState = field => ev => setState(field, ev.target.value),
    submitForn = ev => {
      ev.preventDefault();
      const user = Object.assign({}, state);
      if (!user.password) {
        delete user.password;
      }
      setState({ updatingUser: true });
      updateUser(user)
        .then(() => (location.hash = `/@${user.username}`))
        .catch(errors => setState({ errors }))
        .finally(() => setState({ updatingUser: false }));
    };

  return (
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>
            <ListErrors errors={state.errors} />
            <form onSubmit={submitForn}>
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    value={state.image}
                    onChange={updateState("image")}
                    disabled={state.updatingUser}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={state.username}
                    onChange={updateState("username")}
                    disabled={state.updatingUser}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    value={state.bio}
                    onChange={updateState("bio")}
                    disabled={state.updatingUser}
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    value={state.email}
                    onChange={updateState("email")}
                    disabled={state.updatingUser}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={updateState("password")}
                    disabled={state.updatingUser}
                  />
                </fieldset>
                <button
                  class="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={state.updatingUser}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button
              class="btn btn-outline-danger"
              onClick={() => (logout(), (location.hash = "/"))}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
