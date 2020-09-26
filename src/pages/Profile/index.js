import { createComputed, lazy } from "solid-js";
import { useStore, useRouter } from "../../store";
const Profile = lazy(() => import("./Profile"));

export default function (props) {
  const [, { loadProfile, loadArticles }] = useStore(),
    { location } = useRouter();
  createComputed(() => props.routeName === "profile" && loadProfile(props.params[0]));
  createComputed(
    () =>
    props.routeName === "profile" &&
      (location().includes("/favorites")
        ? loadArticles({ favoritedBy: props.params[0] })
        : loadArticles({ author: props.params[0] }))
  );
  return <Profile username={props.params[0]} />;
}
