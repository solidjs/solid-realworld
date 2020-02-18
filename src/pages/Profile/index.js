import { lazy } from "solid-js";
import { useStore } from "../../store";
const Profile = lazy(() => import("./Profile"));

export default function(props) {
  const [, { loadProfile, loadArticles }] = useStore(),
    username = props.params[0];
  loadProfile(username)
  loadArticles({ author: username })
  return Profile();
}
