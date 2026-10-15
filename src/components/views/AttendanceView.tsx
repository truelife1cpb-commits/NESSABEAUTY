import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Calendar,
  Save,
  Check
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { courses, trainers, candidates, attendance, recordAttendanceSession, settings } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'CRS-WIG-01');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionTopic, setSessionTopic] = useState<string>('Frontal Lace Customization & Knot Bleaching Practical');
  const [trainerId, setTrainerId] = useState<string>(trainers[0]?.id || 'TRN-001');

  // Enrolled candidates in this course
  const enrolledCandidates = candidates.filter(
    (c) => c.courseId === selectedCourseId && (c.status === 'enrolled' || c.status === 'completed')
  );

  // Form roster state: candidateId -> status
  const [roster, setRoster] = useState<Record<string, { status: AttendanceStatus; notes: string }>>(() => {
    const init: Record<string, { status: AttendanceStatus; notes: string }> = {};
    enrolledCandidates.forEach((c) => {
      init[c.id] = { status: 'present', notes: '' };
    });
    return init;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (candidateId: string, status: AttendanceStatus) => {
    setRoster((prev) => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        status
      }
    }));
  };

  const handleNotesChange = (candidateId: string, notes: string) => {
    setRoster((prev) => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        notes
      }
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setRoster((prev) => {
      const updated = { ...prev };
      enrolledCandidates.forEach((c) => {
        updated[c.id] = { ...updated[c.id], status };
      });
      return updated;
    });
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (enrolledCandidates.length === 0) return;

    const sessionRecords = enrolledCandidates.map((c) => ({
      courseId: selectedCourseId,
      candidateId: c.id,
      sessionDate,
      sessionTopic,
      trainerId,
      status: roster[c.id]?.status || 'present',
      notes: roster[c.id]?.notes || ''
    }));

    recordAttendanceSession(sessionRecords);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Attendance Register & Roll Call
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Record training sessions, track student punctuality, enforce certification threshold ({settings.minimumAttendancePercentage}% min).
          </p>
        </div>
      </div>

      {/* Session Header Form */}
      <form onSubmit={handleSaveAttendance} className="space-y-6">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Session Parameters
              </h2>
            </div>
            {savedSuccess && (
              <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                <Check className="w-3.5 h-3.5" />
                <span>Attendance Saved to Sheets</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-300 mb-1">Training Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">Lead Instructor / Trainer</label>
              <select
                value={trainerId}
                onChange={(e) => setTrainerId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.specialization.split('&')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">Session Curriculum Topic</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. Lace Melting & Baby Hair Design"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Candidate Roll Call Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Candidate Roll Call Roster ({enrolledCandidates.length} Active Candidates)
              </h3>
              <p className="text-[11px] text-stone-400">Mark status and enter trainer observations</p>
            </div>

            {/* Quick Bulk Marking */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-stone-400 mr-1 text-[11px]">Mark All:</span>
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-[11px] font-medium"
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 text-[11px] font-medium"
              >
                Absent
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">Cumulative Rate</th>
                  <th className="px-4 py-3">Roll Call Status</th>
                  <th className="px-4 py-3">Trainer Observation Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {enrolledCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                      No candidates currently enrolled in this course.
                    </td>
                  </tr>
                ) : (
                  enrolledCandidates.map((candidate) => {
                    const cAttendance = attendance.filter((a) => a.candidateId === candidate.id && a.courseId === selectedCourseId);
                    const positiveCount = cAttendance.filter((a) => a.status === 'present' || a.status === 'excused').length;
                    const percent = cAttendance.length > 0 ? Math.round((positiveCount / cAttendance.length) * 100) : 100;
                    const currentStatus = roster[candidate.id]?.status || 'present';

                    return (
                      <tr key={candidate.id} className="hover:bg-stone-850/60 transition">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-white">{candidate.fullName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{candidate.id}</div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono font-bold ${percent >= settings.minimumAttendancePercentage ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {percent}%
                            </span>
                            {percent < settings.minimumAttendancePercentage && (
                              <span className="text-[10px] text-rose-400 flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-0.5" /> Below Min
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {positiveCount} of {cAttendance.length} sessions
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center space-x-1.5">
                            {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(candidate.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition ${
                                  currentStatus === st
                                    ? st === 'present'
                                      ? 'bg-emerald-600 text-white'
                                      : st === 'late'
                                      ? 'bg-amber-600 text-white'
                                      : st === 'excused'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <input
                            type="text"
                            value={roster[candidate.id]?.notes || ''}
                            onChange={(e) => handleNotesChange(candidate.id, e.target.value)}
                            placeholder="e.g. Mastered bleaching; clean part lines"
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {enrolledCandidates.length > 0 && (
            <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/40 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Session Attendance</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
