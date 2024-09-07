import useApiMutation from "./useApiMutation";
import { ApiRoutes } from "@/routes/routes";
import { ApiResponse } from "@/utils/models";

type AddedDevice = {
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
  deviceId: string;
  deviceName: string;
  pinNumber: number;
  status: boolean;
  isScheduled: boolean;
  daysScheduled: string | null;
  startTime: string | null;
  offTime: string | null;
  scheduledBy: string | null;
};

export type DeviceMutationResponse = ApiResponse<AddedDevice>;

const useAddDeviceMutation = () => {
  return useApiMutation<DeviceMutationResponse>(ApiRoutes.AddDevice);
};

export default useAddDeviceMutation;
