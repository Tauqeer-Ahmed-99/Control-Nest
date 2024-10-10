import { UseQueryResult, useQuery } from "@tanstack/react-query";
import request, {
  ApiConfig,
  ExpectedHTTPStatuses,
  HTTPStatus,
} from "@/utils/network";
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
        let errorMessage =
          response.status + " : " + (parsedRes.message ?? response.statusText);
        if (response.status === HTTPStatus.UnprocessableEntity) {
          errorMessage = `${parsedRes?.detail?.[0]?.msg ?? response.status} : ${
            parsedRes?.detail?.[0]?.loc?.[1] ?? response.statusText
          }`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
};

export default useApiQuery;
