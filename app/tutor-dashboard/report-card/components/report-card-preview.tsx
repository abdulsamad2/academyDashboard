import * as React from 'react';
import {
  Trophy,
  Target,
  BarChart3,
  Heart,
  Lightbulb,
  BookOpen,
  User,
  Hash,
  GraduationCap,
  Phone,
  type LucideIcon
} from 'lucide-react';

export interface ReportCardData {
  studentName: string;
  level: string;
  subject: string;
  classId: string;
  teacherName: string;
  diagnostic: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  remarks: string;
}

const NAVY = '#13357e';
const NAVY_DARK = '#0f2a66';
const GOLD = '#f5a623';
const PALE = '#eaf1fb';

/** Single labelled row in the student-info block. */
function InfoRow({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: NAVY }}
      >
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <span
        className="w-[150px] shrink-0 text-[13px] font-bold tracking-wide"
        style={{ color: NAVY }}
      >
        {label}
      </span>
      <span className="shrink-0 text-[13px] font-bold" style={{ color: NAVY }}>
        :
      </span>
      <span
        className="min-w-0 flex-1 border-b-2 pb-0.5 text-[13px] font-semibold text-slate-700"
        style={{ borderColor: '#c7d6ef' }}
      >
        {value || ' '}
      </span>
    </div>
  );
}

/** One column of the performance summary. */
function ScoreColumn({
  label,
  score,
  highlight
}: {
  label: string;
  score: string;
  highlight?: boolean;
}) {
  const hasScore = score !== '' && score != null;
  return (
    <div className="flex flex-1 flex-col items-center">
      <div
        className="w-full py-2 text-center text-[13px] font-bold tracking-wide text-white"
        style={{ background: highlight ? NAVY_DARK : NAVY }}
      >
        {label}
      </div>
      <div
        className="flex w-full flex-col items-center gap-2 py-5"
        style={{ background: PALE }}
      >
        <div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white"
          style={{ border: `2px solid ${hasScore ? NAVY : '#c0cce0'}` }}
        >
          <span
            className="text-2xl font-extrabold"
            style={{ color: hasScore ? NAVY : '#9aa7bd' }}
          >
            {hasScore ? score : '–'}
          </span>
        </div>
        {hasScore ? (
          <div className="text-[13px] font-semibold text-slate-600">
            <span
              className="inline-block min-w-[34px] border-b-2 text-center font-bold"
              style={{ borderColor: '#9fb6dd', color: NAVY }}
            >
              {score}
            </span>{' '}
            / 100
          </div>
        ) : (
          <div className="text-[12px] font-medium text-slate-400">
            Not graded yet
          </div>
        )}
      </div>
    </div>
  );
}

/** One footer value-proposition. */
function ValueProp({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center px-2 text-center">
      <Icon className="h-7 w-7" style={{ color: GOLD }} />
      <p
        className="mt-1.5 text-[12px] font-extrabold leading-tight"
        style={{ color: NAVY }}
      >
        {title}
      </p>
      <p className="mt-1 text-[10px] leading-snug text-slate-500">{text}</p>
    </div>
  );
}

/**
 * The printable report card. Rendered at a fixed A4-ish width (794px)
 * so html2canvas captures it crisply regardless of screen size.
 */
export const ReportCardPreview = React.forwardRef<
  HTMLDivElement,
  { data: ReportCardData }
