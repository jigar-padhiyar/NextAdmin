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
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppDispatch } from "@/state/store/hook";
import { reorderUsers } from "@/state/store/feature/userSlice";
import { User } from "@/state/store/feature/userSlice";
import UserItem from "./UserItem";

interface DraggableUserListProps {
  users: User[];
}

export default function DraggableUserList({ users }: DraggableUserListProps) {
  const [items, setItems] = useState(users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (JSON.stringify(users) !== JSON.stringify(items)) {
      setItems(users);
    }
  }, [users, items]);

  // Detect if we're on a touch device (most likely Android)
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Detect iOS specifically
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  // Configure sensors based on device type
  const sensors = useSensors(
    // Use MouseSensor for non-touch environments
    useSensor(MouseSensor, {
      // Prevent accidental drag with a small distance constraint
      activationConstraint: {
        distance: 10,
      },
    }),
    // Optimized TouchSensor configuration with higher constraints for iOS
    useSensor(TouchSensor, {
      // Important: Increase delay on iOS to allow scrolling to work properly
      activationConstraint: {
        // Use different constraints for iOS vs Android
        delay: isIOS ? 300 : 200,
        // More tolerance on iOS to better distinguish scrolling from dragging
        tolerance: isIOS ? 15 : 8,
        // Add distance constraint for iOS to further improve scroll detection
        distance: isIOS ? 15 : undefined,
      },
    }),
    // Keep PointerSensor with larger distance constraint to distinguish from scrolling
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isIOS ? 15 : 10,
      },
    }),
    // Keep keyboard navigation support
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(
          (user) => user.id === active.id
        );
        const newIndex = currentItems.findIndex((user) => user.id === over.id);

        const newItems = arrayMove(currentItems, oldIndex, newIndex);

        // Update the global state
        dispatch(reorderUsers(newItems));

        return newItems;
      });
    }
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
        modifiers={[]}
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
