import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
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
  const blocksContainerRef = useRef<HTMLDivElement>(null);

  // Robust conversion to string - handle objects, arrays, etc.
  const chapterIdString = (() => {
    if (!chapterId) return undefined;
    if (typeof chapterId === "string") return chapterId;
    if (typeof chapterId === "object") {
      // If it's an object, try to extract _id or id field
      if ("_id" in chapterId) return String((chapterId as any)._id);
      if ("id" in chapterId) return String((chapterId as any).id);
      // Otherwise convert the whole object to string
      return JSON.stringify(chapterId);
    }
    return String(chapterId);
  })();

  // Only proceed if we have a valid string ID
  const isValidChapterId =
    chapterIdString &&
    chapterIdString !== "[object Object]" &&
    chapterIdString.length > 0 &&
    chapterIdString !== "undefined" &&
    chapterIdString !== "null";

  // Fetch chapter to display context & compute next order
  const { data: chapter, error: chapterError } = useQuery({
    enabled: !!isValidChapterId,
    queryKey: ["chapter", chapterIdString],
    queryFn: () => {
      if (!isValidChapterId) {
        throw new Error("Invalid chapter ID");
      }
      return api.get(`/chapters/${chapterIdString}`).then((r) => r.data);
    },
  });

  const nextOrder = chapter ? (chapter.lessons?.length || 0) + 1 : 1;

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<
    "above" | "below" | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null
  );
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

  const addBlock = (type: BlockType) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      data: JSON.parse(JSON.stringify(defaultData[type])),
    } as Block;

    setBlocks([...blocks, newBlock]);

    // Auto-scroll to the new block after a short delay to ensure it's rendered
    setTimeout(() => {
      if (blocksContainerRef.current) {
        const newBlocks = blocksContainerRef.current.children;
        const lastBlock = newBlocks[newBlocks.length - 1] as HTMLElement;
        if (lastBlock) {
          lastBlock.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }
    }, 100);
  };

  const updateBlock = (id: string, newData: any) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, data: newData } : b))
    );
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks;
    });
  };

  // Advanced floating drag system
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    // Don't start drag on form elements or buttons
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea")
    ) {
      return;
    }

    e.preventDefault();

    // Get the element being dragged
    const dragElement = e.currentTarget as HTMLElement;
    const rect = dragElement.getBoundingClientRect();

    // Store initial states
    let currentDragIndex = index;
    let currentDragOverIndex: number | null = null;
    let currentDragOverPosition: "above" | "below" | null = null;
    let isDragActive = false;

    // Calculate offset from mouse to element's top-left
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Set initial states
    setIsDragging(true);
    setDraggedIndex(index);
    setDraggedBlock(blocks[index]);
    setDragOffset({ x: offsetX, y: offsetY });
    setMousePosition({ x: e.clientX, y: e.clientY });

    // Create floating clone
    const clone = dragElement.cloneNode(true) as HTMLElement;
    clone.style.position = "fixed";
    clone.style.left = `${e.clientX - offsetX}px`;
    clone.style.top = `${e.clientY - offsetY}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";
    clone.style.transform = "scale(1.05)";
    clone.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";

    // Advanced shadow system for realistic depth
    clone.style.filter = `
      drop-shadow(0 20px 25px rgba(0, 0, 0, 0.4))
      drop-shadow(0 8px 10px rgba(0, 0, 0, 0.3))
      drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2))
      drop-shadow(0 0 0 1px rgba(236, 72, 153, 0.4))
    `;

    // Remove background and add floating effects
    clone.style.background = "rgba(255, 255, 255, 0.98)";
    clone.style.backdropFilter = "blur(8px) saturate(1.2)";
    clone.style.border = "2px solid rgba(236, 72, 153, 0.3)";
    clone.style.borderRadius = "12px";

    // Add subtle glow
    clone.style.boxShadow = `
      0 0 0 1px rgba(236, 72, 153, 0.2),
      0 0 20px rgba(236, 72, 153, 0.15),
      0 30px 60px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.6)
    `;

    document.body.appendChild(clone);
    setDraggedElement(clone);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragActive) {
        isDragActive = true;
      }

      // Update mouse position for the floating element
      setMousePosition({ x: moveEvent.clientX, y: moveEvent.clientY });

      // Update clone position with smooth following
      if (clone) {
        const newX = moveEvent.clientX - offsetX;
        const newY = moveEvent.clientY - offsetY;

        clone.style.left = `${newX}px`;
        clone.style.top = `${newY}px`;

        // Keep steady 5% scale increase - no rotation
        clone.style.transform = `scale(1.05) translateZ(0)`;
      }

      // Enhanced drop detection using element overlap
      const elements = document.querySelectorAll("[data-block-index]");
      let bestIndex = null;
      let bestPosition = null;
      let maxOverlap = 0;

      // Calculate dragged element bounds
      const draggedRect = {
        left: moveEvent.clientX - offsetX,
        top: moveEvent.clientY - offsetY,
        right: moveEvent.clientX - offsetX + rect.width,
        bottom: moveEvent.clientY - offsetY + rect.height,
        width: rect.width,
        height: rect.height,
      };

      elements.forEach((element) => {
        const targetRect = element.getBoundingClientRect();
        const targetIndex = parseInt(
          element.getAttribute("data-block-index") || "0"
        );

        // Skip self
        if (targetIndex === currentDragIndex) return;

        // Calculate overlap with target element
        const overlapLeft = Math.max(draggedRect.left, targetRect.left);
        const overlapRight = Math.min(draggedRect.right, targetRect.right);
        const overlapTop = Math.max(draggedRect.top, targetRect.top);
        const overlapBottom = Math.min(draggedRect.bottom, targetRect.bottom);

        // Check if there's actual overlap
        if (overlapLeft < overlapRight && overlapTop < overlapBottom) {
          const overlapWidth = overlapRight - overlapLeft;
          const overlapHeight = overlapBottom - overlapTop;
          const overlapArea = overlapWidth * overlapHeight;

          // Calculate percentage of target element that's overlapped
          const targetArea = targetRect.width * targetRect.height;
          const overlapPercentage = overlapArea / targetArea;

          // Only consider significant overlaps (more than 30% of target)
          if (overlapPercentage > 0.3 && overlapArea > maxOverlap) {
            maxOverlap = overlapArea;
            bestIndex = targetIndex;

            // Determine position based on where most overlap occurs
            const draggedCenter = draggedRect.top + draggedRect.height / 2;
            const targetCenter = targetRect.top + targetRect.height / 2;
            bestPosition = draggedCenter < targetCenter ? "above" : "below";
          }
        }

        // Also check for proximity-based detection (when not overlapping)
        if (maxOverlap === 0) {
          const draggedCenterY = draggedRect.top + draggedRect.height / 2;
          const targetCenterY = targetRect.top + targetRect.height / 2;
          const distance = Math.abs(draggedCenterY - targetCenterY);

          // Extended detection zone (within 80px of target center)
          if (distance < 80) {
            const proximityScore = 80 - distance;
            if (proximityScore > maxOverlap) {
              maxOverlap = proximityScore;
              bestIndex = targetIndex;
              bestPosition = draggedCenterY < targetCenterY ? "above" : "below";
            }
          }
        }
      });

      currentDragOverIndex = bestIndex;
      currentDragOverPosition = bestPosition;
      setDragOverIndex(bestIndex);
      setDragOverPosition(bestPosition);
    };

    const handleMouseUp = () => {
      // Perform the block move if valid
      if (
        currentDragIndex !== null &&
        currentDragOverIndex !== null &&
        currentDragOverPosition
      ) {
        let targetIndex = currentDragOverIndex;

        if (currentDragOverPosition === "below") {
          targetIndex = currentDragOverIndex + 1;
        }

        if (currentDragIndex < targetIndex) {
          targetIndex--;
        }

        if (currentDragIndex !== targetIndex) {
          moveBlock(currentDragIndex, targetIndex);
        }
      }

      // Cleanup with smooth animation
      if (clone) {
        clone.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
        clone.style.transform = "scale(1.0)";
        clone.style.opacity = "0";

        setTimeout(() => {
          if (clone.parentNode) {
            clone.parentNode.removeChild(clone);
          }
        }, 300);
      }

      // Reset states
      setIsDragging(false);
      setDraggedIndex(null);
      setDragOverIndex(null);
      setDragOverPosition(null);
      setDraggedElement(null);
      setDraggedBlock(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const mutation = useMutation({
    mutationFn: (body: any) => api.post(`/lessons`, body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapter", chapterIdString] });
      navigate(`/chapters/${chapterIdString}`);
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please provide lesson title");
      return;
    }
    mutation.mutate({
      title,
      chapterId: chapterIdString,
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

          {/* Blocks editor - moved before block palette */}
          <div ref={blocksContainerRef} className="space-y-4">
            {blocks.map((block, idx) => (
              <div key={block.id} className="relative">
                {/* Enhanced drop indicator above */}
                {dragOverIndex === idx &&
                  dragOverPosition === "above" &&
                  isDragging &&
                  draggedIndex !== idx && (
                    <div className="absolute -top-4 left-0 right-0 z-50 flex justify-center">
                      <div className="relative w-full h-3 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-500 to-transparent rounded-full shadow-lg animate-pulse opacity-80"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-400 to-transparent rounded-full blur-sm animate-pulse"></div>
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="w-6 h-6 bg-gradient-to-br from-magenta-400 to-magenta-600 rounded-full shadow-xl flex items-center justify-center animate-bounce">
                            <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>
                          </div>
                        </div>
                        {/* Arrow indicator */}
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-magenta-500 animate-pulse">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M8 2l6 6H10v6H6V8H2l6-6z" />
                          </svg>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-magenta-500 animate-pulse">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M8 2l6 6H10v6H6V8H2l6-6z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                <div
                  data-block-index={idx}
                  onMouseDown={(e) => handleMouseDown(e, idx)}
                  className={`group p-4 rounded bg-gray-100 dark:bg-gray-900 space-y-2 border border-gray-300 dark:border-gray-700 transition-all duration-200 ${
                    draggedIndex === idx && isDragging
                      ? "opacity-30 scale-95 bg-gray-50 dark:bg-gray-800 border-dashed border-gray-400 dark:border-gray-600"
                      : "cursor-grab hover:shadow-lg hover:scale-[1.02] hover:border-gray-400 dark:hover:border-gray-600"
                  } ${
                    dragOverIndex === idx && isDragging && draggedIndex !== idx
                      ? "ring-4 ring-magenta-400 ring-opacity-60 bg-magenta-50 dark:bg-magenta-900/20 transform scale-102"
                      : ""
                  }`}
                  style={{
                    transform:
                      draggedIndex === idx && isDragging ? "none" : "none",
                    boxShadow:
                      draggedIndex === idx && isDragging
                        ? "inset 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.1)"
                        : undefined,
                    background:
                      draggedIndex === idx && isDragging
                        ? "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0, 0, 0, 0.03) 4px, rgba(0, 0, 0, 0.03) 8px)"
                        : undefined,
                  }}
                >
                  {draggedIndex === idx && isDragging ? (
                    // Ghost placeholder when dragging
                    <div className="flex items-center justify-center h-full min-h-[60px] text-gray-400 dark:text-gray-500">
                      <div className="text-center">
                        <div className="text-2xl mb-2">👻</div>
                        <div className="text-sm font-medium">
                          Dragging {block.type}...
                        </div>
                        <div className="text-xs opacity-60">
                          Drop to reorder
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Normal content
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 py-1 px-2 -mx-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                          <span
                            className={`text-sm pointer-events-none transition-colors duration-200 ${
                              draggedIndex === idx && isDragging
                                ? "text-magenta-600 dark:text-magenta-400"
                                : "text-gray-500"
                            }`}
                          >
                            ⋮⋮
                          </span>
                          <span
                            className={`capitalize font-semibold pointer-events-none transition-colors duration-200 ${
                              draggedIndex === idx && isDragging
                                ? "text-magenta-700 dark:text-magenta-300"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {block.type}
                          </span>
                          {!isDragging && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              drag to reorder
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-lg cursor-pointer z-10 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBlocks(blocks.filter((b) => b.id !== block.id));
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Block specific editor */}
                      <div className="relative z-10">
                        {block.type === "subtitle" && (
                          <input
                            value={(block.data as any).text}
                            onChange={(e) =>
                              updateBlock(block.id, { text: e.target.value })
                            }
                            placeholder="Subtitle text"
                            className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {block.type === "description" && (
                          <textarea
                            value={(block.data as any).text}
                            onChange={(e) =>
                              updateBlock(block.id, { text: e.target.value })
                            }
                            placeholder="Description"
                            className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded min-h-[80px] text-black dark:text-white focus:ring-2 focus:ring-magenta-500 focus:outline-none resize-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {block.type === "code" && (
                          <textarea
                            value={(block.data as any).code}
                            onChange={(e) =>
                              updateBlock(block.id, { code: e.target.value })
                            }
                            placeholder="Code snippet"
                            className="w-full bg-gray-100 dark:bg-gray-800 font-mono px-3 py-2 rounded min-h-[80px] text-black dark:text-white focus:ring-2 focus:ring-magenta-500 focus:outline-none resize-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {block.type === "url" && (
                          <input
                            value={(block.data as any).href}
                            onChange={(e) =>
                              updateBlock(block.id, { href: e.target.value })
                            }
                            placeholder="https://example.com"
                            className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {block.type === "youtube" && (
                          <input
                            value={(block.data as any).url}
                            onChange={(e) =>
                              updateBlock(block.id, { url: e.target.value })
                            }
                            placeholder="YouTube URL"
                            className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        {block.type === "image" && (
                          <input
                            value={(block.data as any).src}
                            onChange={(e) =>
                              updateBlock(block.id, { src: e.target.value })
                            }
                            placeholder="Image URL"
                            className="w-full bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-black dark:text-white focus:ring-2 focus:ring-magenta-500 focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Enhanced drop indicator below */}
                {dragOverIndex === idx &&
                  dragOverPosition === "below" &&
                  isDragging &&
                  draggedIndex !== idx && (
                    <div className="absolute -bottom-4 left-0 right-0 z-50 flex justify-center">
                      <div className="relative w-full h-3 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-500 to-transparent rounded-full shadow-lg animate-pulse opacity-80"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-400 to-transparent rounded-full blur-sm animate-pulse"></div>
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="w-6 h-6 bg-gradient-to-br from-magenta-400 to-magenta-600 rounded-full shadow-xl flex items-center justify-center animate-bounce">
                            <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>
                          </div>
                        </div>
                        {/* Arrow indicator */}
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 rotate-180 text-magenta-500 animate-pulse">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M8 2l6 6H10v6H6V8H2l6-6z" />
                          </svg>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-180 text-magenta-500 animate-pulse">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M8 2l6 6H10v6H6V8H2l6-6z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Block palette - moved below blocks editor for better UX */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="w-full mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                📝 Add content blocks:
              </p>
            </div>
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
                className="btn-ghost border border-gray-300 dark:border-gray-600 hover:border-brand transition-all duration-200 hover:scale-105"
                onClick={() => addBlock(b.t)}
              >
                + {b.label}
              </button>
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
