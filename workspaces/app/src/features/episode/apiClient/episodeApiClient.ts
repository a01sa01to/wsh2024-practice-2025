import { inject } from 'regexparam';

import type { GetEpisodeListRequestQuery } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListRequestQuery';
import type { GetEpisodeListResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListResponse';
import type { GetEpisodeRequestParams } from '@wsh-2024/schema/src/api/episodes/GetEpisodeRequestParams';
import type { GetEpisodeResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeResponse';

import type { DomainSpecificApiClientInterface } from '../../../lib/api/DomainSpecificApiClientInterface';
import { apiClient } from '../../../lib/api/apiClient';

type EpisodeApiClient = DomainSpecificApiClientInterface<{
  fetch: [{ params: GetEpisodeRequestParams }, GetEpisodeResponse];
  fetchList: [{ query: GetEpisodeListRequestQuery }, GetEpisodeListResponse];
}>;

export const episodeApiClient: EpisodeApiClient = {
  fetch: async ({ params }) => {
    const response = await apiClient.get(inject('/api/v1/episodes/:episodeId', params)).json<GetEpisodeResponse>();
    return response;
  },
  fetch$$key: (options) => ({
    requestUrl: `/api/v1/episodes/:episodeId`,
    ...options,
  }),
  fetchList: async ({ query }) => {
    const response = await apiClient
      .get(inject('/api/v1/episodes', {}), {
        searchParams: query,
      })
      .json<GetEpisodeListResponse>();
    return response;
  },
  fetchList$$key: (options) => ({
    requestUrl: `/api/v1/episodes`,
    ...options,
  }),
};
