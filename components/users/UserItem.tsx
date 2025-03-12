import { User } from "@/state/store/feature/userSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UserItemProps {
  user: User;
}

export default function UserItem({ user }: UserItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: user.id, resizeObserverConfig: {} });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-move"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div {...listeners} className="mr-2 cursor-grab">
            ⋮⋮
          </div>
          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              @{user.username}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {user.company.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 dark:text-primary-400">
        {user.website}
      </td>
    </tr>
  );
}
