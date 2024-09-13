import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "@/routes/routes";
import useApiQuery from "./useApiQuery";
import { ApiResponse, House } from "../utils/models";

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
  const { data } = useQuery<UserHouseResponse>({
    queryKey: [ApiRoutes.UserHouse],
  });

  return data?.data;
};

export const useRoomData = (roomId: string) => {
  const { data } = useQuery<UserHouseResponse>({
    queryKey: [ApiRoutes.UserHouse],
  });

  return data?.data?.rooms.find((room) => room.room_id === roomId);
};

export const useRoomsData = () => {
  const { data } = useQuery<UserHouseResponse>({
    queryKey: [ApiRoutes.UserHouse],
  });

  return data?.data.rooms;
};

export const useDeviceData = (roomId: string, deviceId: string) => {
  const { data } = useQuery<UserHouseResponse>({
    queryKey: [ApiRoutes.UserHouse],
  });

  return data?.data?.rooms
    ?.find((room) => room.room_id === roomId)
    ?.devices.find((device) => device.device_id === deviceId);
};

export const useDevicesData = () => {
  const { data } = useQuery<UserHouseResponse>({
    queryKey: [ApiRoutes.UserHouse],
  });

  return data?.data.rooms.flatMap((room) => room.devices);
};

export default useHouse;
