import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import Login from './Views/Login';
import Venta from './Views/Venta';
import Reportes from './Views/Reportes';
import  Graficas from './Views/Graficas';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<Venta />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/graficas" element={<Graficas/>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App
