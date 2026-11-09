import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ItemsPage from "./pages/ItemsPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/items"
          element={<ItemsPage />}
        />

        <Route
          path="*"
          element={
            <div className="flex min-h-[60vh] items-center justify-center">
              <h1 className="text-3xl font-bold">
                404 - Page Not Found
              </h1>
            </div>
          }
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        <Route
          path="/signin"
          element={<SignIn />}
        />

       <Route path="/create-post/:type" element={<CreatePost />} />

      </Routes>

    </div>
  );
}

export default App;