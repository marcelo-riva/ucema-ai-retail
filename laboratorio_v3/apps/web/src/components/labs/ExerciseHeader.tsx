import { ExerciseStepLayout } from "../ExerciseStepLayout";

type ExerciseHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  groupName: string;
  checkpointStatus?: string;
  submittedAt?: string;
  children: React.ReactNode;
};

function formatSubmittedAt(value?: string): string | null {
  if (!value) return null;
  try {
    return new Date(value).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return value;
  }
}

export function ExerciseHeader({
  eyebrow,
  title,
  subtitle,
  groupName,
  checkpointStatus = "borrador",
  submittedAt,
  children
}: ExerciseHeaderProps) {
  const submittedAtFormatted = formatSubmittedAt(submittedAt);
  const isSubmitted = checkpointStatus === "submitted";

  return (
    <ExerciseStepLayout
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      meta={[
        { label: "Grupo", value: groupName },
        {
          label: "Checkpoint",
          value: isSubmitted && submittedAtFormatted
            ? `Enviado el ${submittedAtFormatted}`
            : checkpointStatus === "submitted"
              ? "Enviado"
              : checkpointStatus === "reset"
                ? "Reseteado"
                : "Borrador"
        }
      ]}
    >
      {children}
    </ExerciseStepLayout>
  );
}
