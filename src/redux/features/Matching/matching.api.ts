import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface IMatchQuery {
    lat: number;
    lng: number;
    maxRadiusKm?: number;
    limit?: number;
    maxStaleSeconds?: number;
}

export interface IMatchCandidate {
    driverId: string;
    userId: string;
    name?: string;
    distanceKm: number;
    rating: number;
    experience: number;
    secondsSinceUpdate: number;
    score: number;
    factors: {
        distance: number;
        rating: number;
        experience: number;
        recency: number;
    };
}

export const matchingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMatchCandidates: builder.mutation<IMatchCandidate[], IMatchQuery>({
            query: (data) => ({
                url: "/matching/candidates",
                method: "POST",
                data,
            }),
            transformResponse: (response: IResponse<IMatchCandidate[]>) => response.data,
        }),
        getBestMatch: builder.mutation<IMatchCandidate | null, IMatchQuery>({
            query: (data) => ({
                url: "/matching/best",
                method: "POST",
                data,
            }),
            transformResponse: (response: IResponse<IMatchCandidate | null>) => response.data,
        }),
    }),
});

export const {
    useGetMatchCandidatesMutation,
    useGetBestMatchMutation,
} = matchingApi;
