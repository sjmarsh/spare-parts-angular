import Part from './Part';

interface PartResponse {
    value: Part;
    hasError: boolean;
    message?: string | null;
}

export default PartResponse