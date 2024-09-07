import { ApiRoutes } from "@/routes/routes";
import useApiQuery from "./useApiQuery";
import { ApiResponse, HouseMember } from "./../utils/models";

export interface UserHouseMemeberSearchParams {
  userId: string;
}

export type UserHouseMemberResponse = ApiResponse<HouseMember>;

const useHouseMember = (searchParams: UserHouseMemeberSearchParams) => {
  return useApiQuery<UserHouseMemberResponse>(ApiRoutes.HouseMember, {
    searchParams,
  });
};

export default useHouseMember;
