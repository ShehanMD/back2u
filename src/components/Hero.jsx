
import { motion } from "motion/react";
import { useNavigate } from "react-router";


import {
    ArrowRight,
    Search,
    MapPin,
    CreditCard,
    KeyRound,
    Backpack,
    ShieldCheck,
    PackagePlus,
    PackageCheck,
} from "lucide-react";

// Example items for our preview card
const sampleItems = [
    {
        name: "Student ID Card",
        location: "Main Library",
        type: "FOUND",
        icon: CreditCard,
    },
    {
        name: "Key Bunch",
        location: "Lecture Hall B",
        type: "FOUND",
        icon: KeyRound,
    },
    {
        name: "Black Backpack",
        location: "Science Block",
        type: "LOST",
        icon: Backpack,
    },
];

function Hero() {
    const navigate = useNavigate();

    return (

        <main>

            {/* Hero Section */}
            <section
                id="home"
                className="relative isolate overflow-hidden bg-slate-50"
            >

                {/* Background Decorations */}
                <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-lime-200/60 blur-3xl" />

                <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />

                <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 md:grid-cols-2 md:gap-10 lg:px-8 lg:pb-28 lg:pt-24">

                    {/* Left Side - Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="relative z-10"
                    >



                        {/* Main Heading */}
                        <h1 className="max-w-2xl text-2xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-6xl lg:text-5xl">
                            Lost something?
                            <br />
                            

                            <span className="mt-2 block text-lime-500 lg:text-7xl">
                                Let's bring it Back2U.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-lg text-xm leading-8 text-slate-600 sm:text-base">
                            From lost student IDs to found keys, Back2U helps
                            campus communities reconnect belongings with
                            the people they belong to.
                        </p>


                        {/* Action Buttons */}
                        <div className="mt-9 flex flex-wrap items-center gap-4">

                            {/* Lost Item Button */}
                            {/* Lost Item Button */}
                            <motion.button
                                type="button"
                                onClick={() => navigate("/create-post/lost")}
                                whileHover={{ scale: 1.04, y: -3 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="group inline-flex cursor-pointer items-center gap-3 rounded-full border-0 bg-red-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-colors duration-200 hover:bg-red-600"
                            >
                                <PackagePlus size={19} />

                                Report Lost Item

                                <ArrowRight
                                    size={18}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </motion.button>

                            {/* Found Item Button */}
                            <motion.button
                                type="button"
                                onClick={() => navigate("/create-post/found")}
                                whileHover={{ scale: 1.04, y: -3 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="group inline-flex cursor-pointer items-center gap-3 rounded-full border-0 bg-lime-300 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-lime-500/20 transition-colors duration-200 hover:bg-lime-400"
                            >
                                <PackageCheck size={19} />

                                Report Found Item

                                <ArrowRight
                                    size={18}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </motion.button>

                        </div>


                        {/* Small Trust Message */}
                        <div className="mt-9 flex items-center gap-3 text-sm text-slate-500">
                            <ShieldCheck size={20} className="text-lime-600" />
                            A little help can make a big difference.
                        </div>

                    </motion.div>

                    {/* Right Side - Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                        className="relative mx-auto w-full max-w-xl"
                    >

                        {/* Decorative Shapes */}
                        <div className="absolute -right-4 top-10 h-28 w-28 rounded-full bg-lime-300/70 blur-2xl" />
                        <div className="absolute -bottom-5 -left-4 h-32 w-32 rounded-full bg-indigo-200/80 blur-2xl" />

                        {/* Main Dark Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            id="explore"
                            className="relative rounded-4xl bg-slate-950 p-4 shadow-2xl shadow-slate-900/15 sm:p-6"
                        >

                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.2em] text-lime-300">
                                        BACK2U / COMMUNITY BOARD
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                                        Every item has a story.
                                    </h2>
                                </div>

                                <div className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300">
                                    Preview
                                </div>
                            </div>

                            {/* White Listing Area */}
                            <div className="mt-6 rounded-3xl bg-white p-4 sm:p-5">

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold tracking-wider text-lime-700">
                                            SAMPLE LISTINGS
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                                            Lost & Found Around Campus
                                        </h3>
                                    </div>

                                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                                        <Search size={19} />
                                    </div>
                                </div>

                                {/* Item List */}
                                <div className="mt-5 space-y-3">

                                    {sampleItems.map((item) => {
                                        const ItemIcon = item.icon;

                                        return (
                                            <motion.div
                                                key={item.name}
                                                whileHover={{ y: -3, scale: 1.01 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition-shadow duration-200 hover:shadow-md sm:p-4"
                                            >

                                                {/* Item Icon */}
                                                <div
                                                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.type === "FOUND"
                                                        ? "bg-lime-100 text-lime-700"
                                                        : "bg-indigo-50 text-indigo-600"
                                                        }`}
                                                >
                                                    <ItemIcon size={20} />
                                                </div>

                                                {/* Item Information */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-slate-900">
                                                        {item.name}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                        <MapPin size={13} />
                                                        {item.location}
                                                    </p>
                                                </div>

                                                {/* Lost / Found Label */}
                                                <span
                                                    className={`rounded-full px-2.5 py-1.5 text-[10px] font-black tracking-wide ${item.type === "FOUND"
                                                        ? "bg-lime-100 text-lime-800"
                                                        : "bg-indigo-50 text-indigo-700"
                                                        }`}
                                                >
                                                    {item.type}
                                                </span>

                                            </motion.div>
                                        );
                                    })}

                                </div>
                            </div>

                            {/* Bottom Message */}
                            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-lime-300 p-4 text-slate-950">
                                <ShieldCheck size={25} />

                                <div>
                                    <p className="text-xs font-black tracking-wider">
                                        THE BACK2U COMMUNITY
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        Helping lost belongings find their way home.
                                    </p>
                                </div>
                            </div>

                        </motion.div>
                    </motion.div>

                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-white py-20 sm:py-24">

                <div className="mx-auto max-w-7xl px-5 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <h2 className="mt-auto text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                            Three steps closer to a reunion.
                        </h2>

                        <p className="mt-4 leading-7 text-slate-500">
                            Whether you lost something or found something,
                            getting connected should be simple.
                        </p>
                    </div>

                    {/* Three Steps */}
                    <div className="mt-12 grid gap-5 md:grid-cols-3 ">

                        {[
                            {
                                number: "01",
                                title: "Post an Item",
                                description:
                                    "Report something you've lost or found on campus with a few simple details.",
                            },
                            {
                                number: "02",
                                title: "Spot a Match",
                                description:
                                    "Explore community posts and discover items that could match what you're looking for.",
                            },
                            {
                                number: "03",
                                title: "Reconnect",
                                description:
                                    "Receive a notification and connect with the other person to verify the item.",
                            },
                        ].map((step) => (
                            <motion.div
                                key={step.number}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                                className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition-shadow duration-200 hover:shadow-lg shadow-lg shadow-blue-500/50"
                            >
                                <span className="text-sm font-black tracking-widest text-lime-600">
                                    STEP {step.number}
                                </span>

                                <h3 className="mt-5 text-xl font-bold text-slate-950">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}

                    </div>
                </div>
            </section>

        </main>
    );
}

export default Hero;
