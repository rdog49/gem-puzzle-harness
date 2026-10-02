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

export default async function loadFirstBoardImage() {
  try {
    const listResponse = await fetch(LIST_URL);

    if (!listResponse.ok) {
      return null;
    }

    const imageId = firstImageId(await listResponse.json());

    if (imageId === null) {
      return null;
    }

    const fileResponse = await fetch(boardFileUrl(imageId));

    if (!fileResponse.ok) {
      return null;
    }

    const blob = await fileResponse.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    return null;
  }
}
