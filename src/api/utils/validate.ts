import { MAX_QUERY_SIZE } from "./config";

export function validatePaginationParams(
    after: string | undefined,
    before: string | undefined,
    limit: string | undefined
): string | null {
    if (after && before) return "Cannot specify both 'after' and 'before' cursor parameters";
    if (limit === undefined) return null;
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit)) return "Limit must be a valid number";
    if (parsedLimit > MAX_QUERY_SIZE) return `Limit cannot exceed ${MAX_QUERY_SIZE}`;
    if (parsedLimit < 1) return "Limit must be at least 1";
    return null;
}

export type SortField = "date" | "asset" | "activity" | "nomVal";
export type SortOrder = "asc" | "desc";

export function validateSortParams(
    sortBy: string | undefined,
    sortOrder: string | undefined
): string | null {
    if (sortBy !== undefined) {
        const validSortFields: SortField[] = ["date", "asset", "activity", "nomVal"];
        if (!validSortFields.includes(sortBy as SortField)) {
            return "sortBy must be one of: date, asset, activity, nomVal";
        }
    }
    if (sortOrder !== undefined) {
        if (sortOrder !== "asc" && sortOrder !== "desc") {
            return "sortOrder must be 'asc' or 'desc'";
        }
    }
    return null;
}
