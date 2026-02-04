import { Routes, Route, Link } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import { AuthProvider } from "./context/AuthContext";
import CompareBar from "./components/CompareBar";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage"
import AuthPage from "./pages/Auth/AuthPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import InteriorsPage from "./pages/InteriorsPage";
import InteriorDetailPage from "./pages/InteriorDetailPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import AddInteriorPage from "./pages/AddInteriorPage";
import WishlistPage from "./pages/WishlistPage";
import AgentDashboard from "./pages/AgentDashboard";

function App() {

  return (
    <AuthProvider>
      <ComparisonProvider>
        <WishlistProvider>
          <div className="w-full min-h-screen bg-white">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <HomePage />
              } />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/interiors" element={<InteriorsPage />} />
              <Route path="/interiors/:id" element={<InteriorDetailPage />} />
              <Route path="/add-property" element={<AddPropertyPage />} />
              <Route path="/edit-property/:id" element={<AddPropertyPage />} />
              <Route path="/add-interior" element={<AddInteriorPage />} />
              <Route path="/edit-interior/:id" element={<AddInteriorPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/dashboard" element={<AgentDashboard />} />
            </Routes>

            <CompareBar />

          </div>
        </WishlistProvider>
      </ComparisonProvider >
    </AuthProvider>
  );
}

export default App;
