import { useStore } from "../store";
import NavLink from "./NavLink";

export default () => {
  const [CommonStore, UserStore] = useStore("common", "user");

  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <NavLink class="navbar-brand" route="">
          {CommonStore.appName.toLowerCase()}
        </NavLink>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <NavLink class="nav-link" route="">
              Home
            </NavLink>
          </li>
          <Show
            when={UserStore.state.currentUser}
            fallback={
              <>
                <li class="nav-item">
                  <NavLink class="nav-link" route="login">
                    Sign in
                  </NavLink>
                </li>
                <li class="nav-item">
                  <NavLink class="nav-link" route="register">
                    Sign up
                  </NavLink>
                </li>
              </>
            }
          >
            <li class="nav-item">
              <NavLink class="nav-link" route="editor">
                <i class="ion-compose"></i>&nbsp;New Post
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink class="nav-link" route="settings">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink class="nav-link" route="profile">
                <i class="ion-compose"></i>&nbsp;User
              </NavLink>
            </li>
          </Show>
        </ul>
      </div>
    </nav>
  );
};
