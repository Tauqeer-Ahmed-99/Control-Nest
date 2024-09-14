import { UseQueryResult, useQuery } from "@tanstack/react-query";
import request, { ApiConfig, ExpectedHTTPStatuses } from "@/utils/network";
import useMobileStorageData from "./useMobileStorageData";

const useApiQuery = <T>(
  url: string,
  config: ApiConfig,
): UseQueryResult<T, Error> => {
  const { data: controllerDeviceUrl } = useMobileStorageData(
    "controller-device-url",
  );
  const baseUrl = controllerDeviceUrl as string;
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await request(baseUrl, url, config);

      if (!response.ok && !ExpectedHTTPStatuses.includes(response.status)) {
        const parsedRes = await response.json();
        throw new Error(
          response.status + " : " + parsedRes.message ?? response.statusText,
        );
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
};

export default useApiQuery;
