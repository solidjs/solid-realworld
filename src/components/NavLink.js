import { useRouter } from "../store";
import { useTransition } from "solid-js";

export default props => {
  const { getParams } = useRouter(),
    [, start] = useTransition({ timeoutMs: 250 });
  return (
    <a
      class={props.class}
      classList={{ active: props.active || getParams()?.routeName === props.route }}
      href={`#/${props.href || props.route}`}
      onClick={() => start(() => window.scrollTo(0, 0))}
    >
      {props.children}
    </a>
  );
};
