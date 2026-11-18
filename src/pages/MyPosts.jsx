
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

import {
    collection,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import {
    Plus,
    MapPin,
    CalendarDays,
    PackageOpen,
    AlertCircle,
} from "lucide-react";

import { auth, db } from "../firebase";

// Convert Firestore Timestamp into a readable date
function formatDate(value) {
    if (!value) return "Date not available";

    const date = value.toDate
        ? value.toDate()
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date not available";
    }

    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

// Get timestamp for sorting posts
function getTime(value) {
    if (!value) return 0;

    const date = value.toDate
        ? value.toDate()
        : new Date(value);

    return Number.isNaN(date.getTime())
        ? 0
        : date.getTime();
}

function MyPosts() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Listen to Firebase authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);

            if (currentUser) {
                setIsLoading(true);
                setErrorMessage("");
            } else {
                setItems([]);
                setIsLoading(false);
                setErrorMessage("");
            }
        });

        return () => unsubscribe();
    }, []);
    // Load only the posts created by the logged-in user
    useEffect(() => {
        if (!user) {
            return;
        }

        const itemsQuery = query(
            collection(db, "items"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(
            itemsQuery,
            (snapshot) => {
                const userItems = snapshot.docs.map((document) => ({
                    id: document.id,
                    ...document.data(),
                }));

                // Show newest posts first
                userItems.sort(
                    (a, b) => getTime(b.createdAt) - getTime(a.createdAt)
                );

                setItems(userItems);
                setIsLoading(false);
            },
            (error) => {
                console.error("My Posts Error:", error);

                setErrorMessage(
                    "Unable to load your posts. Please try again."
                );

                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Authentication loading screen
    if (authLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-lime-500" />
            </div>
        );
    }

    // Require users to sign in
    if (!user) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-5">
                <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <PackageOpen
                        size={42}
                        className="mx-auto mb-4 text-lime-500"
                    />

                    <h1 className="text-2xl font-bold text-slate-900">
                        Sign in to view your posts
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Please sign in to see and manage the items you have posted.
                    </p>

                    <Link
                        to="/signin"
                        className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-lime-400 hover:text-slate-950"
                    >
                        Sign In
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-slate-50 px-5 py-12 sm:px-8"
        >
            <div className="mx-auto max-w-7xl">

                {/* Page Heading */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-lime-600">
                            Your Activity
                        </p>

                        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                            My Posts
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                            View the lost and found items you have shared with the campus community.
                        </p>
                    </div>

                    <Link
                        to="/create-post/lost"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:-translate-y-1 hover:bg-lime-500 hover:shadow-md"
                    >
                        <Plus size={18} />
                        Create Post
                    </Link>
                </div>

                {/* Post Count */}
                {!isLoading && (
                    <div className="mb-6 text-sm font-medium text-slate-500">
                        {items.length} {items.length === 1 ? "post" : "posts"} found
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex min-h-[35vh] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-lime-500" />
                    </div>
                )}

                {/* Error State */}
                {!isLoading && errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                        <AlertCircle
                            size={30}
                            className="mx-auto mb-3 text-red-500"
                        />

                        <p className="font-semibold text-red-700">
                            {errorMessage}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !errorMessage && items.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <PackageOpen
                            size={48}
                            className="mx-auto mb-4 text-slate-300"
                        />

                        <h2 className="text-xl font-bold text-slate-900">
                            You haven't posted anything yet
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                            When you create a lost or found item post, it will appear here.
                        </p>

                        <Link
                            to="/create-post/lost"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-lime-500"
                        >
                            <Plus size={18} />
                            Create Your First Post
                        </Link>
                    </div>
                )}

                {/* User Posts */}
                {!isLoading && !errorMessage && items.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item, index) => {
                            const isLost = item.type === "lost";
                            const isReturned = item.status === "returned";

                            return (
                                <motion.article
                                    key={item.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                    }}
                                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-lime-300 hover:shadow-lg shadow-blue-500/50 transition-all duration-200"
                                >
                                    {/* Post Type and Status */}
                                    <div className="mb-5 flex items-center justify-between gap-3">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${isLost
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-lime-50 text-lime-700"
                                                }`}
                                        >
                                            {isLost ? "LOST ITEM" : "FOUND ITEM"}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isReturned
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-emerald-50 text-emerald-600"
                                                }`}
                                        >
                                            {isReturned ? "Returned" : "Active"}
                                        </span>
                                    </div>

                                    {/* Item Information */}
                                    <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-lime-700">
                                        {item.title || "Untitled Item"}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        {item.category || "Uncategorized"}
                                    </p>

                                    <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                                        {item.description || "No description provided."}
                                    </p>

                                    {/* Location */}
                                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin size={16} className="shrink-0 text-lime-600" />
                                        <span className="truncate">
                                            {item.location || "Location not specified"}
                                        </span>
                                    </div>

                                    {/* Item Date */}
                                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                        <CalendarDays size={16} className="shrink-0 text-lime-600" />
                                        <span>{formatDate(item.itemDate)}</span>
                                    </div>

                                    <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                                        Posted by you
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.main>
    );
}

export default MyPosts;
