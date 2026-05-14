'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { upsertReportCard } from '@/action/reportCard';
import {
  ReportCardPreview,
  type ReportCardData
} from '../../components/report-card-preview';

export interface EditorCard {
  id: string;
  studentId: string;
  subject: string;
  level: string | null;
  classId: string | null;
  teacherName: string | null;
  diagnostic: number | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  remarks: string | null;
  student: { name: string } | null;
  tutor: { name: string | null } | null;
}

const SCORE_FIELDS = [
  { key: 'diagnostic', label: 'Diagnostic' },
  { key: 'q1', label: 'Q1' },
  { key: 'q2', label: 'Q2' },
  { key: 'q3', label: 'Q3' },
  { key: 'q4', label: 'Q4' }
] as const;

type ScoreKey = (typeof SCORE_FIELDS)[number]['key'];

const scoreToStr = (v: number | null) => (v === null ? '' : String(v));
const strToScore = (v: string): number | null => {
  if (v.trim() === '') return null;
  const n = Math.max(0, Math.min(100, Math.round(Number(v))));
  return Number.isNaN(n) ? null : n;
};

export function ReportCardEditor({ card }: { card: EditorCard }) {
  const router = useRouter();
  const [level, setLevel] = React.useState(card.level ?? '');
  const [classId, setClassId] = React.useState(card.classId ?? '');
  const [teacherName, setTeacherName] = React.useState(
    card.teacherName ?? card.tutor?.name ?? ''
  );
  const [scores, setScores] = React.useState<Record<ScoreKey, string>>({
    diagnostic: scoreToStr(card.diagnostic),
    q1: scoreToStr(card.q1),
    q2: scoreToStr(card.q2),
    q3: scoreToStr(card.q3),
    q4: scoreToStr(card.q4)
  });
  const [remarks, setRemarks] = React.useState(card.remarks ?? '');
  const [saving, setSaving] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const setScore = (key: ScoreKey, raw: string) => {
    if (raw === '') return setScores((s) => ({ ...s, [key]: '' }));
    const n = Math.max(0, Math.min(100, Math.round(Number(raw))));
    if (Number.isNaN(n)) return;
    setScores((s) => ({ ...s, [key]: String(n) }));
  };

  const previewData: ReportCardData = {
    studentName: card.student?.name ?? '',
    level,
    subject: card.subject,
    classId,
    teacherName,
    diagnostic: scores.diagnostic,
    q1: scores.q1,
    q2: scores.q2,
    q3: scores.q3,
    q4: scores.q4,
    remarks
  };

  const persist = async () => {
    const res = await upsertReportCard({
      id: card.id,
      studentId: card.studentId,
      subject: card.subject,
      level,
      classId,
      teacherName,
      diagnostic: strToScore(scores.diagnostic),
      q1: strToScore(scores.q1),
      q2: strToScore(scores.q2),
      q3: strToScore(scores.q3),
      q4: strToScore(scores.q4),
      remarks
    });
    if (res.error) throw new Error(res.error);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await persist();
      toast({ title: 'Report card saved' });
      router.refresh();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Could not save',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Save first so the server-rendered PDF matches what's on screen.
      await persist();
      const res = await fetch('/api/report-card/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id })
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || 'Failed to generate PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-card-${(card.student?.name ?? 'student')
        .trim()
        .replace(/\s+/g, '-')}-${card.subject.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      router.refresh();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Could not generate PDF',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="shadow-elevated-sm lg:sticky lg:top-20 lg:self-start">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">
                {card.student?.name ?? 'Student'}
              </CardTitle>
              <CardDescription>{card.subject}</CardDescription>
            </div>
            <Badge variant="secondary">Report card</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Primary 4"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="classId">Class ID</Label>
              <Input
                id="classId"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                placeholder="e.g. ENG-04A"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="teacherName">Teacher&apos;s name</Label>
            <Input
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Scores (out of 100)</Label>
            <p className="text-xs text-muted-foreground">
              Leave a quarter blank until it&apos;s graded — it shows as
              &ldquo;Not graded yet&rdquo; on the report.
            </p>
            <div className="grid grid-cols-5 gap-2">
              {SCORE_FIELDS.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Input
                    id={f.key}
                    type="number"
                    min={0}
                    max={100}
                    inputMode="numeric"
                    value={scores[f.key]}
                    onChange={(e) => setScore(f.key, e.target.value)}
                    className="px-1.5 text-center text-sm"
                  />
                  <p className="text-center text-2xs text-muted-foreground">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="remarks">Teacher&apos;s remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="One remark per line (up to 4 lines shown)."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={saving || downloading}
              variant="outline"
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
            <Button
              onClick={handleDownload}
              disabled={saving || downloading}
              className="flex-1"
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Save &amp; download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elevated-sm">
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
          <CardDescription>
            A close approximation — the downloaded PDF is rendered on the server
            for a pixel-consistent result.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-4">
            <ReportCardPreview data={previewData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
