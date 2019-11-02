import { createSignal, onCleanup } from "solid-js";

export default function createRouteHandler(init) {
  const [location, setLocation] = createSignal(
      window.location.hash.slice(2) || init
    ),
    locationHandler = () => setLocation(window.location.hash.slice(2));
  window.addEventListener("hashchange", locationHandler);
  onCleanup(() => window.removeEventListener("hashchange", locationHandler));
  return { match: match => match === location(), getParams: () => {} };
}
