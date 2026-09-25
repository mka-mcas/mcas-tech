import InteractiveSEM from "@/components/sem/InteractiveSEM";

export const metadata = {
  title: "Interactive SEM Explorer | MCAS",
  description: "Interactive exploration of the locked final structural equation model for motorcycle fatigue and unsafe riding.",
};

export default function SEMPage() {
  return <InteractiveSEM />;
}
