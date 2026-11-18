
import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ItemsPage from "./pages/ItemsPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";

function App() {
  // Get the current URL location
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navigation Bar */}
      <Navbar />

      {/* Page Transition Animation */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
        >

          {/* Application Routes */}
          <Routes location={location}>

            {/* Home Page */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* Items Page */}
            <Route
              path="/items"
              element={<ItemsPage />}
            />

            <Route
              path="/my-posts"
              element={<MyPosts />}
            />

            {/* Authentication Pages */}
            <Route
              path="/signup"
              element={<SignUp />}
            />

            <Route
              path="/signin"
              element={<SignIn />}
            />

            {/* Create Lost / Found Post */}
            <Route
              path="/create-post/:type"
              element={<CreatePost />}
            />

            {/* 404 - Not Found */}
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

          </Routes>

        </motion.div>
      </AnimatePresence>

    </div>
  );
}

export default App;
