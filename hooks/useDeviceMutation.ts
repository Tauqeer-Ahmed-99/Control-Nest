import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";
import useApiMutation from "./useApiMutation";
import { HTTPMethod } from "@/utils/network";

export type DeviceMutationResponse = ApiResponse<string>;

const useDeviceMutation = () => {
  return useApiMutation<DeviceMutationResponse>(ApiRoutes.ConfigureDevice, {
    method: HTTPMethod.PUT,
  });
};

export default useDeviceMutation;
