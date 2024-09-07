import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";

type HouseMember = {
  houseId: string;
  userId: string;
};

export type HouseMutationResponse = ApiResponse<HouseMember>;

const useRemoveHouseMutation = () => {
  return useApiMutation<HouseMutationResponse>(ApiRoutes.RemoveHouse, {
    method: "DELETE",
  });
};

export default useRemoveHouseMutation;
