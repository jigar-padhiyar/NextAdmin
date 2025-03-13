import { User } from "@/state/store/feature/userSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UserItemProps {
  user: User;
  isIOS?: boolean;
}

export default function UserItem({ user, isIOS = false }: UserItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: user.id,
      resizeObserverConfig: {},
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // For iOS, only apply touchAction: "none" to the drag handle, not the entire row
    // This allows normal scrolling on the rest of the row
    ...(isIOS ? {} : { touchAction: "none" }),
    WebkitUserSelect: "none" as const, // Prevent text selection during drag
    userSelect: "none" as const, // Prevent text selection during drag
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      // Only apply attributes to the row for non-iOS devices
      // For iOS, attributes will only be on the drag handle
      {...(isIOS ? {} : attributes)}
      // Remove cursor-move on iOS to prevent accidental drag attempts
      className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
        isIOS ? "" : "cursor-move"
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div
            {...listeners}
            {...(isIOS ? attributes : {})} // Apply attributes only to the handle on iOS
            className="mr-2 cursor-grab active:cursor-grabbing p-3 touch-manipulation text-gray-600 dark:text-white "
            style={{
              touchAction: "none", // Ensure touch events are captured on the handle
              WebkitTouchCallout: "none", // Prevent iOS touch callout
              // Make the drag handle more prominent on iOS
              ...(isIOS
                ? {
                    background: "none",
                  }
                : {}),
            }}
          >
            {/* Larger, more visible drag handle for iOS */}
            {isIOS ? "≡" : "⋮⋮"}
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
