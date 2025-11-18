import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CustomerProfile from "./pages/profile/CustomerProfile.jsx";
import RequestFuel from "./pages/dashboard/RequestFuel.jsx";

const Login = lazy(() => import("./pages/auth/Login.jsx"));
const CustomerDashboard = lazy(() => import("./pages/dashboard/CustomerDashboard.jsx"));
const ViewDetails = lazy(() => import("./pages/details/ViewDetails.jsx"));

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<CustomerDashboard />} />
                    <Route path="/profile" element={<CustomerProfile />} />
                    <Route path="/details" element={<ViewDetails />} /> {/* Fixed path */}
                    <Route path="/request-fuel/:supplierId" element={<RequestFuel />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
