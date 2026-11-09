
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";

import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Email and Password Sign In
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/");
        } catch (error) {
            console.error("Sign In Error:", error);

            if (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                setError("Incorrect email or password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            setError("");
            setLoading(true);

            const provider = new GoogleAuthProvider();

            await signInWithPopup(auth, provider);

            navigate("/");
        } catch (error) {
            console.error("Google Sign In Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen bg-slate-50 px-4 py-16"
        >

            <div className="mx-auto max-w-md">

                {/* Back2U Logo */}
                <Link
                    to="/"
                    className="mb-10 flex items-center justify-center gap-2"
                >

                    <span className="text-2xl font-black tracking-tight text-slate-950">
                        Back<span className="text-lime-500">2U</span>
                    </span>
                </Link>

                {/* Sign In Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black tracking-tight text-slate-950">
                            Welcome Back!
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to continue your Back2U journey.
                        </p>
                    </div>

                    {/* Email Sign In Form */}
                    <form onSubmit={handleSignIn} className="space-y-5">

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-lime-500 hover:shadow-lg hover:shadow-lime-500/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Google Sign In */}
                    <div className="mt-5">

                        <div className="relative mb-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>

                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-sm text-slate-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-md disabled:opacity-60 cursor-pointer"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="h-5 w-5"
                            />

                            Continue with Google
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-7 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold text-lime-600 hover:text-lime-700 cursor-pointer"
                        >
                            Create Account
                        </Link>
                    </p>

                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Welcome back to the Back2U campus community.
                </p>

            </div>
        </motion.div>
    );
}

export default SignIn;
