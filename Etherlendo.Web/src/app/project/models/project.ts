export class Project {
    id: string;
    name: string;
    description: string;
    image: string;
    started?: boolean;
    contractAddress?: string;
    total?: number;
    interest?: number;
    fundingEndsAt?: Date;
    investedAmount?: number;
}