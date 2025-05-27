import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
        <Toaster position="top-center" />
      </div>
    </Provider>
  );
}

export default App;