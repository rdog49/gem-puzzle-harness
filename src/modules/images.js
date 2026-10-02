const LIST_URL = 'https://picsum.photos/v2/list?page=1&limit=12';
const PREVIEW_COUNT = 3;

let listController = null;
let fileController = null;

function boardFileUrl(id) {
  return `https://picsum.photos/id/${id}/800/800`;
}

function thumbUrl(id) {
  return `https://picsum.photos/id/${id}/180/180`;
}

function isAbortError(error) {
  return error && error.name === 'AbortError';
}

function abortedResult() {
  return { ok: false, aborted: true };
}

function listFailure() {
  return { ok: false, stage: 'list' };
}

function fileFailure(id) {
  return { ok: false, stage: 'file', id };
}

function beginRequest(current) {
  if (current) {
    current.abort();
  }

  return new AbortController();
}

function revokeUrls(urls) {
  urls.forEach((url) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
}

function imageIds(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .filter((item) => item && item.id !== undefined && item.id !== null)
    .map((item) => item.id);
}

async function fetchBlobUrl(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function loadPreviews() {
  listController = beginRequest(listController);
  const { signal } = listController;
  const created = [];

  try {
    const listResponse = await fetch(LIST_URL, { signal });

    if (!listResponse.ok) {
      return listFailure();
    }

    const ids = imageIds(await listResponse.json()).slice(0, PREVIEW_COUNT);

    if (ids.length < PREVIEW_COUNT) {
      return listFailure();
    }

    const previews = await Promise.all(ids.map(async (id) => {
      const url = await fetchBlobUrl(thumbUrl(id), signal);

      if (url) {
        created.push(url);
      }

      return { id, url };
    }));

    if (signal.aborted) {
      revokeUrls(created);
      return abortedResult();
    }

    if (previews.some((preview) => !preview.url)) {
      revokeUrls(created);
      return listFailure();
    }

    return { ok: true, previews };
  } catch (error) {
    revokeUrls(created);

    if (isAbortError(error)) {
      return abortedResult();
    }

    return listFailure();
  }
}

export async function loadBoardImage(imageId) {
  fileController = beginRequest(fileController);
  const { signal } = fileController;

  try {
    const url = await fetchBlobUrl(boardFileUrl(imageId), signal);

    if (signal.aborted) {
      revokeUrls([url]);
      return abortedResult();
    }

    if (!url) {
      return fileFailure(imageId);
    }

    return { ok: true, url, id: imageId };
  } catch (error) {
    if (isAbortError(error)) {
      return abortedResult();
    }

    return fileFailure(imageId);
  }
}
