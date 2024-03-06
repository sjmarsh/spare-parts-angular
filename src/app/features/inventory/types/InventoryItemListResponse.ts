import InventoryItem from "./InventoryItem";

interface InventoryItemListResponse {
    items: Array<InventoryItem>;
    totalItemCount: number;
    hasError: boolean;
    message?: string | null;
}

export default InventoryItemListResponse