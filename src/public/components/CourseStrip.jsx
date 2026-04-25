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
                    api.get("/course-groups"),
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

    return (
        <section className="bg-white py-0 overflow-hidden" id="courses">

            <div
                className="max-w-screen mx-auto px-6 py-6 md:px-16"
                style={{ backgroundColor: brand.colors.primary }}
            >

                {/* ================= GROUP STRIPS ================= */}
                {groups.map((group) => (
                    <div key={group.id} className="mb-10">

                        {/* Group Title */}
                        <div className="flex items-center justify-between mb-4 text-white">
                            <h2 className="text-lg font-bold">
                                {group.name} →
                            </h2>
                        </div>

                        {/* Horizontal Scroll */}
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">

                            {group.courses?.map((item) => {
                                const course = item.course;

                                return (
                                    <Link
                                        to={`/courses/${course.id}`}
                                        key={course.id}
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
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-3">
                                            <h3 className="font-bold text-slate-900 line-clamp-2">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-amber-500 text-xs">
                                                        <Star size={14} fill="currentColor" /> {course.rating || 4.8}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                                                        <BookOpen size={14} /> {course.lessonsCount || 12}
                                                    </div>
                                                </div>

                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                        </div>
                    </div>
                ))}

                {/* ================= ORIGINAL STRIP ================= */}
                <div className="flex items-center justify-between mb-6 text-white">
                    <h2 className="text-xl font-bold">
                        All Courses →
                    </h2>

                    <Link
                        to="/courses"
                        className="text-sm opacity-80 hover:opacity-100"
                        style={{ color: "white" }}
                    >
                        See all
                    </Link>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="relative z-10 flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory"
                >
                    {courses.slice(0, 10).map((course) => (
                        <Link
                            to={`/courses/${course.id}`}
                            key={course.id}
                            className="min-w-[280px] md:min-w-[320px] bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group snap-start"
                        >
                            <div className="h-44 bg-slate-100 overflow-hidden">
                                {course.thumbnail ? (
                                    <img
                                        src={`${api.defaults.baseURL.replace("/api", "")}${course.thumbnail}`}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                                        No Preview
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="font-bold text-slate-900">
                                    {course.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}