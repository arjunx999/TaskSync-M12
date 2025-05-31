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

// Column mapping for status
const COLUMN_MAP = {
  "To Do": "todo",
  "In Progress": "progress",
  Completed: "completed",
};
const COLUMN_DISPLAY = {
  todo: "To Do",
  progress: "In Progress",
  completed: "Completed",
};

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

// Task Detail View
function TaskDetail({ task, onBack, refetchTasks }) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:9999/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refetchTasks) await refetchTasks();
      onBack();
    } catch (err) {
      alert("Failed to delete task!");
      console.error(err);
    }
  };

  return (
    <div className="w-full h-[77vh] overflow-scroll overflow-x-hidden p-2 rounded-xl bg--100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-800 cursor-pointer justify-center"
      >
        <i className="ri-arrow-left-line"></i>
        <h1>Back to Board</h1>
      </button>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 font-['Fredoka']">
          {task.title}
        </h1>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <i
              className={
                "ri-calendar-todo-line text-xl " +
                (isOverdue ? "text-red-500" : "text-zinc-900")
              }
            ></i>
            <span
              className={
                "text-lg" + (isOverdue ? " text-red-600 font-semibold" : "")
              }
            >
              Due Date:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-xl text-blue-500"></i>
            <span className="text-lg">Status: {task.status}</span>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg h-48 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-2">Full Description :</h2>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>
        </div>
        <button
          className="mt-8 px-5 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 flex items-center gap-2 transition"
          onClick={handleDelete}
        >
          <i className="ri-delete-bin-line"></i>
          Delete Task
        </button>
      </div>
    </div>
  );
}

// Sortable Task Card
function SortableItem({ id, title, dueDate, onInfoClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isOverdue =
    dueDate &&
    new Date(dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

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
            {title.length > 82 ? (
              <>
                {title.slice(0, 82)}
                <span className="text-blue-500 font-black">....</span>
              </>
            ) : (
              title
            )}
          </h1>
        </div>
        <div className="w-full h-[30%] bg-lime-200 flex font-['Fredoka'] items-center justify-start pl-3 gap-x-2 border-t-[0.1rem]">
          <i
            className={
              "ri-calendar-todo-line text-xl " +
              (isOverdue ? "text-red-500" : "text-zinc-900")
            }
          ></i>
          <h1
            className={
              "font-medium" + (isOverdue ? " text-red-500 font-semibold" : "")
            }
          >
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No Due Date"}
          </h1>
        </div>
      </div>
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
  const [tasksByColumn, setTasksByColumn] = useState({
    todo: [],
    progress: [],
    completed: [],
  });
  const [activeCard, setActiveCard] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const { user } = useAppContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const fetchUserTasks = async () => {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:9999/tasks/user/${user._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const columns = { todo: [], progress: [], completed: [] };
    for (const task of res.data) {
      const key = COLUMN_MAP[task.status] || "todo";
      columns[key].push(task);
    }
    setTasksByColumn(columns);
  };

  useEffect(() => {
    fetchUserTasks();
  }, [user._id]);

  const handleInfoClick = (task) => {
    setSelectedTask(task);
  };

  function handleDragStart(event) {
    const { active } = event;
    const card = Object.values(tasksByColumn)
      .flatMap((col) => col)
      .find((item) => item._id === active.id);
    setActiveCard(card);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const fromColumnId = Object.keys(tasksByColumn).find((colId) =>
      tasksByColumn[colId].some((item) => item._id === active.id)
    );
    const toColumnId =
      over.id in tasksByColumn
        ? over.id
        : Object.keys(tasksByColumn).find((colId) =>
            tasksByColumn[colId].some((item) => item._id === over.id)
          );

    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;

    const fromItems = [...tasksByColumn[fromColumnId]];
    const toItems = [...tasksByColumn[toColumnId]];
    const movingItem = fromItems.find((item) => item._id === active.id);

    // Backend status update
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        "http://localhost:9999/tasks/update",
        {
          taskId: movingItem._id,
          currentStatus: COLUMN_DISPLAY[toColumnId],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      alert("Failed to update task status!");
      return;
    }

    const newFromItems = fromItems.filter((item) => item._id !== active.id);
    const newToItems = [
      ...toItems,
      { ...movingItem, status: COLUMN_DISPLAY[toColumnId] },
    ];

    setTasksByColumn({
      ...tasksByColumn,
      [fromColumnId]: newFromItems,
      [toColumnId]: newToItems,
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

  return (
    <div className="flex gap-3 pt-3 px-3 w-full h-full">
      {selectedTask ? (
        <TaskDetail
          task={selectedTask}
          onBack={() => setSelectedTask(null)}
          refetchTasks={fetchUserTasks}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(tasksByColumn).map(([columnId, items]) => (
            <div key={columnId} className="w-[32.3%] max-w-sm">
              <h2 className="text-lg text-left font-['Fredoka'] ml-5 font-semibold">
                {COLUMN_DISPLAY[columnId]}
              </h2>
              <SortableContext
                items={items.map((item) => item._id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn id={columnId}>
                  {[...items]
                    .sort((a, b) => {
                      // Treat missing dueDate as far future
                      const dateA = a.dueDate
                        ? new Date(a.dueDate)
                        : new Date(8640000000000000);
                      const dateB = b.dueDate
                        ? new Date(b.dueDate)
                        : new Date(8640000000000000);
                      return dateA - dateB;
                    })
                    .map((item) => (
                      <SortableItem
                        key={item._id}
                        id={item._id}
                        title={item.title}
                        dueDate={item.dueDate}
                        onInfoClick={() => handleInfoClick(item)}
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
