import Image from 'next/image';
import { BadgeCheck, Sparkles, Clock, Star } from 'lucide-react';

const features = [
  {
    icon: BadgeCheck,
    title: 'Hand-picked, vetted tutors',
    description:
      'Every tutor passes credential checks, interviews and a demo lesson before joining our roster.'
  },
  {
    icon: Sparkles,
    title: 'Matched within 24 hours',
    description:
      'Tell us your child’s level and subjects — we’ll pair them with the right tutor, fast.'
  },
  {
    icon: Clock,
    title: 'Flexible, transparent pricing',
    description:
      'Online or in-person sessions on your schedule. Clear hourly rates and simple invoices.'
  }
];

export function AuthHero() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden lg:flex lg:flex-col">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(221_83%_40%)_0%,hsl(245_75%_50%)_50%,hsl(280_70%_45%)_100%)]" />

      {/* Decorative glow orbs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />

      {/* Dot grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-elevated ring-1 ring-white/40">
            <Image
              src="/logo.jpg"
              alt="UHIL Academy logo"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            UHIL Academy
          </span>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <BadgeCheck className="h-3.5 w-3.5" />
              Vetted tutors. Real progress.
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              The right tutor for
              <br />
              your child &mdash; without
              <br />
              the guesswork.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/75">
              At UHIL Academy we personally vet every tutor we work with, then
              match them to your child&rsquo;s level, subjects and schedule.
            </p>
          </div>

          <div className="grid gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/65">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial pull-quote */}
          <figure className="rounded-xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-300 text-amber-300"
                />
              ))}
            </div>
            <blockquote className="mt-2.5 text-sm leading-relaxed text-white/90">
              &ldquo;Within a week, my daughter had a Maths tutor she actually
              looks forward to. The matching team really listened.&rdquo;
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-2xs font-semibold text-white">
                NA
              </span>
              <div className="text-2xs">
                <p className="font-medium text-white">Nurul A.</p>
                <p className="text-white/60">Parent · Kuala Lumpur</p>
              </div>
            </figcaption>
          </figure>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['A', 'M', 'R', 'S'].map((c, i) => (
              <div
                key={c}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-br text-2xs font-semibold text-white ${
                  [
                    'from-pink-400 to-rose-500',
                    'from-sky-400 to-indigo-500',
                    'from-amber-400 to-orange-500',
                    'from-emerald-400 to-teal-500'
                  ][i]
                }`}
              >
                {c}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/70">
            <strong className="text-white">500+</strong> families across
            Malaysia
          </p>
        </div>
      </div>
    </div>
  );
}
