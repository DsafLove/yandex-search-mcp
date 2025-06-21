import { parseString } from "xml2js";

export interface SearchResult {
  url?: string;
  title?: string;
  snippet?: string;
  savedCopyUrl?: string;
}

export const parseOptions = {
  explicitChildren: true,
  preserveChildrenOrder: true,
  charsAsChildren: true,
  explicitRoot: false,
  includeWhiteChars: false,
  trim: false,
};

export async function parseSearchResponse(
  xml: string
): Promise<SearchResult[]> {
  return new Promise((resolve, reject) => {
    parseString(xml, parseOptions, (err, result) => {
      if (err) {
        return reject(err);
      }

      try {
        console.assert(result["#name"] === "yandexsearch", xml);

        const response: any = result.$$.find(
          (child: any) => child["#name"] === "response"
        );

        const results: any = response.$$.find(
          (child: any) => child["#name"] === "results"
        );

        const grouping: any = results.$$.find(
          (child: any) => child["#name"] === "grouping"
        );

        const searchResults = grouping.$$.filter(
          (child: any) => child["#name"] === "group"
        ).map((group: any) => {
          const doc = group.$$.find((child: any) => child["#name"] === "doc");
          if (!doc?.$$)
            return {
              url: undefined,
              title: undefined,
              snippet: undefined,
              savedCopyUrl: undefined,
            };

          const urlChild = doc.$$.find(
            (child: any) => child["#name"] === "url"
          );
          const titleChild = doc.$$.find(
            (child: any) => child["#name"] === "title"
          );
          const savedCopyUrlChild = doc.$$.find(
            (child: any) => child["#name"] === "saved-copy-url"
          );
          const passagesChild = doc.$$.find(
            (child: any) => child["#name"] === "passages"
          );

          let passages = passagesChild?.$$?.filter(
            (child: any) => child["#name"] === "passage"
          )
            .map((passage: any) => convertXmlTagToText(passage))
            .join("\n");

          return {
            url: urlChild?._,
            title: titleChild?._,
            snippet: passages,
            savedCopyUrl: savedCopyUrlChild?._,
          };
        });
        resolve(searchResults);
      } catch (error) {
        reject(new Error("Failed to parse search results: " + error));
      }
    });
  });
}

/**
 * Converts an XML tag parsed by xml2js to its textual representation
 * while preserving any nested tags in the content
 * @param tag The parsed XML tag object from xml2js
 * @returns String representation with preserved tags
 */
export function convertXmlTagToText(tag: any): string {
  let result = "";
  for (const child of tag.$$) {
    const name = child["#name"];
    if (name === "__text__") {
      // Handle text nodes between tags
      result += child._;
    } else {
      // Handle element nodes
      result += `<${name}>`;
      result += convertXmlTagToText(child);
      result += `</${name}>`;
    }
  }
  return result;
}
