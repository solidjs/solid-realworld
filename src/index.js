import { render } from 'solid-js/web';
import App from './App';
import { Provider } from './store';

render(() => (
  <Provider>
    <App />
  </Provider>
), document.body);