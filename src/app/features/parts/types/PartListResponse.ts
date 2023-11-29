import Part from './Part';

interface PartListReponse {
    items: Array<Part>;
    totalItemCount: number;
    hasError: boolean;
    message?: string | null;
}

export default PartListReponse;