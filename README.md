https://yandex.cloud/ru/docs/search-api/quickstart/
https://yandex.cloud/ru/docs/iam/operations/authentication/manage-api-keys#create-api-key
https://yandex.cloud/ru/docs/resource-manager/operations/folder/get-id

```json
"mcpServers": {
    "yandex-search-mcp": {
         "command": "node",
         "args": [
              "<REPO_ROOT>/yandex-search-mcp/src/index.ts"
          ],
         "env": {
             "YANDEX_API_KEY": "",
             "YANDEX_FOLDER_ID": ""
         }
    }
}
```
