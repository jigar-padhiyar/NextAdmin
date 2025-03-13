import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import { reorderUsers, selectAllUsers } from "@/state/store/feature/userSlice";
import { User } from "@/state/store/feature/userSlice";
import UserItem from "./UserItem";

interface DraggableUserListProps {
  users: User[];
  startIndex: number;
}

export default function DraggableUserList({
  users,
  startIndex,
}: DraggableUserListProps) {
  const [items, setItems] = useState(users);
  const dispatch = useAppDispatch();
  const allUsers = useAppSelector(selectAllUsers);

  useEffect(() => {
    if (JSON.stringify(users) !== JSON.stringify(items)) {
      setItems(users);
    }
  }, [users, items]);

  // Device detection
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  // Configure sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: isIOS ? 300 : 200,
        tolerance: isIOS ? 15 : 8,
        distance: isIOS ? 15 : undefined,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isIOS ? 15 : 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find the IDs of the dragged item and the target position
    const draggedId = Number(active.id);
    const overId = Number(over.id);

    // Find positions in the current page items
    const localDraggedIndex = items.findIndex((item) => item.id === draggedId);
    const localOverIndex = items.findIndex((item) => item.id === overId);

    // Update local state for immediate UI feedback
    setItems((prevItems) =>
      arrayMove(prevItems, localDraggedIndex, localOverIndex)
    );

    // Find positions in the global user list
    const globalDraggedIndex = allUsers.findIndex(
      (user) => user.id === draggedId
    );
    const globalOverIndex = allUsers.findIndex((user) => user.id === overId);

    // Create a copy of all users and perform the move in the full list
    const newUsers = [...allUsers];
    const [movedUser] = newUsers.splice(globalDraggedIndex, 1);
    newUsers.splice(globalOverIndex, 0, movedUser);

    // Update the Redux store with the complete reordered array
    dispatch(reorderUsers(newUsers));
  }

  return (
    <div
      className="overflow-x-auto w-full"
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements: {
            onDragStart: ({ active }) => `Picked up user ${active.id}`,
            onDragOver: ({ active, over }) =>
              over
                ? `Will place user ${active.id} before user ${over.id}`
                : `Dragging user ${active.id}`,
            onDragEnd: ({ active, over }) =>
              over
                ? `Placed user ${active.id} before user ${over.id}`
                : `Dropped user ${active.id} at its original position`,
            onDragCancel: ({ active, over }) =>
              `Cancelled dragging user ${active.id}`,
          },
        }}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {isTouchDevice
                  ? isIOS
                    ? "User (Drag handle only)"
                    : "User (Touch & Drag)"
                  : "User"}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Website
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <SortableContext
              items={items.map((user) => user.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((user) => (
                <UserItem key={user.id} user={user} isIOS={isIOS} />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}
