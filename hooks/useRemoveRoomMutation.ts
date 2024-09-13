import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";
import { HTTPMethod } from "@/utils/network";

export type RoomMutationResponse = ApiResponse<string>;

const useRemoveRoomMutation = () => {
  return useApiMutation<RoomMutationResponse>(ApiRoutes.RemoveRoom, {
    method: HTTPMethod.DELETE,
  });
};

export default useRemoveRoomMutation;
