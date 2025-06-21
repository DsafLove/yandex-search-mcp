#!/usr/bin/env node
import { yandexSearchApi } from '../src/yandex_search_api.ts';
import { parseSearchResponse } from '../src/parser.ts';

(async () => {
  try {
    const testQuery = "test search";
    const xml = await yandexSearchApi({
      query: testQuery,
      page_size: 5,
      page_number: 0
    });

    console.log("Parsing Yandex Search API results...");
    const results = await parseSearchResponse(xml);

    console.log("\nParsed Results:");
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Error testing parser:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
