import { ProjectState } from "./project-state";

export class Project {
    id: string;
    name: string;
    description: string;
    image: string;
    started?: boolean;
    state?: ProjectState;
    contractAddress?: string;
    total?: number;
    interest?: number;
    fundingEndsAt?: Date;
    investedAmount?: number;
    investedPercentage?: number;
}