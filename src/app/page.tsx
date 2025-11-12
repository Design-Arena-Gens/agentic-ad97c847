"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";

type Option = {
  value: string;
  label: string;
  description?: string;
  badge?: string;
};

type BaseStep = {
  id: string;
  title: string;
  description: string;
};

type OptionStep = BaseStep & {
  type: "single" | "multi";
  options: Option[];
  limit?: number;
};

type ScaleStep = BaseStep & {
  type: "scale";
  min: number;
  max: number;
  step: number;
  suffix?: string;
  defaultValue?: number;
  markers?: number[];
};

type TextStep = BaseStep & {
  type: "text";
  placeholder: string;
  helper: string;
  rows?: number;
};

type SurveyStep = OptionStep | ScaleStep | TextStep;

type SurveyAnswers = Record<string, string | string[] | number>;

const surveySteps: SurveyStep[] = [
  {
    id: "role",
    title: "Who are we teaming up with?",
    description:
      "Anchor the squad around your perspective so the plan speaks your language.",
    type: "single",
    options: [
      {
        value: "founder",
        label: "Founding Team",
        description: "Orchestrating product, GTM, and capital at the same time.",
        badge: "Most picked",
      },
      {
        value: "product-lead",
        label: "Product / Design Lead",
        description: "Aligning stakeholders while shipping a cohesive experience.",
      },
      {
        value: "marketing",
        label: "Marketing / Growth",
        description: "Crafting narratives that convert and loop into retention.",
      },
      {
        value: "other",
        label: "Operator / Advisor",
        description: "Partnering to unlock a precise slice of momentum.",
      },
    ],
  },
  {
    id: "vibe",
    title: "What energy should the experience radiate?",
    description:
      "Pick the emotional signature that your users should feel at every touchpoint.",
    type: "single",
    options: [
      {
        value: "premium",
        label: "Polished & Premium",
        description: "Cinematic visuals, high-trust interactions, detail-obsessed.",
        badge: "Credibility boost",
      },
      {
        value: "playful",
        label: "Playful Momentum",
        description: "Delightful micro-interactions with a confident brand voice.",
      },
      {
        value: "experimental",
        label: "Experimental & Bold",
        description: "Future-forward patterns that feel new yet intuitive.",
      },
      {
        value: "minimal",
        label: "Calm & Minimal",
        description: "Intentional whitespace, clarity, and effortless onboarding.",
      },
    ],
  },
  {
    id: "focus",
    title: "Where should momentum concentrate?",
    description: "Select up to three arenas where a focused push moves the needle most.",
    type: "multi",
    limit: 3,
    options: [
      {
        value: "product-foundations",
        label: "Product Foundations",
        description: "Clarify the IA, flows, and core UX narrative.",
      },
      {
        value: "activation",
        label: "Activation & Onboarding",
        description: "Get newcomers to the magic moment fast and friction-free.",
      },
      {
        value: "conversion",
        label: "Conversion Engine",
        description: "Tighten landing pages, pricing, and in-product upsell loops.",
      },
      {
        value: "design-system",
        label: "Design System",
        description: "Align components, tokens, and cross-platform consistency.",
      },
      {
        value: "ai-layer",
        label: "AI Differentiation",
        description: "Ship a signature intelligent moment that feels inevitable.",
      },
      {
        value: "story",
        label: "Story & Narrative",
        description: "Craft the storyline investors, recruits, and customers repeat.",
      },
    ],
  },
  {
    id: "timeline",
    title: "How fast should signal appear?",
    description:
      "Slide to calibrate urgency. 1 = lightning sprint, 12 = steady orchestration.",
    type: "scale",
    min: 1,
    max: 12,
    step: 1,
    suffix: " weeks",
    defaultValue: 6,
    markers: [1, 4, 8, 12],
  },
  {
    id: "vision",
    title: "Paint the win in a sentence or two",
    description:
      "Drop a headline the team can rally around. We'll remix it into a launch brief.",
    type: "text",
    placeholder:
      "Launch an AI copilot that nails onboarding so teams feel productive in minutes...",
    helper: "Keep it crisp - 1 to 2 sentences is perfect.",
    rows: 4,
  },
];

