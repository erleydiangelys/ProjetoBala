
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/auth';
import Routes from './routes';


function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <ToastContainer position="top-center" toastStyle={{ backgroundColor: "#181C2e", color: "white"}} autoClose={3000} />
          <Routes/>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
