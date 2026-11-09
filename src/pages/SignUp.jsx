
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";

import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

function SignUp() {

    // Form data
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Form status
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleGoogleSignUp = async () => {
        try {
            setError("");
            setLoading(true);

            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);

            navigate("/");
        } catch (error) {
            console.error("Google Sign Up Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSignUp = async (e) => {
        e.preventDefault();

        setError("");

        // Check passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Save user's display name
            await updateProfile(userCredential.user, {
                displayName: fullName,
            });

            // Navigate after successful registration
            navigate("/");

        } catch (error) {

            console.error("SIGN UP ERROR:", error);
            console.log("Error Code:", error.code);
            console.log("Error Message:", error.message);

            setError(error.code + " - " + error.message);

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

                {/* Logo */}
                <Link to="/" className="mb-10 flex items-center justify-center gap-2">

                    <span className="text-2xl font-black tracking-tight text-slate-950">
                        Back<span className="text-lime-500">2U</span>
                    </span>
                </Link>

                {/* Signup Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black tracking-tight text-slate-950">
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Join Back2U and reconnect lost belongings.
                        </p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
                            />
                        </div>

                        {/* Email */}
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

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-lime-400 px-5 py-3.5 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-lime-500 hover:shadow-lg hover:shadow-lime-500/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                    </form>

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
                            onClick={handleGoogleSignUp}
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

                    {/* Sign In Link */}
                    <p className="mt-7 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <span className="font-semibold text-lime-600">
                            <Link to="/signin" className="font-semibold text-lime-600 hover:text-lime-700 transition-colors duration-300">Sign In</Link>
                        </span>
                    </p>

                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    By joining Back2U, you help campus belongings find their way home.
                </p>

            </div>

        </motion.div >
    );
}

export default SignUp;
