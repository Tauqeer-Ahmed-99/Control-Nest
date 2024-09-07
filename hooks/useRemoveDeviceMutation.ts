import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";
import { HTTPMethod } from "@/utils/network";

export type DeviceMutationResponse = ApiResponse<string>;

const useRemoveDeviceMutation = () => {
  return useApiMutation<DeviceMutationResponse>(ApiRoutes.RemoveDevice, {
    method: HTTPMethod.DELETE,
  });
};

export default useRemoveDeviceMutation;
