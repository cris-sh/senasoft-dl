import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./shared/context/AuthContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes></Routes>
                <ToastContainer position="top-rigth" />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
