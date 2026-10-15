import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Trainer } from '../../types';
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Award,
  Sparkles,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { courses, trainers, candidates, settings } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0] || {} as Course);
  const [activeTab, setActiveTab] = useState<'courses' | 'trainers'>('courses');

  const leadTrainer = trainers.find((t) => t.id === selectedCourse.leadTrainerId);
  const enrolledCandidates = candidates.filter(
    (c) => c.courseId === selectedCourse.id && (c.status === 'enrolled' || c.status === 'completed')
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Curriculum & Faculty Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configurable course modules, trainer assignments, schedules, and class capacities.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-stone-900 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'courses' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Training Programs ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('trainers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'trainers' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-white'
            }`}
          >
            Faculty & Trainers ({trainers.length})
          </button>
        </div>
      </div>

      {activeTab === 'courses' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <div className="space-y-3">
            {courses.map((course) => {
              const isSelected = course.id === selectedCourse.id;
              const count = candidates.filter(
                (c) => c.courseId === course.id && (c.status === 'enrolled' || c.status === 'completed')
              ).length;

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-stone-900 border-amber-600/70 shadow-lg shadow-amber-950/20'
                      : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                    <span>{course.category}</span>
                    <span className="font-mono text-emerald-400">${course.totalFee} {settings.currency}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{course.name}</h3>
                  <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800/80">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-500" />
                      <span>{course.startDate}</span>
                    </span>
                    <span className="font-mono text-stone-300">
                      {count} / {course.capacity} Students
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Course Details Pane */}
          <div className="lg:col-span-2 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COURSE CURRICULUM PROFILE</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white">{selectedCourse.name}</h2>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">{selectedCourse.description}</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Tuition & Kit Fee</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${selectedCourse.totalFee} {settings.currency}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  (${selectedCourse.defaultRegistrationFee} reg + ${selectedCourse.defaultTuitionFee} tuition)
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Cohort Duration</span>
                <span className="font-bold text-white">{selectedCourse.duration}</span>
                <span className="text-[10px] text-stone-500 block">
                  {selectedCourse.startDate} – {selectedCourse.endDate}
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Class Capacity</span>
                <span className="font-bold text-white">
                  {enrolledCandidates.length} / {selectedCourse.capacity}
                </span>
                <span className="text-[10px] text-emerald-400 block">
                  {selectedCourse.capacity - enrolledCandidates.length} spots left
                </span>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px] uppercase">Cert Requirements</span>
                <span className="font-bold text-amber-300">
                  {selectedCourse.minimumAttendancePercentage}% Att.
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {selectedCourse.passingGradePercentage}% pass mark
                </span>
              </div>
            </div>

            {/* Syllabus Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Theory */}
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Theory & Sanitation Modules</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {selectedCourse.theoryModules.map((mod, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-mono text-[10px] shrink-0 mt-0.5">T{idx + 1}.</span>
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical */}
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Hands-On Practical Modules</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {selectedCourse.practicalModules.map((mod, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-mono text-[10px] shrink-0 mt-0.5">P{idx + 1}.</span>
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lead Trainer Card */}
            {leadTrainer && (
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 text-amber-300 font-serif font-bold text-sm flex items-center justify-center">
                    {leadTrainer.fullName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Lead Instructor</span>
                    <span className="font-semibold text-white text-xs">{leadTrainer.fullName}</span>
                    <span className="text-[11px] text-stone-400 block">{leadTrainer.specialization}</span>
                  </div>
                </div>

                <div className="text-right text-xs text-stone-400 font-mono">
                  {leadTrainer.phone}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Faculty List */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-rose-600 text-white font-serif font-bold text-base flex items-center justify-center">
                  {trainer.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{trainer.fullName}</h3>
                  <p className="text-xs text-amber-300">{trainer.specialization}</p>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">{trainer.bio}</p>

              <div className="pt-3 border-t border-stone-800 text-xs text-stone-400 space-y-1">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span className="font-mono text-stone-300">{trainer.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span className="font-mono text-stone-300">{trainer.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
