import { createSignal, onCleanup } from "solid-js";

export default function createRouteHandler(init) {
  const [location, setLocation] = createSignal(
      window.location.hash.slice(2) || init
    ),
    [params, setParams] = createSignal(),
    locationHandler = () => setLocation(window.location.hash.slice(2));
  window.addEventListener("hashchange", locationHandler);
  onCleanup(() => window.removeEventListener("hashchange", locationHandler));
  return {
    location,
    match: (name, test) => {
      const loc = location().split("?")[0];
      const match = test.exec(loc);
      if (match) setParams({...match, routeName: name});
      return !!match;
    },
    getParams: params
  };
}
