const LIST_URL = 'https://picsum.photos/v2/list?page=1&limit=12';

function boardFileUrl(id) {
  return `https://picsum.photos/id/${id}/800/800`;
}

function firstImageId(list) {
  if (!Array.isArray(list)) {
    return null;
  }

  const first = list.find((item) => item && item.id !== undefined && item.id !== null);
  return first ? first.id : null;
}

function listFailure() {
  return { ok: false, stage: 'list' };
}

function fileFailure(id) {
  return { ok: false, stage: 'file', id };
}

async function fetchImageId() {
  const listResponse = await fetch(LIST_URL);

  if (!listResponse.ok) {
    return null;
  }

  return firstImageId(await listResponse.json());
}

async function fetchBoardFile(imageId) {
  const fileResponse = await fetch(boardFileUrl(imageId));

  if (!fileResponse.ok) {
    return null;
  }

  const blob = await fileResponse.blob();
  return URL.createObjectURL(blob);
}

export default async function loadBoardImage(failed) {
  const savedId = failed && failed.stage === 'file' && failed.id != null
    ? failed.id
    : null;
  let imageId = savedId;

  if (imageId === null) {
    try {
      imageId = await fetchImageId();
    } catch (error) {
      return listFailure();
    }

    if (imageId === null) {
      return listFailure();
    }
  }

  try {
    const url = await fetchBoardFile(imageId);

    if (!url) {
      return fileFailure(imageId);
    }

    return { ok: true, url };
  } catch (error) {
    return fileFailure(imageId);
  }
}
