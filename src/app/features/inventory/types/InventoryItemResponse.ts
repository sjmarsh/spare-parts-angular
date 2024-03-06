import InventoryItem from "./InventoryItem";

interface InventoryItemResponse {
    value?: InventoryItem | null;
    hasError: boolean;
    message?: string | null;
}

export default InventoryItemResponse;