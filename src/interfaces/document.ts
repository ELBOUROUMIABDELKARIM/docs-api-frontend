

export interface Metadata {
    id: string;
    key: string;
    value: string;
}
export interface DocumentResponse{
    id: string;
    name: string;
    type: string;
    size: number;
    owner: string;
    dateCreation: string;
    dateModification: string;
    permissions: any[];
    metaData: Metadata[];
}