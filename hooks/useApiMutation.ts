import request, { ApiConfig, HTTPMethod } from "@/utils/network";
import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";
import useMobileStorageData from "./useMobileStorageData";

const useApiMutation = <T>(
  url: string,
  config?: ApiConfig,
  options?: UseMutationOptions<T, Error, unknown, unknown>,
): UseMutationResult<T, Error> => {
  const { data: controllerDeviceUrl } = useMobileStorageData(
    "controller-device-url",
  );
  const baseUrl = controllerDeviceUrl as string;
  return useMutation({
    mutationKey: [url],
    mutationFn: async (body) => {
      const response = await request(baseUrl, url, {
        method: HTTPMethod.POST,
        ...config,
        body: body as any,
        searchParams: { ...(body as any).searchParams },
      });

      if (!response.ok) {
        const parsedRes = await response.json();
        throw new Error(
          response.status + " : " + parsedRes.message ?? response.statusText,
        );
      }

      return response.json();
    },
    ...options,
  });
};

export default useApiMutation;