>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-[794px] overflow-hidden bg-white"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Decorative top corners */}
      <svg
        className="absolute left-0 top-0"
        width="240"
        height="160"
        viewBox="0 0 240 160"
        fill="none"
      >
        <path d="M0 0 H170 Q70 45 0 160 Z" fill={GOLD} />
        <path d="M0 0 H120 Q45 35 0 120 Z" fill={NAVY} />
      </svg>
      <svg
        className="absolute right-0 top-0"
        width="240"
        height="160"
        viewBox="0 0 240 160"
        fill="none"
      >
        <path d="M240 0 H70 Q170 45 240 160 Z" fill={GOLD} />
        <path d="M240 0 H120 Q195 35 240 120 Z" fill={NAVY} />
      </svg>

      <div className="relative px-12 pb-6 pt-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="UH Innovation Legacy"
              className="h-14 w-14 object-contain"
            />
            <div className="text-left">
              <p
                className="text-xl font-extrabold leading-none tracking-tight"
                style={{ color: NAVY }}
              >
                UH INNOVATION LEGACY
              </p>
              <p
                className="text-[11px] font-semibold tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                LEARNING ACADEMY
              </p>
            </div>
          </div>
          <div
            className="mt-1.5 flex items-center gap-1.5 text-sm font-bold"
            style={{ color: NAVY }}
          >
            <Phone className="h-3.5 w-3.5" />
            016-4175134
          </div>
          <h1
            className="mt-1 text-[58px] font-extrabold leading-none tracking-tight"
            style={{ color: NAVY }}
          >
            REPORT CARD
          </h1>
          <p
            className="mt-1 text-sm font-bold tracking-[0.25em]"
            style={{ color: NAVY }}
          >
            LEARN TODAY, LEAD TOMORROW
          </p>
        </div>

        {/* Student info */}
        <div
          className="mt-6 grid grid-cols-[1fr_auto] gap-6 rounded-2xl border-2 p-5"
          style={{ borderColor: '#dbe5f5' }}
        >
          <div className="flex flex-col justify-center gap-3">
            <InfoRow
              icon={User}
              label="STUDENT NAME"
              value={data.studentName}
            />
            <InfoRow icon={BarChart3} label="LEVEL" value={data.level} />
            <InfoRow icon={BookOpen} label="SUBJECT" value={data.subject} />
            <InfoRow icon={Hash} label="CLASS ID" value={data.classId} />
            <InfoRow
              icon={GraduationCap}
              label="TEACHER'S NAME"
              value={data.teacherName}
            />
          </div>
          <div
            className="flex w-[200px] flex-col items-center justify-center border-l-2 pl-6"
            style={{ borderColor: '#dbe5f5' }}
          >
            <p
              className="text-base font-extrabold tracking-wide"
              style={{ color: NAVY }}
            >
              CLASS ID
            </p>
            <div
              className="mt-2 flex h-24 w-full items-center justify-center rounded-xl border-2"
              style={{ borderColor: '#c7d6ef' }}
            >
              <span className="text-2xl font-extrabold" style={{ color: NAVY }}>
                {data.classId || ' '}
              </span>
            </div>
          </div>
        </div>

        {/* Performance summary */}
        <div className="mt-5 overflow-hidden rounded-2xl">
          <div
            className="py-2.5 text-center text-base font-extrabold tracking-wide text-white"
            style={{ background: NAVY }}
          >
            PERFORMANCE SUMMARY
          </div>
          <div className="flex">
            <ScoreColumn label="DIAGNOSTIC" score={data.diagnostic} highlight />
            <ScoreColumn label="Q1" score={data.q1} />
            <ScoreColumn label="Q2" score={data.q2} />
            <ScoreColumn label="Q3" score={data.q3} />
            <ScoreColumn label="Q4" score={data.q4} />
          </div>
        </div>

        {/* Encouragement + remarks */}
        <div
          className="mt-5 grid grid-cols-[1.4fr_1fr] gap-5 rounded-2xl border-2 p-5"
          style={{ borderColor: '#dbe5f5' }}
        >
          <div className="flex gap-4">
            <Trophy className="h-12 w-12 shrink-0" style={{ color: GOLD }} />
            <div>
              <p
                className="text-base font-extrabold tracking-wide"
                style={{ color: NAVY }}
              >
                KEEP UP THE GREAT WORK!
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-slate-600">
                Every effort you put in today brings you closer to your goals.
                Stay focused, stay curious, and never stop learning.
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-slate-600">
                At UH Innovation Legacy Learning Academy, we are committed to
                helping you excel, grow, and achieve your full potential.
              </p>
              <p
                className="mt-2 text-[13px] font-extrabold"
                style={{ color: NAVY }}
              >
                DISCIPLINE TODAY, SUCCESS TOMORROW.
              </p>
            </div>
          </div>
          <div className="border-l-2 pl-5" style={{ borderColor: '#dbe5f5' }}>
            <p
              className="text-sm font-extrabold tracking-wide"
              style={{ color: NAVY }}
            >
              TEACHER&apos;S REMARKS
            </p>
            <div className="mt-2 space-y-3">
              {(() => {
                const lines = (data.remarks || '').split('\n').filter(Boolean);
                return [0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border-b-2 pb-0.5 text-[11px] text-slate-700"
                    style={{ borderColor: '#c7d6ef', minHeight: 16 }}
                  >
                    {lines[i] ?? ' '}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Footer value props */}
        <div className="mt-6 flex items-start justify-between gap-2">
          <ValueProp
            icon={Target}
            title="FOCUSED LEARNING"
            text="We focus on understanding, not just memorizing."
          />
          <ValueProp
            icon={BarChart3}
            title="PROVEN RESULTS"
            text="Structured methods that deliver progress."
          />
          <ValueProp
            icon={Heart}
            title="PERSONALIZED SUPPORT"
            text="Every student matters. We guide you step by step."
          />
          <ValueProp
            icon={Lightbulb}
            title="BUILDING CONFIDENCE"
            text="We help you believe in yourself and achieve more."
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex items-center justify-center gap-3 py-3"
        style={{ background: NAVY }}
      >
        <span
          className="text-lg font-bold italic"
          style={{ color: GOLD, fontFamily: 'Georgia, serif' }}
        >
          Your Success is Our Legacy.
        </span>
        <BookOpen className="h-5 w-5" style={{ color: GOLD }} />
      </div>
    </div>
  );
});

ReportCardPreview.displayName = 'ReportCardPreview';
