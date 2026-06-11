import { AttemptResultLoader } from "../../../components/results/AttemptResultLoader";

interface ResultsPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { attemptId } = await params;

  return <AttemptResultLoader attemptId={attemptId} />;
}
