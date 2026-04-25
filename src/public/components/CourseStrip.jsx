import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../shared/api";
import { useBranding } from "../../shared/hooks/useBranding";
import { BookOpen, ChevronRight, Star } from "lucide-react";

export default function FeaturedCoursesStrip() {
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]); // ✅ NEW
    const brand = useBranding();
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function load() {
            try {
                const [courseRes, groupRes] = await Promise.all([
                    api.get("/courses"),
                    api.get("/course-groups"), // public groups
                ]);

                setCourses(courseRes.data || []);
                setGroups(groupRes.data || []);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
            setScrollProgress(progress);
        }
    };

    /* ================= GROUP LOGIC ================= */

    // pick ONE course per group
    const groupPreviewCourses = groups
        .map((g) => {
            const first = g.courses?.[0]?.course;
            if (!first) return null;

            return {
                ...first,
                groupName: g.name, // attach group label
            };
        })
        .filter(Boolean);

    // collect grouped ids
    const groupedIds = new Set();
    groups.forEach((g) =>
        g.courses?.forEach((c) => groupedIds.add(c.course.id))
    );

    // remove grouped courses from normal list
    const standaloneCourses = courses.filter(
        (c) => !groupedIds.has(c.id)
    );

    // final merged list
    const finalCourses = [...groupPreviewCourses, ...standaloneCourses];

    return (
        <section className="bg-white py-0 overflow-hidden" id="courses">
            <div
                className="max-w-screen mx-auto px-6 py-6 md:px-16"
                style={{ backgroundColor: brand.colors.primary }}
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-6 text-white">
                    <h2 className="text-xl font-bold">
                        Our Courses →
                    </h2>

                    <Link
                        to="/courses"
                        className="text-sm opacity-80 hover:opacity-100"
                        style={{ color: "white" }}
                    >
                        See all
                    </Link>
                </div>

                {/* SCROLL AREA */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="relative z-10 flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {finalCourses.slice(0, 10).map((course) => (
                        <Link
                            to={`/courses/${course.id}`}
                            key={`${course.id}-${course.groupName || "single"}`}
                            className="min-w-[280px] md:min-w-[320px] bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group snap-start"
                        >
                            {/* Thumbnail */}
                            <div className="h-44 bg-slate-100 overflow-hidden relative">
                                {course.thumbnail ? (
                                    <img
                                        src={`${api.defaults.baseURL.replace("/api", "")}${course.thumbnail}`}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                                        No Preview
                                    </div>
                                )}

                                {/* TYPE BADGE */}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider rounded-lg text-slate-800 shadow-sm">
                                    {course.type || "Course"}
                                </div>

                                {/* ✅ GROUP BADGE */}
                                {course.groupName && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow">
                                        {course.groupName}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                        E
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                                        {brand.siteName || "LMS Platform"}
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 h-10">
                                    {course.title}
                                </h3>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                            <Star size={14} fill="currentColor" /> {course.rating || 4.8}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                                            <BookOpen size={14} /> {course.lessonsCount || 12}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* SCROLL INDICATOR */}
                <div className="relative z-10 mt-4 flex justify-center items-center gap-2">
                    <div className="relative w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-white transition-all duration-200 ease-out rounded-full"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}