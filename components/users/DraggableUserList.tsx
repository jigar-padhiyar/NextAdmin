import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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

  // Update items when users prop changes
  if (JSON.stringify(users) !== JSON.stringify(items)) {
    setItems(users);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((user) => user.id === active.id);
        const newIndex = items.findIndex((user) => user.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update the global state
        dispatch(reorderUsers(newItems));

        return newItems;
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              User
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
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <SortableContext
            items={items.map((user) => user.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((user) => (
              <UserItem key={user.id} user={user} />
            ))}
          </SortableContext>
        </tbody>
      </table>
    </DndContext>
  );
}
