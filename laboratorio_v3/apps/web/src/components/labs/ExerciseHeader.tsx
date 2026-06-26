import { ExerciseStepLayout } from "../ExerciseStepLayout";

type ExerciseHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  groupName: string;
  stateVersion: string;
  workbookLabel: string;
  checkpointStatus: string;
  children: React.ReactNode;
};

export function ExerciseHeader({
  eyebrow,
  title,
  subtitle,
  groupName,
  stateVersion,
  workbookLabel,
  checkpointStatus,
  children
}: ExerciseHeaderProps) {
  return (
    <ExerciseStepLayout
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      meta={[
        { label: "Grupo", value: groupName },
        { label: "Estado", value: stateVersion },
        { label: "Workbook", value: workbookLabel },
        { label: "Checkpoint", value: checkpointStatus }
      ]}
    >
      {children}
    </ExerciseStepLayout>
  );
}
