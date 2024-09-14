import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";
import { HTTPMethod } from "@/utils/network";
import useApiMutation from "./useApiMutation";

export type SwitchDeviceMutationResponse = ApiResponse<string>;

const useSwitchDeviceMutation = () => {
  return useApiMutation<SwitchDeviceMutationResponse>(ApiRoutes.SwitchDevice, {
    method: HTTPMethod.PATCH,
  });
};

export default useSwitchDeviceMutation;
