import { useStore } from "../store";

export default props => {
  const [{ match }] = useStore("router");
  return (
    <a
      class={props.class}
      classList={{ active: match(props.route) }}
      href={`#/${props.route}`}
    >
      {props.children}
    </a>
  );
};