const roleCopy: Record<string, { label: string; blurb: string }> = {
  founder: {
    label: "Founding team",
    blurb: "needs cross-functional velocity without sacrificing craft.",
  },
  "product-lead": {
    label: "Product or design lead",
    blurb: "wants alignment, momentum, and a clear creative brief.",
  },
  marketing: {
    label: "Growth storyteller",
    blurb: "is optimizing narrative, assets, and conversion loops.",
  },
  other: {
    label: "Operator / advisor",
    blurb: "is guiding a sharp strike to unblock the next inflection.",
  },
};

const vibeCopy: Record<
  string,
  { label: string; headline: string; accent: string; gradient: string }
> = {
  premium: {
    label: "Polished & Premium",
    headline: "Make the experience feel inevitable and high-trust.",
    accent: "from-cyan-400 via-blue-400 to-sky-500",
    gradient: "bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-slate-900/40",
  },
  playful: {
    label: "Playful Momentum",
    headline: "Inject delightful beats that energize each interaction.",
    accent: "from-amber-400 via-pink-500 to-fuchsia-500",
    gradient: "bg-gradient-to-br from-amber-500/20 via-pink-500/10 to-slate-900/40",
  },
  experimental: {
    label: "Experimental & Bold",
    headline: "Prototype the future-forward moments competitors copy later.",
    accent: "from-violet-500 via-indigo-400 to-cyan-400",
    gradient: "bg-gradient-to-br from-violet-500/25 via-indigo-500/10 to-slate-900/40",
  },
  minimal: {
    label: "Calm & Minimal",
    headline: "Strip friction and elevate clarity so the value story lands instantly.",
    accent: "from-slate-200 via-slate-400 to-slate-600",
    gradient: "bg-gradient-to-br from-slate-300/20 via-slate-500/10 to-slate-900/40",
  },
};

const focusCopy: Record<
  string,
  { label: string; payoff: string; signal: string }
> = {
  "product-foundations": {
    label: "Product foundations",
    payoff: "Teams gain a crisp blueprint for where the product is heading next.",
    signal: "Stronger decision velocity across design, eng, and ops.",
  },
  activation: {
    label: "Activation & onboarding",
    payoff: "New users experience the magic moment in a single sitting.",
    signal: "Activation lift and lower support load.",
  },
  conversion: {
    label: "Conversion engine",
    payoff: "Narrative, pricing, and flows align to move prospects to yes.",
    signal: "Improved trial-to-paid and healthier revenue mix.",
  },
  "design-system": {
    label: "Design system",
    payoff: "Components sync across surfaces so shipping feels modular.",
    signal: "Faster iteration with fewer regressions.",
  },
  "ai-layer": {
    label: "AI differentiation",
    payoff: "Signature intelligence moments that feel both helpful and magical.",
    signal: "Higher retention and share-worthy product moments.",
  },
  story: {
    label: "Story & narrative",
    payoff: "Every touchpoint reinforces the same memorable promise.",
    signal: "Resonant pitch for investors, candidates, and customers.",
  },
};

const createInitialAnswers = (): SurveyAnswers => {
  const base: SurveyAnswers = {};
  surveySteps.forEach((step) => {
    if (step.type === "multi") {
      base[step.id] = [];
      return;
    }

    if (step.type === "scale") {
      const midpoint = Math.round((step.min + step.max) / 2);
      base[step.id] = step.defaultValue ?? midpoint;
      return;
    }

    base[step.id] = "";
  });
  return base;
};

const classNames = (
  ...tokens: Array<string | undefined | null | false>
): string => tokens.filter(Boolean).join(" ");

