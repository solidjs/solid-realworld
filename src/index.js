import { render } from 'solid-js/dom';
import App from './App';
import { Provider } from './store';

// import main css file
import "../styles/styles.css";

render(() => (
  <Provider>
    <App />
  </Provider>
), document.body);