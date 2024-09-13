import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";

type CreatedRoom = {
  room_id: string;
  room_name: string;
  house_id: string;
  created_at: string;
  updated_at: string;
  devices: [];
};

export type RoomMutationResponse = ApiResponse<CreatedRoom>;

const useAddRoomMutation = () => {
  return useApiMutation<RoomMutationResponse>(ApiRoutes.AddRoom);
};

export default useAddRoomMutation;
