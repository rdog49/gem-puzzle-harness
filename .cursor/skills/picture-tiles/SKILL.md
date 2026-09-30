---
name: picture-tiles
description: Gem Puzzle picture tiles through fetch, AbortController, and Promise.all. Use when implementing image tiles, thumbnails, loading, retry, or cancelling an image request.
---

# Picture tiles

The repository contains no picture files. The list and the images arrive over the network.

## Addresses

- List: `https://picsum.photos/v2/list?page=1&limit=12`
- Thumbnail: `https://picsum.photos/id/{id}/180/180`
- Board: `https://picsum.photos/id/{id}/800/800`

Both requests use `fetch` with `async/await`. Read the board response as a blob and show it through an object URL. Do not slice the picture only with an `img` `onload` handler.

## Board

An occupied cell shows its fragment of the selected picture. The empty cell stays empty. Moves, the counter, and the win behave as they do for numbered tiles.

Panel identifiers: `#image-panel`, `#image-loader`, `#image-error`, `#retry-image`, `#thumbs`. Copy the texts from `TASK.md`.

## Loading and error

While the list request or the file request is unfinished, `#image-loader` is visible. After it settles, the loader is hidden.

On failure, `#image-error` and `#retry-image` are visible and the tiles return to numbers. Retry repeats the request that failed.

## Cancellation

The list request and the file request each have their own `AbortController`. A new choice aborts the previous unfinished request with `abort()`. The board shows the latest selected picture, not a response that arrives after a cancelled one.

Do not show `AbortError` as a load error.

## Previews

Take at least three list items and load them with one `Promise.all`. Draw the previews in `#thumbs`. A click on a preview puts that picture on the board and aborts a previous file load when one is still in flight.
