import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentGrade } from '../../types';
import {
  BookOpenCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
  User,
  History,
  AlertCircle,
  Save,
  Check
} from 'lucide-react';

export const GradingView: React.FC = () => {
  const { courses, candidates, trainers, grades, saveGrade, currentUser, settings } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'CRS-WIG-01');
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<AssessmentGrade | null>(null);

  // Form State
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || '');
  const [moduleName, setModuleName] = useState('');
  const [assessmentType, setAssessmentType] = useState<'theory' | 'practical' | 'final_exam' | 'project'>('practical');
  const [maximumScore, setMaximumScore] = useState<number>(100);
  const [scoreObtained, setScoreObtained] = useState<number>(85);
  const [weightPercentage, setWeightPercentage] = useState<number>(30);
  const [trainerFeedback, setTrainerFeedback] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const courseCandidates = candidates.filter(
    (c) => c.courseId === selectedCourseId && (c.status === 'enrolled' || c.status === 'completed')
  );

  const courseGrades = grades.filter((g) => g.courseId === selectedCourseId);

  const handleOpenAdd = () => {
    setEditingGrade(null);
    setCandidateId(courseCandidates[0]?.id || candidates[0]?.id || '');
    setModuleName(selectedCourse?.practicalModules[0] || 'Lace Melt Practical Demonstration');
    setAssessmentType('practical');
    setMaximumScore(100);
    setScoreObtained(85);
    setWeightPercentage(30);
    setTrainerFeedback('');
    setIsPublished(true);
    setShowAddGradeModal(true);
  };

  const handleOpenEdit = (grade: AssessmentGrade) => {
    setEditingGrade(grade);
    setCandidateId(grade.candidateId);
    setModuleName(grade.moduleName);
    setAssessmentType(grade.assessmentType);
    setMaximumScore(grade.maximumScore);
    setScoreObtained(grade.scoreObtained);
    setWeightPercentage(grade.weightPercentage);
    setTrainerFeedback(grade.trainerFeedback);
    setIsPublished(grade.isPublished);
    setShowAddGradeModal(true);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (scoreObtained < 0 || scoreObtained > maximumScore) {
      alert(`Score must be between 0 and ${maximumScore}`);
      return;
    }

    saveGrade({
      id: editingGrade?.id,
      candidateId,
      courseId: selectedCourseId,
      moduleName,
      assessmentType,
      maximumScore,
      scoreObtained,
      weightPercentage,
      trainerId: currentUser.trainerId || trainers[0]?.id || 'TRN-001',
      trainerFeedback,
      assessmentDate: new Date().toISOString().split('T')[0],
      isPublished
    });

    setShowAddGradeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Academic Assessment & Gradebook
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Theory & practical grade entries, weighted scoring, constructive trainer feedback, and audit history.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Enter Assessment Grade</span>
        </button>
      </div>

      {/* Course Filter Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-stone-400">Course Gradebook:</span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-stone-400 hidden sm:block">
          Passing Threshold: <span className="font-bold text-amber-300 font-mono">{settings.passingGradePercentage}%</span>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">Module / Assessment</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Weight</th>
                <th className="px-4 py-3">Trainer Feedback</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {courseGrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
                    No assessments recorded yet for this course. Click "Enter Assessment Grade" above.
                  </td>
                </tr>
              ) : (
                courseGrades.map((grade) => {
                  const cand = candidates.find((c) => c.id === grade.candidateId);
                  const isPassing = grade.scoreObtained >= settings.passingGradePercentage;

                  return (
                    <tr key={grade.id} className="hover:bg-stone-850/60 transition">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white">{cand?.fullName || grade.candidateId}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{grade.candidateId}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-stone-200">{grade.moduleName}</div>
                        <div className="text-[10px] text-stone-500 font-mono">Date: {grade.assessmentDate}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-800 text-stone-300 border border-stone-700">
                          {grade.assessmentType.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono font-bold text-sm">
                        <span className={isPassing ? 'text-emerald-400' : 'text-rose-400'}>
                          {grade.scoreObtained} / {grade.maximumScore}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right font-mono text-stone-300">
                        {grade.weightPercentage}%
                      </td>

                      <td className="px-4 py-3.5 max-w-xs truncate text-stone-300 italic text-[11px]">
                        "{grade.trainerFeedback || 'No feedback provided'}"
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            grade.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          {grade.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleOpenEdit(grade)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium border border-stone-700 transition"
                        >
                          Edit Grade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Grade Modal */}
      {showAddGradeModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BookOpenCheck className="w-4 h-4 text-amber-400" />
                <span>{editingGrade ? 'Revise Assessment Grade' : 'Record New Assessment Grade'}</span>
              </h3>
              <button
                onClick={() => setShowAddGradeModal(false)}
                className="text-stone-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Candidate <span className="text-rose-400">*</span>
                </label>
                <select
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  disabled={!!editingGrade}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-60"
                  required
                >
                  {courseCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Module or Examination Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="e.g. Bald-Cap Method & Lace Melt Demonstration"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Assessment Type
                  </label>
                  <select
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="practical">Practical Exam</option>
                    <option value="theory">Theory Examination</option>
                    <option value="final_exam">Final Master Demonstration</option>
                    <option value="project">Portfolio Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Curriculum Weight (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={weightPercentage}
                    onChange={(e) => setWeightPercentage(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Maximum Score
                  </label>
                  <input
                    type="number"
                    value={maximumScore}
                    onChange={(e) => setMaximumScore(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Score Obtained <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={maximumScore}
                    value={scoreObtained}
                    onChange={(e) => setScoreObtained(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Trainer Constructive Feedback & Rubric Notes
                </label>
                <textarea
                  rows={2}
                  value={trainerFeedback}
                  onChange={(e) => setTrainerFeedback(e.target.value)}
                  placeholder="e.g. Excellent hairline gradient, took care not to rip Swiss lace. Continue practicing edge styling."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="publishCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-stone-700 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="publishCheck" className="text-xs text-stone-300 cursor-pointer">
                  Publish to candidate's student portal immediately
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddGradeModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold transition"
                >
                  {editingGrade ? 'Save Revisions & Log Audit' : 'Record Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