const findStepById = <T extends SurveyStep["type"]>(
  steps: SurveyStep[],
  id: string,
  type: T
) => steps.find((step) => step.id === id && step.type === type) as Extract<
  SurveyStep,
  { type: T }
> | null;

const timelineStep = findStepById(surveySteps, "timeline", "scale");

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(() => createInitialAnswers());
  const [showSummary, setShowSummary] = useState(false);

  const activeIndex = Math.min(currentIndex, surveySteps.length - 1);
  const activeStep = surveySteps[activeIndex];

  const focusSelections = useMemo(() => {
    const raw = answers["focus"];
    return Array.isArray(raw) ? raw : [];
  }, [answers]);

  const timelineRaw = answers["timeline"];
  const timelineValue = typeof timelineRaw === "number" ? timelineRaw : timelineStep?.defaultValue ?? 6;

  const visionRaw = answers["vision"];
  const visionStatement = typeof visionRaw === "string" && visionRaw.trim().length > 0
    ? visionRaw.trim()
    : "Capture signal that proves we're the category team to watch.";

  const roleRaw = answers["role"];
  const roleSelection = typeof roleRaw === "string" && roleRaw.length > 0 ? roleRaw : "founder";

  const vibeRaw = answers["vibe"];
  const vibeSelection = typeof vibeRaw === "string" && vibeRaw.length > 0 ? vibeRaw : "premium";

  const stepsCompleted = useMemo(() => {
    return surveySteps.reduce((acc, step) => {
      const answer = answers[step.id];
      if (step.type === "multi") {
        return acc + (Array.isArray(answer) && answer.length > 0 ? 1 : 0);
      }
      if (step.type === "scale") {
        return acc + (typeof answer === "number" ? 1 : 0);
      }
      if (typeof answer === "string" && answer.trim().length > 0) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [answers]);

  const progress = showSummary
    ? 100
    : Math.round(((activeIndex + 1) / surveySteps.length) * 100);

  const isStepComplete = (step: SurveyStep) => {
    const answer = answers[step.id];
    if (step.type === "multi") {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (step.type === "scale") {
      return typeof answer === "number";
    }
    return typeof answer === "string" && answer.trim().length > 0;
  };

  const handleSingleSelect = (stepId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: prev[stepId] === value ? "" : value,
    }));
  };

  const handleMultiToggle = (step: OptionStep, value: string) => {
    setAnswers((prev) => {
      const existing = prev[step.id];
      const current = Array.isArray(existing) ? [...existing] : [];
      const alreadySelected = current.includes(value);

      if (alreadySelected) {
        return {
          ...prev,
          [step.id]: current.filter((item) => item !== value),
        };
      }

      if (step.limit && current.length >= step.limit) {
        current.shift();
      }

      current.push(value);
      return {
        ...prev,
        [step.id]: current,
      };
    });
  };

  const handleScaleChange = (stepId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  const handleTextChange = (stepId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  const goToStep = (index: number) => {
    setShowSummary(false);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (!showSummary && currentIndex < surveySteps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    if (!showSummary && currentIndex === surveySteps.length - 1) {
      setShowSummary(true);
      return;
    }
  };

  const goPrevious = () => {
    if (showSummary) {
      setShowSummary(false);
      setCurrentIndex(surveySteps.length - 1);
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const canAdvance = showSummary || isStepComplete(activeStep);

  const vibeMeta = vibeCopy[vibeSelection];
  const roleMeta = roleCopy[roleSelection];

  const focusMeta = focusSelections.map((focus) => focusCopy[focus]).filter(Boolean);

  const timelineLabel = useMemo(() => {
    if (timelineValue <= 3) return "Lightning launch";
    if (timelineValue <= 6) return "Sprint-ready";
    if (timelineValue <= 9) return "Strategic rollout";
    return "Long-term evolution";
  }, [timelineValue]);

  const checkpointDate = useMemo(() => {
    const now = new Date();
    const weeks = Math.max(1, Math.round(timelineValue));
    now.setDate(now.getDate() + weeks * 7);
    return now.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }, [timelineValue]);

  const momentumScore = useMemo(() => {
    const urgencyWeight = 60 - ((timelineValue - 1) / ((timelineStep?.max ?? 12) - 1)) * 28;
    const focusWeight = 20 + focusSelections.length * 8;
    const vibeWeight = vibeSelection === "experimental" ? 18 : vibeSelection === "premium" ? 16 : 12;
    const rawScore = urgencyWeight + focusWeight + vibeWeight;
    return Math.max(48, Math.min(97, Math.round(rawScore)));
  }, [focusSelections.length, timelineValue, vibeSelection]);

  const summaryInsights = useMemo(() => {
    const primaryFocus = focusMeta[0]?.label ?? "Product foundations";
    const focusSignals = focusMeta.map((item) => item.signal);
    const backlogNotes = focusMeta.map((item) => item.payoff);

    return [
      {
        title: `Lead with ${primaryFocus.toLowerCase()}`,
        detail:
          focusSignals[0] ?? "Channel energy into the area with the highest leverage.",
        tag: "Focus signal",
      },
      {
        title: timelineLabel,
        detail: `Plan for first win by ${checkpointDate}. Keep weekly demos to prove traction.`,
        tag: "Tempo",
      },
      {
        title: vibeMeta.label,
        detail: vibeMeta.headline,
        tag: "Experience",
      },
      {
        title: "What to unlock next",
        detail: backlogNotes[1] ?? "Document the playbook so learnings compound across the team.",
        tag: "Next up",
      },
    ];
  }, [checkpointDate, focusMeta, timelineLabel, vibeMeta]);

  const roadmap = useMemo(() => {
    const steps: Array<{ title: string; description: string; indicator: string }> = [];

    if (focusMeta.length > 0) {
      steps.push({
        title: `Zero in on ${focusMeta[0].label.toLowerCase()}`,
        description: focusMeta[0].payoff,
        indicator: "Week 1",
      });
    }

    steps.push({
      title: "Co-create the signature experience",
      description: vibeMeta.headline,
      indicator: "Week 2",
    });

    steps.push({
      title: "Ship the proof and recap the signal",
      description: "Publish a mini post-launch readout with metrics & learnings.",
      indicator: `By ${checkpointDate}`,
    });

    return steps;
  }, [focusMeta, vibeMeta, checkpointDate]);

  const resetForm = () => {
    setAnswers(createInitialAnswers());
    setCurrentIndex(0);
    setShowSummary(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),transparent_58%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(79,70,229,0.22),transparent_65%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-16 lg:flex-row lg:items-start">
        <section className="w-full lg:w-[60%]">
          <header className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Sparkles className="h-4 w-4" /> Signal survey
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Clarify what you actually want to launch next
            </h1>
            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
              Share your intent, dial in the vibe, and we will orchestrate a playbook that moves your product, team, and story forward fast.
            </p>
          </header>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.55)] backdrop-blur">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-slate-400">
              <span>
                {showSummary
                  ? "All steps synced"
                  : `Step ${activeIndex + 1} of ${surveySteps.length}`}
              </span>
              <span>{progress}% complete</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/5">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {!showSummary && (
              <div className="mt-8 flex flex-wrap gap-2">
                {surveySteps.map((step, index) => {
                  const accessible = index <= activeIndex || isStepComplete(step);
                  return (
                    <button
                      key={step.id}
                      type="button"
                      className={classNames(
                        "rounded-full border px-4 py-1 text-xs font-medium transition",
                        accessible
                          ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-100"
                          : "border-white/8 bg-white/5 text-slate-500",
                        index === activeIndex && "bg-cyan-400/20 text-cyan-100"
                      )}
                      disabled={!accessible}
                      onClick={() => accessible && goToStep(index)}
                    >
                      {index + 1}. {step.title}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-10">
              {showSummary ? (
                <div className="space-y-10">
                  <div
                    className={classNames(
                      "overflow-hidden rounded-3xl border border-white/10 p-8",
                      vibeMeta.gradient
                    )}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">
                            Opportunity headline
                          </p>
                          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                            Partner with a {roleMeta.label} who {roleMeta.blurb}
                          </h2>
                        </div>
                        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-200">
                            Momentum
                          </p>
                          <p className="text-3xl font-semibold text-white">{momentumScore}</p>
                        </div>
                      </div>
                      <p className="max-w-2xl text-base text-slate-200">
                        {visionStatement}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {focusMeta.length > 0 ? (
                          focusMeta.map((item) => (
                            <span
                              key={item.label}
                              className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white"
                            >
                              {item.label}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                            Product foundations
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {summaryInsights.map((insight) => (
                      <div
                        key={insight.title}
                        className="h-full rounded-2xl border border-white/10 bg-white/5 p-6"
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                          {insight.tag}
                        </p>
                        <h3 className="mt-3 text-lg font-semibold text-white">
                          {insight.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">{insight.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white">
                        Launch corridor
                      </h3>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-cyan-300 hover:text-white"
                      >
                        Reset survey
                      </button>
                    </div>
                    <ul className="mt-6 space-y-4">
                      {roadmap.map((item) => (
                        <li key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                                {item.indicator}
                              </p>
                              <p className="mt-2 text-base font-medium text-white">
                                {item.title}
                              </p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-cyan-200" />
                          </div>
                          <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowSummary(false)}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-300/60 bg-cyan-400/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-200 hover:bg-cyan-400/30"
                    >
                      <ChevronLeft className="h-4 w-4" /> Edit responses
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/20"
                    >
                      <Share2 className="h-4 w-4" /> Share the plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                      {activeStep.title}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      {activeStep.description}
                    </h2>
                  </div>

                  {activeStep.type === "single" && (
                    <div className="grid gap-4">
                      {activeStep.options.map((option) => {
                        const selected = answers[activeStep.id] === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSingleSelect(activeStep.id, option.value)}
                            className={classNames(
                              "group flex w-full items-center justify-between gap-6 rounded-2xl border bg-white/5 p-5 text-left transition",
                              selected
                                ? "border-cyan-300/70 bg-cyan-400/20 text-white shadow-[0_12px_60px_rgba(8,145,178,0.25)]"
                                : "border-white/10 hover:border-cyan-300/50 hover:bg-cyan-400/10"
                            )}
                          >
                            <div>
                              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                                {option.badge ? (
                                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-cyan-200">
                                    {option.badge}
                                  </span>
                                ) : null}
                              </div>
                              <h3 className="mt-2 text-xl font-semibold text-white">
                                {option.label}
                              </h3>
                              {option.description ? (
                                <p className="mt-2 text-sm text-slate-300">
                                  {option.description}
                                </p>
                              ) : null}
                            </div>
                            <span
                              className={classNames(
                                "flex h-10 w-10 items-center justify-center rounded-full border",
                                selected
                                  ? "border-transparent bg-white text-slate-900"
                                  : "border-white/20 bg-transparent text-transparent"
                              )}
                            >
                              <Check className="h-5 w-5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {activeStep.type === "multi" && (
                    <div className="space-y-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Pick up to {activeStep.limit ?? "no limit"}
                      </p>
                      <div className="grid gap-4">
                        {activeStep.options.map((option) => {
                          const existing = answers[activeStep.id];
                          const selected = Array.isArray(existing)
                            ? existing.includes(option.value)
                            : false;
                          const disabled =
                            !selected &&
                            !!activeStep.limit &&
                            Array.isArray(existing) &&
                            existing.length >= activeStep.limit;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleMultiToggle(activeStep, option.value)}
                              disabled={disabled}
                              className={classNames(
                                "group flex w-full items-center justify-between gap-6 rounded-2xl border bg-white/5 p-5 text-left transition",
                                selected
                                  ? "border-cyan-300/70 bg-cyan-400/20 text-white shadow-[0_12px_50px_rgba(8,145,178,0.2)]"
                                  : disabled
                                  ? "cursor-not-allowed border-white/10 text-slate-500"
                                  : "border-white/10 hover:border-cyan-300/50 hover:bg-cyan-400/10"
                              )}
                            >
                              <div>
                                <h3 className="text-xl font-semibold text-white">
                                  {option.label}
                                </h3>
                                {option.description ? (
                                  <p className="mt-2 text-sm text-slate-300">
                                    {option.description}
                                  </p>
                                ) : null}
                              </div>
                              <span
                                className={classNames(
                                  "flex h-10 w-10 items-center justify-center rounded-full border",
                                  selected
                                    ? "border-transparent bg-white text-slate-900"
                                    : "border-white/20 bg-transparent text-transparent"
                                )}
                              >
                                <Check className="h-5 w-5" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeStep.type === "scale" && (
                    <div className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
                          Signal in ~{timelineValue} {timelineStep?.suffix?.trim()}
                        </span>
                        <div className="flex items-end gap-3">
                          <span className="text-5xl font-semibold text-white">
                            {timelineValue}
                          </span>
                          <span className="pb-2 text-sm uppercase tracking-[0.3em] text-slate-300">
                            weeks to proof
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={activeStep.min}
                        max={activeStep.max}
                        step={activeStep.step}
                        value={timelineValue}
                        onChange={(event) => handleScaleChange(activeStep.id, Number(event.target.value))}
                        className="w-full accent-cyan-400"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        {activeStep.markers?.map((marker) => (
                          <span key={marker}>{marker}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep.type === "text" && (
                    <div className="space-y-4">
                      <textarea
                        rows={activeStep.rows ?? 4}
                        value={typeof answers[activeStep.id] === "string" ? (answers[activeStep.id] as string) : ""}
                        onChange={(event) => handleTextChange(activeStep.id, event.target.value)}
                        placeholder={activeStep.placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-base text-white outline-none transition focus:border-cyan-300 focus:bg-cyan-400/10"
                      />
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {activeStep.helper}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={currentIndex === 0 && !showSummary}
                      className={classNames(
                        "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition",
                        currentIndex === 0 && !showSummary
                          ? "cursor-not-allowed border-white/10 text-slate-500"
                          : "border-white/15 text-slate-200 hover:border-cyan-300 hover:text-white"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canAdvance}
                      className={classNames(
                        "inline-flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-900 transition",
                        !canAdvance && "opacity-50"
                      )}
                    >
                      {currentIndex === surveySteps.length - 1 ? (
                        <>
                          Generate tailored plan <ArrowRight className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[40%]">
          <div className="sticky top-16 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">Opportunity canvas</h2>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                  {stepsCompleted}/{surveySteps.length} synced
                </span>
              </div>

              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-100">
                    Momentum score
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-semibold text-white">{momentumScore}</span>
                    <span className="text-sm uppercase tracking-[0.3em] text-cyan-100">
                      /100
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-cyan-100/80">
                    {vibeMeta.headline}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                    <Target className="h-4 w-4" /> Focus priorities
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(focusMeta.length > 0 ? focusMeta : [focusCopy["product-foundations"]]).map((item) => (
                      <span
                        key={item.label}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-200"
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                    <Timer className="h-4 w-4" /> Tempo
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{timelineLabel}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Target first measurable signal by <span className="text-white">{checkpointDate}</span>.
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                    {timelineValue} week cadence
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    Rallying cry
                  </p>
                  <p className="mt-3 text-base text-slate-200">{visionStatement}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
