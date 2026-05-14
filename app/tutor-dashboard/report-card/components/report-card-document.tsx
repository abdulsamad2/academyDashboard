/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Svg,
  Path,
  Circle,
  StyleSheet
} from '@react-pdf/renderer';
import type { ReportCardData } from './report-card-preview';

const NAVY = '#13357e';
const NAVY_DARK = '#0f2a66';
const GOLD = '#f5a623';
const PALE = '#eaf1fb';
const BORDER = '#dbe5f5';
const LINE = '#c7d6ef';
const SLATE = '#475569';

/* ----------------------------- icons ----------------------------- */
// Lucide path data (24x24 viewBox), rendered as stroked SVG.
type IconDef = {
  paths?: string[];
  circles?: { cx: number; cy: number; r: number }[];
};

const ICONS: Record<string, IconDef> = {
  phone: {
    paths: [
      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z'
    ]
  },
  user: {
    paths: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
    circles: [{ cx: 12, cy: 7, r: 4 }]
  },
  barChart: { paths: ['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3'] },
  book: {
    paths: [
      'M12 7v14',
      'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'
    ]
  },
  hash: { paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
  gradCap: {
    paths: [
      'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
      'M22 10v6',
      'M6 12.5V16a6 3 0 0 0 12 0v-3.5'
    ]
  },
  trophy: {
    paths: [
      'M6 9H4.5a2.5 2.5 0 0 1 0-5H6',
      'M18 9h1.5a2.5 2.5 0 0 0 0-5H18',
      'M4 22h16',
      'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22',
      'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22',
      'M18 2H6v7a6 6 0 0 0 12 0V2Z'
    ]
  },
  target: {
    circles: [
      { cx: 12, cy: 12, r: 10 },
      { cx: 12, cy: 12, r: 6 },
      { cx: 12, cy: 12, r: 2 }
    ]
  },
  heart: {
    paths: [
      'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'
    ]
  },
  lightbulb: {
    paths: [
      'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
      'M9 18h6',
      'M10 22h4'
    ]
  }
};

function Icon({
  name,
  size = 12,
  color = '#ffffff',
  strokeWidth = 2
}: {
  name: keyof typeof ICONS;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const def = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {def.paths?.map((d, i) => (
        <Path
          key={`p${i}`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {def.circles?.map((c, i) => (
        <Circle
          key={`c${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      ))}
    </Svg>
  );
}

/* ----------------------------- styles ----------------------------- */
const s = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    position: 'relative'
  },
  body: { paddingHorizontal: 40, paddingTop: 28, paddingBottom: 14 },

  // header
  headerWrap: { alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 42, height: 42, objectFit: 'contain', marginRight: 8 },
  academyName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    letterSpacing: 0.2
  },
  academySub: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    letterSpacing: 3,
    marginTop: 1
  },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  phoneText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginLeft: 3
  },
  title: {
    fontSize: 44,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    marginTop: 2,
    letterSpacing: 1
  },
  tagline: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    letterSpacing: 2,
    marginTop: 2
  },

  // student info
  infoBox: {
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row'
  },
  // Fixed widths throughout — flexGrow on a Text in @react-pdf collapses it
  // to min-content and wraps mid-word, so every column has an explicit width.
  infoLeft: { width: 320, justifyContent: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  },
  infoLabel: {
    width: 88,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: NAVY
  },
  infoColon: {
    width: 10,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: NAVY
  },
  infoValue: {
    width: 200,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: SLATE,
    borderBottomWidth: 1.5,
    borderBottomColor: LINE,
    paddingBottom: 2
  },
  infoRight: {
    width: 150,
    paddingLeft: 14,
    marginLeft: 12,
    borderLeftWidth: 1.5,
    borderLeftColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center'
  },
  classIdLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: NAVY },
  classIdBox: {
    marginTop: 6,
    height: 70,
    width: '100%',
    borderWidth: 1.5,
    borderColor: LINE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  classIdValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: NAVY },

  // performance
  perfWrap: { marginTop: 14, borderRadius: 12, overflow: 'hidden' },
  perfTitle: {
    backgroundColor: NAVY,
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingVertical: 6,
    letterSpacing: 0.5
  },
  perfRow: { flexDirection: 'row' },
  perfCol: { flexGrow: 1, flexBasis: 0 },
  perfColHead: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingVertical: 5
  },
  perfColBody: {
    backgroundColor: PALE,
    alignItems: 'center',
    paddingVertical: 14
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: NAVY,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreCircleText: { fontSize: 17, fontFamily: 'Helvetica-Bold', color: NAVY },
  scoreFraction: { marginTop: 6, fontSize: 9, color: SLATE },

  // encouragement + remarks
  encWrap: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row'
  },
  encLeft: { flexGrow: 1.4, flexBasis: 0, flexDirection: 'row' },
  encText: { marginLeft: 10, flexGrow: 1, flexBasis: 0 },
  encHeading: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY },
  encPara: { marginTop: 4, fontSize: 8, color: SLATE, lineHeight: 1.35 },
  encSlogan: {
    marginTop: 6,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: NAVY
  },
  remarksCol: {
    flexGrow: 1,
    flexBasis: 0,
    marginLeft: 14,
    paddingLeft: 14,
    borderLeftWidth: 1.5,
    borderLeftColor: BORDER
  },
  remarksHead: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY },
  remarkLine: {
    marginTop: 9,
    minHeight: 12,
    fontSize: 8,
    color: SLATE,
    borderBottomWidth: 1.5,
    borderBottomColor: LINE,
    paddingBottom: 2
  },

  // footer value props
  footerRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  vp: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'center',
    paddingHorizontal: 6
  },
  vpTitle: {
    marginTop: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: NAVY,
    textAlign: 'center'
  },
  vpText: {
    marginTop: 3,
    fontSize: 6.5,
    color: SLATE,
    textAlign: 'center',
    lineHeight: 1.3
  },

  // bottom bar
  bottomBar: {
    marginTop: 16,
    backgroundColor: NAVY,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomText: {
    fontSize: 13,
    fontFamily: 'Helvetica-BoldOblique',
    color: GOLD,
    marginRight: 8
  }
});

/* ----------------------------- pieces ----------------------------- */
function InfoRow({
  icon,
  label,
  value
}: {
  icon: keyof typeof ICONS;
  label: string;
  value: string;
}) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoDot}>
        <Icon name={icon} size={9} color="#ffffff" />
      </View>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoColon}>:</Text>
      <Text style={s.infoValue}>{value || ' '}</Text>
    </View>
  );
}

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
    <View style={s.perfCol}>
      <Text
        style={[
          s.perfColHead,
          { backgroundColor: highlight ? NAVY_DARK : NAVY }
        ]}
      >
        {label}
      </Text>
      <View style={s.perfColBody}>
        <View
          style={[s.scoreCircle, hasScore ? {} : { borderColor: '#c0cce0' }]}
        >
          <Text
            style={[
              s.scoreCircleText,
              hasScore ? {} : { color: '#9aa7bd', fontSize: 20 }
            ]}
          >
            {hasScore ? score : '–'}
          </Text>
        </View>
        {hasScore ? (
          <Text style={s.scoreFraction}>
            <Text style={{ fontFamily: 'Helvetica-Bold', color: NAVY }}>
              {score}
            </Text>{' '}
            / 100
          </Text>
        ) : (
          <Text style={[s.scoreFraction, { color: '#9aa7bd' }]}>
            Not graded yet
          </Text>
        )}
      </View>
    </View>
  );
}

function ValueProp({
  icon,
  title,
  text
}: {
  icon: keyof typeof ICONS;
  title: string;
  text: string;
}) {
  return (
    <View style={s.vp}>
      <Icon name={icon} size={20} color={GOLD} strokeWidth={2} />
      <Text style={s.vpTitle}>{title}</Text>
      <Text style={s.vpText}>{text}</Text>
    </View>
  );
}

/* ----------------------------- document ----------------------------- */
export function ReportCardDocument({
  data,
  logoSrc
}: {
  data: ReportCardData;
  logoSrc?: string;
}) {
  const remarkLines = (data.remarks || '').split('\n').filter(Boolean);

  return (
    <Document
      title={`Report Card — ${data.studentName || 'Student'}`}
      author="UH Innovation Legacy Learning Academy"
    >
      <Page size="A4" style={s.page}>
        {/* decorative corners */}
        <View style={{ position: 'absolute', top: 0, left: 0 }}>
          <Svg width={180} height={120} viewBox="0 0 240 160">
            <Path d="M0 0 H170 Q70 45 0 160 Z" fill={GOLD} />
            <Path d="M0 0 H120 Q45 35 0 120 Z" fill={NAVY} />
          </Svg>
        </View>
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <Svg width={180} height={120} viewBox="0 0 240 160">
            <Path d="M240 0 H70 Q170 45 240 160 Z" fill={GOLD} />
            <Path d="M240 0 H120 Q195 35 240 120 Z" fill={NAVY} />
          </Svg>
        </View>

        <View style={s.body}>
          {/* header */}
          <View style={s.headerWrap}>
            <View style={s.logoRow}>
              {logoSrc ? <Image style={s.logo} src={logoSrc} /> : null}
              <View>
                <Text style={s.academyName}>UH INNOVATION LEGACY</Text>
                <Text style={s.academySub}>LEARNING ACADEMY</Text>
              </View>
            </View>
            <View style={s.phoneRow}>
              <Icon name="phone" size={10} color={NAVY} />
              <Text style={s.phoneText}>016-4175134</Text>
            </View>
            <Text style={s.title}>REPORT CARD</Text>
            <Text style={s.tagline}>LEARN TODAY, LEAD TOMORROW</Text>
          </View>

          {/* student info */}
          <View style={s.infoBox}>
            <View style={s.infoLeft}>
              <InfoRow
                icon="user"
                label="STUDENT NAME"
                value={data.studentName}
              />
              <InfoRow icon="barChart" label="LEVEL" value={data.level} />
              <InfoRow icon="book" label="SUBJECT" value={data.subject} />
              <InfoRow icon="hash" label="CLASS ID" value={data.classId} />
              <InfoRow
                icon="gradCap"
                label="TEACHER'S NAME"
                value={data.teacherName}
              />
            </View>
            <View style={s.infoRight}>
              <Text style={s.classIdLabel}>CLASS ID</Text>
              <View style={s.classIdBox}>
                <Text style={s.classIdValue}>{data.classId || ' '}</Text>
              </View>
            </View>
          </View>

          {/* performance summary */}
          <View style={s.perfWrap}>
            <Text style={s.perfTitle}>PERFORMANCE SUMMARY</Text>
            <View style={s.perfRow}>
              <ScoreColumn
                label="DIAGNOSTIC"
                score={data.diagnostic}
                highlight
              />
              <ScoreColumn label="Q1" score={data.q1} />
              <ScoreColumn label="Q2" score={data.q2} />
              <ScoreColumn label="Q3" score={data.q3} />
              <ScoreColumn label="Q4" score={data.q4} />
            </View>
          </View>

          {/* encouragement + remarks */}
          <View style={s.encWrap}>
            <View style={s.encLeft}>
              <Icon name="trophy" size={34} color={GOLD} strokeWidth={1.8} />
              <View style={s.encText}>
                <Text style={s.encHeading}>KEEP UP THE GREAT WORK!</Text>
                <Text style={s.encPara}>
                  Every effort you put in today brings you closer to your goals.
                  Stay focused, stay curious, and never stop learning.
                </Text>
                <Text style={s.encPara}>
                  At UH Innovation Legacy Learning Academy, we are committed to
                  helping you excel, grow, and achieve your full potential.
                </Text>
                <Text style={s.encSlogan}>
                  DISCIPLINE TODAY, SUCCESS TOMORROW.
                </Text>
              </View>
            </View>
            <View style={s.remarksCol}>
              <Text style={s.remarksHead}>TEACHER&apos;S REMARKS</Text>
              {[0, 1, 2, 3].map((i) => (
                <Text key={i} style={s.remarkLine}>
                  {remarkLines[i] ?? ' '}
                </Text>
              ))}
            </View>
          </View>

          {/* footer value props */}
          <View style={s.footerRow}>
            <ValueProp
              icon="target"
              title="FOCUSED LEARNING"
              text="We focus on understanding, not just memorizing."
            />
            <ValueProp
              icon="barChart"
              title="PROVEN RESULTS"
              text="Structured methods that deliver progress."
            />
            <ValueProp
              icon="heart"
              title="PERSONALIZED SUPPORT"
              text="Every student matters. We guide you step by step."
            />
            <ValueProp
              icon="lightbulb"
              title="BUILDING CONFIDENCE"
              text="We help you believe in yourself and achieve more."
            />
          </View>
        </View>

        {/* bottom bar */}
        <View style={s.bottomBar}>
          <Text style={s.bottomText}>Your Success is Our Legacy.</Text>
          <Icon name="book" size={14} color={GOLD} />
        </View>
      </Page>
    </Document>
  );
}
