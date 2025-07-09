import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { api } from "../services/api";

// Allowed block types
export type BlockType =
  | "subtitle"
  | "description"
  | "code"
  | "url"
  | "youtube"
  | "image";

interface BlockBase<T> {
  id: string;
  type: BlockType;
  data: T;
}

type SubtitleBlock = BlockBase<{ text: string }>;
type DescriptionBlock = BlockBase<{ text: string }>;
type CodeBlock = BlockBase<{ code: string }>;
type UrlBlock = BlockBase<{ href: string }>;
type YoutubeBlock = BlockBase<{ url: string }>;
type ImageBlock = BlockBase<{ src: string }>;

type Block =
  | SubtitleBlock
  | DescriptionBlock
  | CodeBlock
  | UrlBlock
  | YoutubeBlock
  | ImageBlock;

const defaultData: Record<BlockType, any> = {
  subtitle: { text: "" },
  description: { text: "" },
  code: { code: "" },
  url: { href: "https://" },
  youtube: { url: "https://www.youtube.com/watch?v=" },
  image: {
    src: `https://cataas.com/cat?${Date.now()}&width=800&height=400`,
  },
};

const CreateLessonPage = () => {
  const { id: chapterId } = useParams(); // chapter id
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch chapter to display context & compute next order
  const { data: chapter } = useQuery({
    enabled: !!chapterId,
    queryKey: ["chapter", chapterId],
    queryFn: () => api.get(`/chapters/${chapterId}`).then((r) => r.data),
  });

  const nextOrder = chapter ? (chapter.lessons?.length || 0) + 1 : 1;

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [dragging, setDragging] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<"above" | "below">("below");

  const addBlock = (type: BlockType) => {
    setBlocks([
      ...blocks,
      {
        id: crypto.randomUUID(),
        type,
        data: JSON.parse(JSON.stringify(defaultData[type])),
      } as Block,
    ]);
  };

  const updateBlock = (id: string, newData: any) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, data: newData } : b))
    );
  };

  const moveBlock = (from: number, to: number) => {
    setBlocks((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  // Drag helpers
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", String(index));
    setDragging(true);
  };

  const onDragOverBlock = (e: React.DragEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;
    if (e.clientY < middleY) {
      setHoverIdx(idx);
      setHoverPos("above");
    } else {
      setHoverIdx(idx);
      setHoverPos("below");
    }
  };

  const onDragLeaveBlock = () => {
    setHoverIdx(null);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));

    let to = index;
    if (hoverPos === "below") {
      to = index + (from < index ? 0 : 1); // adjust if dragging upwards
    } else {
      to = index + (from < index ? -1 : 0);
    }

    moveBlock(from, to);
    setDragging(false);
    setHoverIdx(null);
  };

  const mutation = useMutation({
    mutationFn: (body: any) => api.post(`/lessons`, body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
      navigate(`/chapters/${chapterId}`);
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please provide lesson title");
      return;
    }
    mutation.mutate({
      title,
      chapterId,
      contentBlocks: blocks,
      order: nextOrder,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold text-brand">Create Lesson</h1>
        {chapter && (
          <p>
            Chapter: <span className="font-semibold">{chapter.title}</span> ·
            Lesson #{nextOrder}
          </p>
        )}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Lesson title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-brand"
          />
          {/* Block palette */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { t: "subtitle", label: "Subtitle" },
                { t: "description", label: "Description" },
                { t: "code", label: "Code Snippet" },
                { t: "url", label: "URL" },
                { t: "youtube", label: "YouTube" },
                { t: "image", label: "Image" },
              ] as { t: BlockType; label: string }[]
            ).map((b) => (
              <button
                key={b.t}
                type="button"
                className="btn-ghost"
                onClick={() => addBlock(b.t)}
              >
                + {b.label}
              </button>
            ))}
          </div>

          {/* Blocks editor */}
          <div className="space-y-4">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragOver={(e) => onDragOverBlock(e, idx)}
                onDragLeave={onDragLeaveBlock}
                onDrop={(e) => onDrop(e, idx)}
                className={`p-4 rounded bg-gray-100 dark:bg-gray-900 space-y-2 border border-gray-300 dark:border-gray-700 relative ${dragging && hoverIdx === idx && hoverPos === "above" ? "before:absolute before:left-0 before:right-0 before:-top-px before:h-0.5 before:bg-brand" : ""} ${dragging && hoverIdx === idx && hoverPos === "below" ? "after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:bg-brand" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <span className="capitalize font-semibold">{block.type}</span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() =>
                      setBlocks(blocks.filter((b) => b.id !== block.id))
                    }
                  >
                    ✕
                  </button>
                </div>
                {/* Block specific editor */}
                {block.type === "subtitle" && (
                  <input
                    value={(block.data as any).text}
                    onChange={(e) =>
                      updateBlock(block.id, { text: e.target.value })
                    }
                    placeholder="Subtitle text"
                    className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white"
                  />
                )}
                {block.type === "description" && (
                  <textarea
                    value={(block.data as any).text}
                    onChange={(e) =>
                      updateBlock(block.id, { text: e.target.value })
                    }
                    placeholder="Description"
                    className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded min-h-[80px] text-black dark:text-white"
                  />
                )}
                {block.type === "code" && (
                  <textarea
                    value={(block.data as any).code}
                    onChange={(e) =>
                      updateBlock(block.id, { code: e.target.value })
                    }
                    placeholder="Code snippet"
                    className="w-full bg-gray-100 dark:bg-gray-800 font-mono px-3 py-2 rounded min-h-[80px] text-black dark:text-white"
                  />
                )}
                {block.type === "url" && (
                  <input
                    value={(block.data as any).href}
                    onChange={(e) =>
                      updateBlock(block.id, { href: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white"
                  />
                )}
                {block.type === "youtube" && (
                  <input
                    value={(block.data as any).url}
                    onChange={(e) =>
                      updateBlock(block.id, { url: e.target.value })
                    }
                    placeholder="YouTube URL"
                    className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white"
                  />
                )}
                {block.type === "image" && (
                  <input
                    value={(block.data as any).src}
                    onChange={(e) =>
                      updateBlock(block.id, { src: e.target.value })
                    }
                    placeholder="Image URL"
                    className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>
          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary w-full sm:w-auto"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLessonPage;
