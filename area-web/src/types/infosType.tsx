
export interface ActionInfosItem {
    name: string;
    id: string;
    service: string;
    serviceId: number;
    additionalFields?: {};
    color: string;
}
export interface InfosItem {
    name: string;
    id: number;
    description: string;
    color: string;
    public: boolean;
    serviceAId: number;
    serviceRId: number;
    action: ActionInfosItem;
    reaction: ActionInfosItem;
    user : string;
    isSubscribed: boolean;
}
