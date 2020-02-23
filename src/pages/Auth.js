import { createState } from "solid-js";
import NavLink from "../components/NavLink";
import ListErrors from "../components/ListErrors";
import { useStore } from "../store";

export default () => {
  const [state, setState] = createState({ username: "", inProgress: false }),
    [, { register, login }] = useStore(),
    isLogin = location.hash.includes("login"),
    text = isLogin ? "Sign in" : "Sign up",
    link = isLogin ? (
      <NavLink route="register">Need an account?</NavLink>
    ) : (
      <NavLink route="login">Have an account?</NavLink>
    ),
    handleSubmit = e => {
      e.preventDefault();
      setState({ inProgress: true });
      const p = isLogin
        ? login(state.email, state.password)
        : register(state.username, state.email, state.password);
      p.then(() => (location.hash = "/"))
        .catch(errors => setState({ errors }))
        .finally(() => setState({ inProgress: false }));
    };

  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center" textContent={text} />
            <p class="text-xs-center">{link}</p>
            <ListErrors errors={state.errors} />
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={state.username}
                    onChange={e => setState({ username: e.target.value })}
                  />
                </fieldset>
              )}
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  value={state.email}
                  onChange={e => setState({ email: e.target.value })}
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value={state.password}
                  onChange={e => setState({ password: e.target.value })}
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={state.inProgress}
                textContent={text}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
