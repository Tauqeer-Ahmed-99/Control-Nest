import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";

type HouseMember = {
  house_id: string;
  user_id: string;
};

export type HouseLoginResponse = ApiResponse<HouseMember>;

const useHouseLogin = () => {
  return useApiMutation<HouseLoginResponse>(ApiRoutes.HouseLogin, {});
};

export default useHouseLogin;
