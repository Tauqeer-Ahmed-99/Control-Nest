import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";

type DeletedRoom = {
  houseId: string;
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
  roomName: string | null;
};

export type RoomMutationResponse = ApiResponse<DeletedRoom>;

const useRemoveRoomMutation = () => {
  return useApiMutation<RoomMutationResponse>(ApiRoutes.RemoveRoom, {
    method: "DELETE",
  });
};

export default useRemoveRoomMutation;
