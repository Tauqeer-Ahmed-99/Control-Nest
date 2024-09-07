import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";

type CreatedRoom = {
  houseId: string;
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
  roomName: string | null;
};

export type RoomMutationResponse = ApiResponse<CreatedRoom>;

const useAddRoomMutation = () => {
  return useApiMutation<RoomMutationResponse>(ApiRoutes.AddRoom);
};

export default useAddRoomMutation;
