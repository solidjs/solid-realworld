import { createEffect, lazy } from "solid-js";
import { useStore, useRouter } from "../../store";
const Profile = lazy(() => import("./Profile"));

export default function(props) {
  const [, { loadProfile, loadArticles }] = useStore(),
    { location } = useRouter();
  createEffect(() => loadProfile(props.params[0]));
  createEffect(() =>
    location().includes("/favorites")
      ? loadArticles({ favoritedBy: props.params[0] })
      : loadArticles({ author: props.params[0] })
  );
  return <Profile username={props.params[0]} />;
}
