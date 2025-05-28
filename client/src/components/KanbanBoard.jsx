import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columns = {
  todo: {
    name: "Todo",
    items: [
      { id: "1", content: "Learn DnD Kit" },
      {
        id: "4",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, est reiciendis commodi nulla alias dolorum harum neque molestias iusto fugit!",
      },
    ],
  },
  progress: {
    name: "Progress",
    items: [{ id: "2", content: "demo task is goood" }],
  },
  completed: {
    name: "Completed",
    items: [],
  },
};

function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-zinc-100 shadow-lg p-4 mb-2 rounded cursor-pointer h-[20vh] overflow-hidden"
    >
      {content}
    </div>
  );
}

function DroppableColumn({ id, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="p-2 rounded bg--300 h-[72vh] overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent"
    >
      {children}
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(columns);
  const [activeCard, setActiveCard] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(event) {
    const { active } = event;
    const card = Object.values(tasks)
      .flatMap((col) => col.items)
      .find((item) => item.id === active.id);
    setActiveCard(card);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const fromColumnId = Object.keys(tasks).find((colId) =>
      tasks[colId].items.some((item) => item.id === active.id)
    );
    const toColumnId =
      over.id in tasks
        ? over.id
        : Object.keys(tasks).find((colId) =>
            tasks[colId].items.some((item) => item.id === over.id)
          );

    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;

    const fromItems = [...tasks[fromColumnId].items];
    const toItems = [...tasks[toColumnId].items];
    const movingItem = fromItems.find((item) => item.id === active.id);

    const newFromItems = fromItems.filter((item) => item.id !== active.id);
    const newToItems = [...toItems, movingItem];

    setTasks({
      ...tasks,
      [fromColumnId]: { ...tasks[fromColumnId], items: newFromItems },
      [toColumnId]: { ...tasks[toColumnId], items: newToItems },
    });

    setActiveCard(null);
  }

  return (
    <div className="flex gap-3 pt-3 px-3 w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {Object.entries(tasks).map(([columnId, column]) => (
          <div key={columnId} className="w-[32.3%] max-w-sm">
            <h2 className="text-lg text-left font-medium font-['Fredoka'] ml-5">
              {column.name}
            </h2>
            <SortableContext
              items={column.items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn id={columnId}>
                {column.items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    content={item.content}
                  />
                ))}
              </DroppableColumn>
            </SortableContext>
          </div>
        ))}

        <DragOverlay>
          {activeCard ? (
            <div className="bg-white shadow-md h-[20vh] overflow-hidden p-4 mb-2 rounded cursor-move">
              {activeCard.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
