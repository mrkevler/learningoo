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
          <h2
            key={idx}
            className="text-2xl font-semibold my-12 text-gray-900 dark:text-white"
          >
            {block.data.text}
          </h2>
        );
      case "description":
        return (
          <p
            key={idx}
            className="my-8 whitespace-pre-line text-gray-900 dark:text-white leading-relaxed"
          >
            {block.data.text}
          </p>
        );
      case "code":
        return (
          <div key={idx} className="relative my-12">
            <pre className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg overflow-x-auto border border-gray-300 dark:border-gray-600">
              <code className="text-green-600 dark:text-green-300">
                {block.data.code}
              </code>
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(block.data.code)}
              className="absolute top-3 right-3 text-sm bg-gray-600 dark:bg-gray-600 px-3 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-500 text-white transition-colors"
            >
              Copy
            </button>
          </div>
        );
      case "url":
        return (
          <div key={idx} className="my-8">
            <a
              href={block.data.href}
              target="_blank"
              rel="nofollow noreferrer noopener"
              className="text-brand underline hover:text-brand-dark"
            >
              {block.data.href}
            </a>
          </div>
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
          <div key={idx} className="my-16">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="mx-auto w-full max-w-2xl aspect-video rounded-lg shadow-lg"
            ></iframe>
          </div>
        );
      case "image":
        return (
          <div key={idx} className="my-16">
            <img
              src={block.data.src}
              alt="lesson img"
              className="mx-auto rounded-lg shadow-lg max-w-full h-auto object-contain"
              style={{ aspectRatio: "auto" }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-bold text-brand">{lesson.title}</h1>
          {isOwner && (
            <a
              href={`/lessons/${lesson._id}/edit`}
              className="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
            >
              Edit Lesson
            </a>
          )}
        </div>
        <div className="max-w-4xl mx-auto mt-12">
          {lesson.contentBlocks?.map((block: Block, idx: number) =>
            renderBlock(block, idx)
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LessonDetailPage;
