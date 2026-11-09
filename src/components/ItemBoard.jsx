
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  Search,
  MapPin,
  CalendarDays,
  CreditCard,
  KeyRound,
  Backpack,
  Headphones,
  BookOpen,
  Smartphone,
  PackageSearch,
  SlidersHorizontal,
} from "lucide-react";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Default categories
const baseCategories = [
  "ID Cards",
  "Bags",
  "Keys",
  "Electronics",
  "Books",
  "Accessories",
];

// Filter buttons
const filters = ["ALL", "LOST", "FOUND"];

// Select an icon based on item name and category
function getItemIcon(title, category) {
  const itemName = (title || "").toLowerCase();
  const itemCategory = (category || "").toLowerCase();

  if (
    itemName.includes("earbud") ||
    itemName.includes("headphone")
  ) {
    return Headphones;
  }

  if (
    itemCategory.includes("id") ||
    itemCategory.includes("card")
  ) {
    return CreditCard;
  }

  if (itemCategory.includes("bag")) {
    return Backpack;
  }

  if (itemCategory.includes("key")) {
    return KeyRound;
  }

  if (itemCategory.includes("book")) {
    return BookOpen;
  }

  if (
    itemCategory.includes("electronic") ||
    itemCategory.includes("phone")
  ) {
    return Smartphone;
  }

  return PackageSearch;
}

// Convert Firestore date into a readable date
function formatItemDate(value) {
  if (!value) return "Date unavailable";

  const date =
    typeof value.toDate === "function"
      ? value.toDate()
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function ItemBoard() {
  // Store items received from Firestore
  const [items, setItems] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");

  // Lost / Found filter state
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Category filter state
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  // Load items from Firestore in real time
  useEffect(() => {
    console.log("Connected Firebase Project:", db.app.options.projectId);
    console.log("Firestore Collection:", collection(db, "items").path);
    const unsubscribe = onSnapshot(
      collection(db, "items"),

      (snapshot) => {
        console.log("Snapshot size:", snapshot.size);
        console.log("From cache:", snapshot.metadata.fromCache);

        console.table(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        const loadedItems = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          // Show only active posts
          .filter((item) => item.status === "active")
          .map((item) => ({
            id: item.id,
            name: item.title || "Untitled Item",
            category: item.category || "Other",
            type: (item.type || "lost").toUpperCase(),
            location: item.location || "Location not specified",
            date: formatItemDate(item.itemDate || item.createdAt),
            description:
              item.description || "No description provided.",
            icon: getItemIcon(item.title, item.category),
          }));

        setItems(loadedItems);
        setLoadError("");
        setIsLoading(false);
      },

      (error) => {
        console.error("Error loading items:", error);

        setLoadError(
          "Unable to load listings. Please check your connection and try again."
        );

        setIsLoading(false);
      }
    );

    // Stop listening when this component is removed
    return () => unsubscribe();
  }, []);

  // Add categories found in Firestore automatically
  const categories = [
    "All Categories",
    ...new Set([
      ...baseCategories,
      ...items.map((item) => item.category).filter(Boolean),
    ]),
  ];

  // Filter listings based on user selections
  const filteredItems = items.filter((item) => {
    const matchesType =
      activeFilter === "ALL" || item.type === activeFilter;

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    const searchText = searchTerm.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.location.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText);

    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <section id="item-board" className="bg-slate-100 py-20 sm:py-24">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-black tracking-[0.2em] text-lime-700">
              CAMPUS COMMUNITY BOARD
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Lost something?
              <br className="sm:hidden" />
              {" "}Found something?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore recent lost and found reports from your
              campus community.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <PackageSearch size={20} className="text-lime-600" />
            Community listings
          </div>

        </div>

        {/* Search and Filters */}
        <div className="mt-10 rounded-3xl border border-slate-300 bg-white p-4 shadow-md shadow-slate-900/5 sm:p-6">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* Search Bar */}
            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by item name, location or category..."
                className="w-full rounded-2xl border border-slate-300 bg-slate-100 py-4 pl-12 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              />

            </div>

            {/* Category Selection */}
            <div className="relative lg:w-56">

              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-300 bg-slate-100 py-4 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all duration-200 hover:border-lime-400 focus:border-lime-500 focus:bg-white focus:ring-4 focus:ring-lime-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Lost / Found Filter Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2">

            {filters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className={`rounded-full px-5 py-2.5 text-xs font-bold transition-colors duration-200 ${activeFilter === filter
                  ? "bg-slate-950 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-lime-100 hover:text-slate-950"
                  }`}
              >
                {filter === "ALL"
                  ? "All Items"
                  : filter === "LOST"
                    ? "Lost Items"
                    : "Found Items"}
              </motion.button>
            ))}

            <p className="ml-auto self-center text-xs font-medium text-slate-500">
              {filteredItems.length} items found
            </p>

          </div>

        </div>

        {/* Item Cards */}
        <motion.div
          layout
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >

          {isLoading ? (

            <div className="col-span-full rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center">
              <p className="text-sm font-medium text-slate-500">
                Loading community listings...
              </p>
            </div>

          ) : loadError ? (

            <div className="col-span-full rounded-3xl border border-red-200 bg-white px-5 py-14 text-center">
              <PackageSearch
                size={40}
                className="mx-auto text-red-300"
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Something went wrong
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {loadError}
              </p>
            </div>

          ) : (

            <AnimatePresence mode="popLayout">

              {filteredItems.map((item) => {
                const ItemIcon = item.icon;

                const isFound = item.type === "FOUND";

                return (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -5 }}
                    transition={{
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    className="group overflow-hidden rounded-3xl border border-slate-300 bg-white p-5 shadow-lg shadow-blue-500/50 transition-all duration-200 hover:-translate-y-1 hover:border-lime-400 hover:shadow-xl hover:shadow-slate-900/10"
                  >

                    {/* Card Top */}
                    <div className="flex items-start justify-between">

                      <div
                        className={`grid h-14 w-14 place-items-center rounded-2xl ${isFound
                          ? "bg-lime-100 text-lime-700"
                          : "bg-red-50 text-red-500"
                          }`}
                      >
                        <ItemIcon size={25} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-black tracking-wider ${isFound
                          ? "bg-lime-100 text-lime-800"
                          : "bg-red-50 text-red-600"
                          }`}
                      >
                        {item.type}
                      </span>

                    </div>

                    {/* Item Information */}
                    <div className="mt-6">

                      <p className="text-xs font-semibold text-slate-400">
                        {item.category}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-950 transition-colors duration-200 group-hover:text-lime-700">
                        {item.name}
                      </h3>

                      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>

                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin size={15} />
                        {item.location}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        {item.date}
                      </div>

                    </div>

                  </motion.article>
                );
              })}

            </AnimatePresence>

          )}

        </motion.div>

        {/* No Results Message */}
        {!isLoading && !loadError && filteredItems.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">

            <PackageSearch
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No items found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or change your filters.
            </p>

          </div>
        )}

        {/* Database Notice */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Listings are loaded from the Back2U community database.
        </p>

      </div>
    </section>
  );
}

export default ItemBoard;
