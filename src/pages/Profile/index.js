import { createEffect, lazy } from "solid-js";
import { useStore, useRouter } from "../../store";
const Profile = lazy(() => import("./Profile"));

export default function(props) {
  const [, { loadProfile, loadArticles }] = useStore(),
    { location } = useRouter(),
    username = props.params[0];
  loadProfile(username);
  createEffect(() =>
    location().includes("/favorites")
      ? loadArticles({ favoritedBy: username })
      : loadArticles({ author: username })
  );
  return Profile({ username });
}
