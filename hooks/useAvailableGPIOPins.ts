import { ApiRoutes } from "@/routes/routes";
import useApiQuery from "./useApiQuery";
import { ApiResponse, HeaderPinConfig } from "./../utils/models";

export interface AvailableGPIOPinsSearchParams {
  userId: string;
}

export type AvailableGPIOPinsResponse = ApiResponse<HeaderPinConfig[]>;

const useAvailableGPIOPins = (searchParams: AvailableGPIOPinsSearchParams) => {
  return useApiQuery<AvailableGPIOPinsResponse>(ApiRoutes.AvailableGPIOPins, {
    searchParams,
  });
};

export default useAvailableGPIOPins;
