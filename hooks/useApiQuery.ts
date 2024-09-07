import { UseQueryResult, useQuery } from "@tanstack/react-query";
import request, { ApiConfig, ExpectedHTTPStatuses } from "@/utils/network";

const useApiQuery = <T>(
  url: string,
  config: ApiConfig,
): UseQueryResult<T, Error> => {
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await request(url, config);

      if (!response.ok && !ExpectedHTTPStatuses.includes(response.status)) {
        const parsedRes = await response.json();
        throw new Error(
          response.status + " : " + parsedRes.message ?? response.statusText,
        );
      }

      return response.json();
    },
  });
};

export default useApiQuery;
