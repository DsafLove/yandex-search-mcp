import { parseSearchResponse } from "../src/parser.ts";
import { assert } from "chai";

describe("Search Response Parser", () => {
  it("should handle missing fields", async () => {
    const sampleXml = `<yandexsearch>
      <response>
        <results>
          <grouping>
            <group>
              <doc>
              </doc>
            </group>
          </grouping>
        </results>
      </response>
    </yandexsearch>`;

    const results = await parseSearchResponse(sampleXml);
    assert.isUndefined(results[0]?.url);
    assert.isUndefined(results[0]?.title);
    assert.isUndefined(results[0]?.snippet);
    assert.isUndefined(results[0]?.savedCopyUrl);
  });

  it("should parse url field", async () => {
    const sampleXml = `<yandexsearch>
      <response>
        <results>
          <grouping>
            <group>
              <doc>
                <url>https://example.com/123</url>
              </doc>
            </group>
          </grouping>
        </results>
      </response>
    </yandexsearch>`;

    const results = await parseSearchResponse(sampleXml);
    assert.equal(results[0]?.url, "https://example.com/123");
  });

  it("should parse title field", async () => {
    const sampleXml = `<yandexsearch>
      <response>
        <results>
          <grouping>
            <group>
              <doc>
                <title>Example title</title>
              </doc>
            </group>
          </grouping>
        </results>
      </response>
    </yandexsearch>`;

    const results = await parseSearchResponse(sampleXml);
    assert.equal(results[0]?.title, "Example title");
  });

  it("should parse saved-copy-url field", async () => {
    const sampleXml = `<yandexsearch>
      <response>
        <results>
          <grouping>
            <group>
              <doc>
                <saved-copy-url>https://archive.example.com/123</saved-copy-url>
              </doc>
            </group>
          </grouping>
        </results>
      </response>
    </yandexsearch>`;

    const results = await parseSearchResponse(sampleXml);
    assert.equal(results[0]?.savedCopyUrl, "https://archive.example.com/123");
  });

  it("should join multiple plain text passages with newlines", async () => {
    const sampleXml = `<yandexsearch>
      <response>
        <results>
          <grouping>
            <group>
              <doc>
                <url>https://example.com</url>
                <passages>
                  <passage>First snippet</passage>
                  <passage>Second snippet</passage>
                </passages>
              </doc>
            </group>
          </grouping>
        </results>
      </response>
    </yandexsearch>`;

    const results = await parseSearchResponse(sampleXml);
    assert.equal(results[0]?.snippet, "First snippet\nSecond snippet");
  });

  it("should preserve tags in passages", async () => {
    const sampleXml = `<yandexsearch>
      <response>
        <results>
          <grouping>
            <group>
              <doc>
                <url>https://example.com</url>
                <passages>
                  <passage><b>Bold</b> text</passage>
                  <passage><i>Italic</i> text</passage>
                </passages>
              </doc>
            </group>
          </grouping>
        </results>
      </response>
    </yandexsearch>`;

    const results = await parseSearchResponse(sampleXml);
    assert.equal(results[0]?.snippet, "<b>Bold</b> text\n<i>Italic</i> text");
  });
});
