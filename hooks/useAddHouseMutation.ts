import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";
import { ApiResponse, House } from "@/utils/models";

export type HouseMutationResponse = ApiResponse<House>;

const useAddHouseMutation = () => {
  return useApiMutation<HouseMutationResponse>(ApiRoutes.AddHouses);
};

export default useAddHouseMutation;
