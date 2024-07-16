import { PagedData } from "../../../../components/filter/types/pagedData"
import Part from "../../../parts/types/Part"


interface PartGraphQLResponsePagedItems extends PagedData<Part> {
}

interface PartGraphQLResponsePagedData {
    parts?: PartGraphQLResponsePagedItems | null
}

interface PartGraphQLResponsePaged {
    data?: PartGraphQLResponsePagedData
}

export {
    PartGraphQLResponsePagedItems,
    PartGraphQLResponsePagedData,
    PartGraphQLResponsePaged
}