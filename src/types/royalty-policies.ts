import { CurrencyType } from "../gql/graphql";


export interface CreateRoyaltyRequestInput {
    ratePerStream: number;
    currency: CurrencyType;
    recordingPercentage: number;
    workPercentage: number;
}

export interface UpdateRoyaltyRequestInput {
    id: string;
    version: number;
    ratePerStream?: number;
    currency?: CurrencyType;
    recordingPercentage?: number;
    workPercentage?: number;
}