```mermaid
sequenceDiagram
  participant browser
  participant server

  browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
  activate server

  Note right of server: Server saves the new note

  server-->>browser: 201 Created
  deactivate the server

  Note right of browser: JavaScript adds the new note to the page without reloading the page
``` 
