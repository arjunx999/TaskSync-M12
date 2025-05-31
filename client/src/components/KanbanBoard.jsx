import React, { useState, useEffect } from "react";
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
import confetti from "canvas-confetti";
import axios from "axios";
import { useAppContext } from "../context/UserContext";

// Confetti handler for completion
const handleComplete = () => {
  const end = Date.now() + 1.5 * 1000;
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#ffe166"];
  const frame = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    });
    requestAnimationFrame(frame);
  };
  frame();
};

const columns = {
  todo: {
    name: "To-do",
    items: [
      { id: "1", content: "Redesign a Landing Page for a Mobile App" },
      {
        id: "4",
        content:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, est reiciendis commodi nulla alias dolorum harum neque molestias iusto fugit m dolor sit amet consectetur adipisicing elit. Necessitatibus, est reiciendis commodi nulla alias dolorum harum neque molestias iusto fugit!",
      },
    ],
  },
  progress: {
    name: "In-Progress",
    items: [{ id: "2", content: "demo task is goood" }],
  },
  completed: {
    name: "Completed",
    items: [],
  },
};

// Task Detail View
function TaskDetail({ task, onBack }) {
  return (
    <div
      className="w-full h-[77vh] overflow-scroll overflow-x-hidden p-2 rounded-xl bg--100 [scrollbar-width:none] 
                [-ms-overflow-style:none] 
                [&::-webkit-scrollbar]:w-0 
                [&::-webkit-scrollbar]:bg-transparent"
    >
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-800 cursor-pointer justify-center"
      >
        <i className="ri-arrow-left-line"></i>
        <h1>Back to Board</h1>
      </button>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 font-['Fredoka']">
          {task.content}
        </h1>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <i className="ri-calendar-todo-line text-xl text-red-500"></i>
            <span className="text-lg">Due Date: 28-06-2025</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-xl text-blue-500"></i>
            <span className="text-lg">Status: {task.status}</span>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg h-48 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Full Description :</h2>
            <p className="text-gray-700 leading-relaxed">{task.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sortable Task Card
function SortableItem({ id, content, onInfoClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="relative mb-2">
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="bg-white shadow-md border-[0.1rem] shadow-zinc-400 rounded-xl cursor-pointer h-[20vh] z-0 overflow-hidden hover:scale-[1.02] transition-transform duration-350 ease-in-out flex flex-col"
      >
        <div className="w-full h-[70%] bg--300 p-3 leading-5 ">
          <h1 className="font-['Fredoka']">
            {content.length > 82 ? (
              <>
                {content.slice(0, 82)}
                <span className="text-blue-500 font-black">....</span>
              </>
            ) : (
              content
            )}
          </h1>
        </div>
        <div className="w-full h-[30%] bg-lime-200 flex font-['Fredoka'] items-center justify-start pl-3 gap-x-2 border-t-[0.1rem]">
          <i className="ri-calendar-todo-line text-xl text-red-500"></i>
          <h1 className="font-medium">28-06-2025</h1>
        </div>
      </div>
      {/* Info Icon (not inside draggable area) */}
      <div
        className="w-[2.7vw] h-[2.7vw] bg-blue-200 cursor-pointer rounded-full absolute -right-2 -top-2 flex items-center justify-center border-[0.1rem] border-black hover:shadow-lg z-20"
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick();
        }}
      >
        <i className="ri-information-line text-zinc-800"></i>
      </div>
    </div>
  );
}

// Droppable Column
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

// Main KanbanBoard Component
export default function KanbanBoard() {
  const [tasks, setTasks] = useState(columns);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // dnd-kit sensor with activation constraint for click/drag distinction
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Handler for info icon click
  const handleInfoClick = (task, columnId) => {
    setSelectedTask({
      ...task,
      status: tasks[columnId].name,
    });
  };

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

    if (toColumnId === "completed") {
      handleComplete();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }

  const { user } = useAppContext();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchUserTasks = async () => {
      const res = await axios.get(
        `http://localhost:9999/tasks/user/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
    };
    fetchUserTasks();
  }, []);

  return (
    <div className="flex gap-3 pt-3 px-3 w-full h-full">
      {selectedTask ? (
        <TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(tasks).map(([columnId, column]) => (
            <div key={columnId} className="w-[32.3%] max-w-sm">
              <h2 className="text-lg text-left font-['Fredoka'] ml-5 font-semibold">
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
                      onInfoClick={() => handleInfoClick(item, columnId)}
                    />
                  ))}
                </DroppableColumn>
              </SortableContext>
            </div>
          ))}
          <DragOverlay>
            {activeCard ? (
              <div className="bg-white border-[0.1rem] shadow-xl h-[20vh] overflow-hidden p-4 mb-2 rounded-xl cursor-move shadow-zinc-400 z-0 hover:scale-[1.02] transition-transform duration-350 ease-in-out flex items-center justify-center text-lg font-['Fredoka']">
                <h1>Drop To Update Progress</h1>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
