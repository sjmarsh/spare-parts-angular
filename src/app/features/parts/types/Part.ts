import PartAttribute from "./PartAttribute";
import PartCategory from "./PartCategory";

interface Part {
    id: number;
    name: string;
    description: string;
    category: PartCategory | null;
    weight: number; 
    price: number;
    startDate: string;
    endDate?: string | null;
    attributes?: Array<PartAttribute>;
}

export default Part;