import request, { ApiConfig, HTTPMethod } from "@/utils/network";
import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "@tanstack/react-query";

const useApiMutation = <T>(
  url: string,
  config?: ApiConfig,
  options?: UseMutationOptions<T, Error, unknown, unknown>,
): UseMutationResult<T, Error> => {
  return useMutation({
    mutationKey: [url],
    mutationFn: async (body) => {
      const response = await request(url, {
        method: HTTPMethod.POST,
        ...config,
        body: body as any,
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
