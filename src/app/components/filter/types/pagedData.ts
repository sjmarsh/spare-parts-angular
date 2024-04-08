interface PageInfo {
    hasNextPage: boolean
}

interface PagedData<T> {
    items: Array<T>;
    pageInfo: PageInfo;
    totalCount: number;
    error?: string | null;
}

export {
    PageInfo,
    PagedData
}

