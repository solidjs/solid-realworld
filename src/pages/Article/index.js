import { lazy } from "solid-js";
import { useStore } from "../../store";
const Article = lazy(() => import("./Article"));

export default function(props) {
  const [, { loadArticle, loadComments }] = useStore(),
    slug = props.params[0];
  loadArticle(slug);
  loadComments(slug);
  return Article({ slug });
}
