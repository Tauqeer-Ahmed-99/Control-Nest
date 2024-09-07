import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";

type UpdatedRoom = boolean;

export type RoomMutationResponse = ApiResponse<UpdatedRoom>;

const useRoomDetailsMutation = () => {
  return useApiMutation<RoomMutationResponse>(ApiRoutes.UpdateRoom);
};

export default useRoomDetailsMutation;
