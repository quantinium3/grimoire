import { writeFile } from "fs/promises";
import type { SearchIndex } from "./consts";
import path from "path";
import { readFile } from "fs/promises";

export const searchIndexJson = async (HashMap: Map<string, string>): Promise<void> => {
    const SearchIndexData: SearchIndex[] = [];
    for (const [key, val] of HashMap.entries()) {
        console.log(val)
        SearchIndexData.push({ url: val, content: await readFile(path.join('content', val.replace('.html', '.md')), "utf-8") })
    }
    await writeFile(path.join("dist", "search-index.json"), JSON.stringify(SearchIndexData))
}

