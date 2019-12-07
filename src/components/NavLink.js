import { useStore } from "../store";

export default props => {
  const [{ getParams }] = useStore("router");
  return (
    <a
      class={props.class}
      classList={{ active: props.active || getParams().routeName === props.route }}
      href={`#/${props.href || props.route}`}
    >
      {props.children}
    </a>
  );
};
