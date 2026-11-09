
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { motion } from "motion/react";
import {
  ArrowLeft,
  Search,
  PackageCheck,
  MapPin,
  CalendarDays,
  Tag,
  FileText,
  LoaderCircle,
} from "lucide-react";

import { auth, db } from "../firebase";

const categories = [
  "ID Cards",
  "Bags",
  "Keys",
  "Electronics",
  "Books",
  "Accessories",
  "Clothing",
  "Other",
];

function CreatePost() {
  const navigate = useNavigate();
  const { type } = useParams();

  // Convert route parameter to lowercase
  const postType = type?.toLowerCase();

  // Logged-in user
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [itemDate, setItemDate] = useState("");

  // Form status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Protect this page from invalid post types
  useEffect(() => {
    if (!["lost", "found"].includes(postType)) {
      navigate("/", { replace: true });
    }
  }, [postType, navigate]);

  // Submit listing to Firestore
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage("Please sign in before creating a listing.");
      return;
    }

    if (!title.trim() || !category || !description.trim() ||
        !location.trim() || !itemDate) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // Convert selected date into a Firestore timestamp
      const selectedDate = new Date(`${itemDate}T12:00:00`);

      if (Number.isNaN(selectedDate.getTime())) {
        throw new Error("Please select a valid date.");
      }

      // Save the listing in Firestore
      await addDoc(collection(db, "items"), {
        title: title.trim(),
        description: description.trim(),
        type: postType,
        category,
        location: location.trim(),
        itemDate: Timestamp.fromDate(selectedDate),
        imageUrl: "",
        userId: user.uid,
        userName:
          user.displayName ||
          user.email?.split("@")[0] ||
          "Back2U User",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Go to the community listings page
      navigate("/items");
    } catch (error) {
      console.error("Error creating listing:", error);

      if (error.code === "permission-denied") {
        setErrorMessage(
          "You do not have permission to create this listing. Please check your account and Firestore rules."
        );
      } else {
        setErrorMessage(
          error.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading screen while checking login status
  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-lime-600" size={35} />
      </div>
    );
  }

  // Require authentication
  if (!user) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5 py-16">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <Search size={40} className="mx-auto text-lime-600" />

          <h2 className="mt-5 text-2xl font-bold text-slate-950">
            Sign in required
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Please sign in to your Back2U account before creating a listing.
          </p>

          <button
            onClick={() => navigate("/signin")}
            className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-lime-700"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-3 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            Go Back Home
          </button>
        </div>
      </section>
    );
  }

  const isFound = postType === "found";

  return (
    <section className="min-h-screen bg-slate-100 px-5 py-16 sm:py-20">

      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 transition duration-200 hover:text-lime-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        {/* Heading */}
        <div className="mb-8">

          <div
            className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${
              isFound
                ? "bg-lime-100 text-lime-700"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isFound ? (
              <PackageCheck size={28} />
            ) : (
              <Search size={28} />
            )}
          </div>

          <p className="text-xs font-black tracking-[0.2em] text-lime-700">
            BACK2U COMMUNITY
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isFound ? "Post a Found Item" : "Report a Lost Item"}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            {isFound
              ? "Help someone find their belongings by sharing details about the item you found."
              : "Share details about your missing item so someone in your campus community can help you find it."}
          </p>

        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9"
        >

          {/* Lost / Found Selection */}
          <div className="mb-8">

            <label className="mb-3 block text-sm font-bold text-slate-800">
              Listing Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => navigate("/create-post/lost")}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition duration-200 ${
                  !isFound
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-red-200"
                }`}
              >
                <Search size={19} />
                Lost Item
              </button>

              <button
                type="button"
                onClick={() => navigate("/create-post/found")}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition duration-200 ${
                  isFound
                    ? "border-lime-500 bg-lime-50 text-lime-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-lime-200"
                }`}
              >
                <PackageCheck size={19} />
                Found Item
              </button>

            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Item Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Tag size={16} />
                Item Name
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Black Wallet"
                maxLength={100}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              >
                <option value="">Select a category</option>

                {categories.map((itemCategory) => (
                  <option key={itemCategory} value={itemCategory}>
                    {itemCategory}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <FileText size={16} />
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the item. Include useful details that may help identify it..."
                rows={5}
                maxLength={1000}
                required
                className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {description.length}/1000
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <MapPin size={16} />
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Main Library"
                maxLength={150}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                <CalendarDays size={16} />
                {isFound ? "Date Found" : "Date Lost"}
              </label>

              <input
                type="date"
                value={itemDate}
                onChange={(event) => setItemDate(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition duration-200 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-bold text-white transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                isFound
                  ? "bg-lime-600 hover:bg-lime-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                isFound ? "Publish Found Item" : "Publish Lost Item"
              )}
            </button>

          </form>

        </motion.div>

        <p className="mt-6 text-center text-xs leading-6 text-slate-400">
          Please provide accurate information. Do not include private information
          such as passwords or identity document numbers in your listing.
        </p>

      </div>

    </section>
  );
}

export default CreatePost;
