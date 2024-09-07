import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";

type UpdatedHouse = {
  houseId: string;
  houseName: string;
};

export type HouseMutationResponse = ApiResponse<UpdatedHouse>;

const useHouseDetailsMutation = () => {
  return useApiMutation<HouseMutationResponse>(ApiRoutes.UpdateHouse);
};

export default useHouseDetailsMutation;
