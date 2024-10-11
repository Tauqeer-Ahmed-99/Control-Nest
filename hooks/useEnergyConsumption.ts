import useApiQuery from "./useApiQuery";
import { ApiResponse } from "@/utils/models";
import { ApiRoutes } from "@/routes/routes";

export interface EnergyConsumptionQueryParams {
  userId: string;
}

export interface EnergyConsumptionData {
  energy_consumption_watt_hours: number;
  start_date: string;
  end_date: string;
}

export type EnergyConsumptionResponse = ApiResponse<EnergyConsumptionData>;

const useEnergyConsumption = (
  searchParams: EnergyConsumptionQueryParams,
  queryConfig: { enabled: boolean },
) => {
  return useApiQuery<EnergyConsumptionResponse>(ApiRoutes.EnergyConsumption, {
    searchParams,
    queryConfig,
  });
};

export default useEnergyConsumption;
