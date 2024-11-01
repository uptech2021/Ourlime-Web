import { Avatar, Button } from "@nextui-org/react";
import { Follower, Following } from "@/types/global";
import { X, UserX } from "lucide-react";

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Follower[] | Following[];
  type: 'followers' | 'following';
}

const FollowModal = ({ isOpen, onClose, data, type }: FollowModalProps) => {
  if (!isOpen) return null;

  const getEmptyStateMessage = () => {
    if (type === 'followers') {
      return "You don't have any followers yet";
    }
    return "You haven't followed anyone yet";
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-xl shadow-lg z-50 p-4">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold capitalize">{type}</h2>
          <Button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <Avatar
                  src={item.profilePicture}
                  alt={item.username}
                  className="h-10 w-10"
                />
                <div>
                  <p className="font-semibold">{item.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <UserX className="h-12 w-12 mb-2" />
              <p>{getEmptyStateMessage()}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FollowModal; 