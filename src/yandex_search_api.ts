interface SearchParams {
  query: string;
  page_size: number;
  page_number: number;
}

interface SearchResult {
  rawData: string;
}

export async function yandexSearchApi(params: SearchParams): Promise<string> {
  const { query, page_size, page_number } = params;

  // Get config from server environment
  const key = process.env.YANDEX_API_KEY;
  if (!key) {
    throw new Error("Missing YANDEX_API_KEY");
  }
  const folderId = process.env.YANDEX_FOLDER_ID;
  if (!folderId) {
    throw new Error("Missing YANDEX_FOLDER_ID");
  }

  const body = {
    query: {
      searchType: "SEARCH_TYPE_COM",
      queryText: query,
      familyMode: "FAMILY_MODE_NONE",
      fixTypoMode: "FIX_TYPO_MODE_OFF",
    },
    groupSpec: {
      groupMode: "GROUP_MODE_FLAT",
      groupsOnPage: page_size,
    },
    maxPassages: 2,
    l10n: "LOCALIZATION_EN",
    folderId: folderId,
    page: page_number.toString(),
  };

  const response = await fetch(
    "https://searchapi.api.cloud.yandex.net/v2/web/search",
    {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Yandex Search API error: ${response.statusText}`);
  }

  const result: SearchResult = await response.json();
  return Buffer.from(result.rawData, "base64").toString("utf-8");
}
