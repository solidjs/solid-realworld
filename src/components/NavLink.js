import { useRouter } from "../store";

export default props => {
  const { getParams } = useRouter();
  return (
    <a
      class={props.class}
      classList={{ active: props.active || getParams()?.routeName === props.route }}
      href={`#/${props.href || props.route}`}
      onClick={() => window.scrollTo(0, 0)}
    >
      {props.children}
    </a>
  );
};
