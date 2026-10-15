import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquareShare,
  Mail,
  Send,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Phone,
  UserCheck
} from 'lucide-react';

export const CommunicationsView: React.FC = () => {
  const { candidates, courses, settings } = useApp();

  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [templateType, setTemplateType] = useState<'welcome' | 'installment' | 'cert_ready' | 'schedule'>('welcome');
  const [customMessage, setCustomMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const candidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const course = courses.find((crs) => crs.id === candidate?.courseId) || courses[0];

  const templates = {
    welcome: `Hello ${candidate?.fullName}! Warm congratulations and welcome to NESSABEAUTY (NSB). Your application (ID: ${candidate?.id}) for ${course?.name} starting ${course?.startDate} has been officially recorded. Total tuition investment: $${course?.totalFee} USD. Slogan: "${settings.brandSlogan}". Let us know if you need any assistance prior to orientation!`,
    installment: `Hello ${candidate?.fullName}, this is NESSABEAUTY finance bursary. We kindly remind you of your upcoming installment balance of $${candidate?.balanceDue} USD for ${course?.name}. Please feel free to settle online or at the academy desk to maintain full course access. Thank you!`,
    cert_ready: `Congratulations ${candidate?.fullName}! Your official Certificate of Completion for ${course?.name} has been approved and issued by Founder Vanessa Nneka. You can access and verify your digital credential on the NSB Student Portal or pick up your physical embossed diploma!`,
    schedule: `Dear ${candidate?.fullName}, here is your upcoming training schedule for ${course?.name}: ${course?.trainingSchedule}. Please remember to arrive in standard NSB salon attire with your student kit. See you in the studio!`
  };

  const activeText = customMessage || templates[templateType];

  const handleOpenWhatsApp = () => {
    if (!candidate?.phone) {
      alert('Candidate has no phone number on file.');
      return;
    }
    const cleanPhone = candidate.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(activeText);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(activeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Communications Hub & WhatsApp Dispatch
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Send instant WhatsApp click-to-chat notifications and preview official automated Gmail notifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration Form */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider border-b border-stone-800 pb-3">
            <MessageSquareShare className="w-4 h-4" />
            <span>Message Generator</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Select Recipient Candidate
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => {
                setSelectedCandidateId(e.target.value);
                setCustomMessage('');
              }}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Pre-Configured Template
            </label>
            <select
              value={templateType}
              onChange={(e) => {
                setTemplateType(e.target.value as any);
                setCustomMessage('');
              }}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="welcome">Welcome & Registration Confirmation</option>
              <option value="installment">Installment Balance Reminder</option>
              <option value="schedule">Upcoming Training Schedule</option>
              <option value="cert_ready">Certificate Ready & Award Notification</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Customize Message Text
            </label>
            <textarea
              rows={6}
              value={customMessage || templates[templateType]}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md shadow-emerald-950/40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </button>
            <button
              onClick={handleCopyText}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition"
              title="Copy message to clipboard"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 leading-relaxed">
            <span className="font-semibold text-stone-300">Privacy & Protocol: </span>
            WhatsApp click-to-chat sanitizes the phone number and launches a direct conversation without needing any WhatsApp API subscriptions.
          </div>
        </div>

        {/* Right: Preview Screens */}
        <div className="lg:col-span-2 space-y-4">
          {/* WhatsApp Preview Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  WhatsApp Candidate Chat Preview
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                To: {candidate?.phone || 'No phone'}
              </span>
            </div>

            <div className="bg-[#0b141a] p-4 rounded-2xl border border-stone-800 min-h-[160px] flex flex-col justify-end">
              <div className="max-w-md ml-auto bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-none p-3.5 text-xs shadow-md space-y-1">
                <p className="whitespace-pre-wrap leading-relaxed">{activeText}</p>
                <div className="text-[10px] text-emerald-200/60 text-right font-mono">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Email Preview Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Automated Gmail Dispatch (Apps Script MailApp)
                </span>
              </div>
              <span className="text-xs font-mono text-amber-300">
                To: {candidate?.email}
              </span>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs space-y-3">
              <div className="flex justify-between border-b border-stone-800/80 pb-2 text-[11px] text-stone-400">
                <span>From: {settings.institutionName} &lt;{settings.contactEmail}&gt;</span>
                <span>Subject: [NSB Official] Notification for {candidate?.fullName}</span>
              </div>
              <div className="font-serif text-amber-200 font-bold text-sm">
                {settings.institutionName}
              </div>
              <p className="text-stone-300 whitespace-pre-wrap leading-relaxed">
                {activeText}
              </p>
              <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-500">
                {settings.address} • Automated Notification Dispatch
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
