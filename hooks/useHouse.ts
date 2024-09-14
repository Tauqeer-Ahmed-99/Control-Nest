import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiRoutes } from "@/routes/routes";
import useApiQuery from "./useApiQuery";
import { ApiResponse, House } from "../utils/models";
import useAuth from "./useAuth";

export interface UserHouseSearchParams {
  userId: string;
}

export type UserHouseResponse = ApiResponse<House>;

const useHouse = (searchParams: UserHouseSearchParams) => {
  return useApiQuery<UserHouseResponse>(ApiRoutes.UserHouse, {
    searchParams,
  });
};

export const useHouseData = () => {
  const { userProfile } = useAuth();
  const { data } = useHouse({ userId: userProfile?.id as string });

  return data?.data;
};

export const useRoomData = (roomId: string) => {
  const { userProfile } = useAuth();
  const { data } = useHouse({ userId: userProfile?.id as string });

  return data?.data?.rooms.find((room) => room.room_id === roomId);
};

export const useRoomsData = () => {
  const { userProfile } = useAuth();
  const { data } = useHouse({ userId: userProfile?.id as string });

  return data?.data.rooms;
};

export const useDeviceData = (roomId: string, deviceId: string | "default") => {
  const { userProfile } = useAuth();
  const { data } = useHouse({ userId: userProfile?.id as string });

  const devices = data?.data?.rooms?.find(
    (room) => room.room_id === roomId,
  )?.devices;

  if (deviceId === "default") {
    return devices?.find((device) => device.is_default) ?? devices?.[0];
  }

  return devices?.find((device) => device.device_id === deviceId);
};

export const useDevicesData = () => {
  const { userProfile } = useAuth();
  const { data } = useHouse({ userId: userProfile?.id as string });

  return data?.data.rooms.flatMap((room) => room.devices);
};

export default useHouse;
