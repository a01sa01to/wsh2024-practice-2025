import { inject } from 'regexparam';

import type { GetFeatureListRequestQuery } from '@wsh-2024/schema/src/api/features/GetFeatureListRequestQuery';
import type { GetFeatureListResponse } from '@wsh-2024/schema/src/api/features/GetFeatureListResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type FeatureApiClient = DomainSpecificApiClientInterface<{
  fetchList: [{ query: GetFeatureListRequestQuery }, GetFeatureListResponse];
}>;

export const featureApiClient: FeatureApiClient = {
  fetchList: async ({ query }) => {
    const response = await apiClient
      .get(inject('/api/v1/features', {}), {
        searchParams: query,
      })
      .json<GetFeatureListResponse>();
    return response;
  },
  fetchList$$key: (options) => ({
    requestUrl: `/api/v1/features`,
    ...options,
  }),
};
