import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Share2,
  FileText,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Award,
  Upload,
  Copy,
  Check,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationViewProps {
  onSuccessNavigate?: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onSuccessNavigate }) => {
  const { courses, settings, registerCandidate } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '2002-05-18',
    gender: 'Female',
    nationality: 'American',
    residentialAddress: '',
    courseId: courses[0]?.id || 'CRS-WIG-01',
    cohortId: 'COHORT-JAN2027',
    preferredSchedule: courses[0]?.trainingSchedule || 'Mon, Wed, Fri (10:00 AM - 2:00 PM)',
    previousExperience: '',
    yearsOfExperience: 0,
    relevantSkills: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    idDocumentName: 'Candidate_ID_Scan.pdf'
  });

  const [submittedCandidateId, setSubmittedCandidateId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showGoogleFormModal, setShowGoogleFormModal] = useState(false);

  const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value
    }));

    if (name === 'courseId') {
      const c = courses.find((crs) => crs.id === value);
      if (c) {
        setFormData((prev) => ({ ...prev, preferredSchedule: c.trainingSchedule }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = registerCandidate(formData);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to submit registration.');
      return;
    }

    setSubmittedCandidateId(res.candidateId || 'NSB-NEW');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello NESSABEAUTY! I would like to inquire about enrolling in the ${selectedCourse?.name} program for the January 2027 cohort.`
    );
    window.open(`https://wa.me/${settings.contactPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  if (submittedCandidateId) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-stone-900 border border-amber-900/40 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40 text-xs font-semibold mb-2">
          Registration Successfully Submitted
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          Welcome to NESSABEAUTY Academy!
        </h2>
        <p className="text-sm text-stone-300 mb-6 max-w-lg mx-auto">
          Your official application has been recorded in the database. Your admissions counselor will review your uploaded documents and contact you within 24 hours.
        </p>

        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400">Candidate Identifier:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{submittedCandidateId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400">Enrolled Program:</span>
            <span className="font-medium text-stone-200">{selectedCourse?.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400">Cohort Duration:</span>
            <span className="text-stone-300">{selectedCourse?.startDate} – {selectedCourse?.endDate}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-800">
            <span className="text-stone-400">Total Program Investment:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">${selectedCourse?.totalFee} USD</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setSubmittedCandidateId(null)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
          >
            Submit Another Registration
          </button>
          <button
            onClick={handleWhatsAppInquiry}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with NSB on WhatsApp</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL ADMISSIONS PORTAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Online Candidate Registration
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Register for professional beauty training in Wig Installation, Makeup Artistry, and Hairstyling.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleShareLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium border border-stone-700 transition"
            title="Copy shareable registration link for candidates"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isCopied ? 'Link Copied!' : 'Share Form Link'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowGoogleFormModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-xs font-medium border border-amber-800/50 transition"
            title="Google Forms Synchronization Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Google Form Sync</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-200 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Course Selection & Investment Breakdown */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              1. Training Course & Cohort Selection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Select Course Specialization <span className="text-rose-400">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Training Schedule & Cohort
              </label>
              <input
                type="text"
                name="preferredSchedule"
                value={formData.preferredSchedule}
                onChange={handleChange}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Fee Breakdown Box */}
          <div className="bg-stone-950/90 border border-amber-900/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-xs font-semibold text-amber-300">Configured Program Fee Structure</div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Registration Fee: ${selectedCourse?.defaultRegistrationFee} • Participation & Kit Fee: ${selectedCourse?.defaultTuitionFee}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-stone-400 block">Total Combined Due</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ${selectedCourse?.totalFee} {settings.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Details */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
            <User className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              2. Candidate Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Full Legal Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Vanessa Diallo"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vanessa@example.com"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Phone Number (WhatsApp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2831"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="e.g. American / Nigerian / Ghanaian"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Residential Street Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="residentialAddress"
                value={formData.residentialAddress}
                onChange={handleChange}
                placeholder="Apartment, Street name, City, State"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Beauty Background & Experience */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              3. Beauty & Hairstyling Background
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Years of Prior Experience in Hair / Makeup
              </label>
              <input
                type="number"
                min="0"
                max="30"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Relevant Skills Already Acquired
              </label>
              <input
                type="text"
                name="relevantSkills"
                value={formData.relevantSkills}
                onChange={handleChange}
                placeholder="e.g. Cornrows, hair curling, basic eye makeup"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Describe Your Goals & What You Wish to Achieve with NSB
              </label>
              <textarea
                name="previousExperience"
                rows={2}
                value={formData.previousExperience}
                onChange={handleChange}
                placeholder="e.g. I want to start my own luxury bridal wig installation studio..."
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contact */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
            <Phone className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              4. Emergency Contact Person
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Contact Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="e.g. Marcus Diallo"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Relationship <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                placeholder="e.g. Mother / Spouse / Sibling"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Emergency Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 987-6543"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 5: Document Upload Simulation */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-3">
            <Upload className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              5. Identification Document Upload
            </h2>
          </div>

          <div className="border-2 border-dashed border-stone-700 hover:border-amber-500/60 rounded-xl p-6 text-center bg-stone-950/40 transition">
            <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-xs text-stone-300 font-medium">
              National ID / Passport / Driver's License
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              File attached: <span className="font-mono text-amber-300">{formData.idDocumentName}</span> (Simulated Google Drive attachment)
            </p>
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Questions? Chat with Admissions Counselor</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/50 transition transform hover:-translate-y-0.5"
          >
            Submit Application & Register
          </button>
        </div>
      </form>

      {/* Google Form Sync Modal */}
      {showGoogleFormModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Google Form Integration Workflow</span>
              </h3>
              <button
                onClick={() => setShowGoogleFormModal(false)}
                className="text-stone-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-stone-300 space-y-3 leading-relaxed">
              <p>
                The NSB Management System natively integrates with Google Forms to automatically capture external candidate registrations into your Google Sheet without manual data entry:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-stone-300 bg-stone-950/70 p-4 rounded-xl border border-stone-800 font-mono text-[11px]">
                <li>Create a Google Form with matching fields: Full Name, Email, Phone, Course, Emergency Contact.</li>
                <li>In Google Forms, set the response destination to your existing NSB Spreadsheet.</li>
                <li>In Google Apps Script, attach an <span className="text-amber-300">onFormSubmit(e)</span> trigger that calls <span className="text-emerald-300">processFormRegistration(e)</span> in <span className="text-rose-300">Code.gs</span>.</li>
                <li>The trigger automatically assigns unique Candidate ID (<span className="text-amber-300">NSB-CND-2027-XXX</span>), computes the fee ($150 default), and sends a confirmation email!</li>
              </ol>
              <p className="text-stone-400 text-[11px]">
                You can copy the pre-built <code className="text-amber-300">processFormRegistration(e)</code> handler directly from the <strong>GAS Deployment Code</strong> tab!
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowGoogleFormModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
