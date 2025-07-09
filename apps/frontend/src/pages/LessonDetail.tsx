import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { useAppSelector } from "../store";

interface Block {
  type: string;
  data: any;
}

const LessonDetailPage = () => {
  const { id } = useParams();
  const user = useAppSelector((s) => s.auth.user);

  const {
    data: lesson,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lesson", id],
    enabled: !!id,
    queryFn: () => api.get(`/lessons/${id}`).then((r) => r.data),
  });

  if (isLoading) return <Layout>Loading...</Layout>;
  if (error || !lesson) return <Layout>Lesson not found.</Layout>;
  const isOwner =
    user &&
    user._id === (lesson.chapterId?.courseId?.tutorId || lesson.tutorId);

  const renderBlock = (block: Block, idx: number) => {
    switch (block.type) {
      case "subtitle":
        return (
          <h2 key={idx} className="text-2xl font-semibold my-4">
            {block.data.text}
          </h2>
        );
      case "description":
        return (
          <p key={idx} className="my-2 whitespace-pre-line">
            {block.data.text}
          </p>
        );
      case "code":
        return (
          <div key={idx} className="relative my-4">
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code>{block.data.code}</code>
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(block.data.code)}
              className="absolute top-2 right-2 text-sm bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
            >
              Copy
            </button>
          </div>
        );
      case "url":
        return (
          <a
            key={idx}
            href={block.data.href}
            target="_blank"
            rel="nofollow noreferrer noopener"
            className="text-brand underline"
          >
            {block.data.href}
          </a>
        );
      case "youtube":
        const videoId = (() => {
          try {
            const urlObj = new URL(block.data.url);
            const v = urlObj.searchParams.get("v");
            return v || block.data.url;
          } catch {
            return block.data.url;
          }
        })();
        return (
          <div key={idx} className="my-4">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="mx-auto w-full max-w-xl aspect-video rounded"
            ></iframe>
          </div>
        );
      case "image":
        return (
          <img
            key={idx}
            src={block.data.src}
            alt="lesson img"
            className="my-4 mx-auto rounded"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-brand">{lesson.title}</h1>
          {isOwner && (
            <a
              href={`/lessons/${lesson._id}/edit`}
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
            >
              Edit Lesson
            </a>
          )}
        </div>
        {lesson.contentBlocks?.map((block: Block, idx: number) =>
          renderBlock(block, idx)
        )}
      </div>
    </Layout>
  );
};

export default LessonDetailPage;
