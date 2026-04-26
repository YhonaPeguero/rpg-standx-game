import { notFound } from "next/navigation";
import { getChapterById } from "@/lib/content/loader";
import { ScenePlayer } from "@/components/scene/ScenePlayer";

type ScenePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScenePage({ params }: ScenePageProps) {
  const { id } = await params;
  const chapter = getChapterById(id);

  if (!chapter) {
    notFound();
  }

  return <ScenePlayer chapter={chapter} />;
}
