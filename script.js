let fetchedVideos = [];

const fetchAndRenderVideos = async () => {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.statusCode === 200 && result?.data?.data) {
      fetchedVideos = result.data.data;
      renderYouTubeVideos(fetchedVideos);
      return;
    }
    console.error("Something went wrong while fetching.");
  } catch (error) {
    console.error("Error fetching/rendering videos:", error);
  }
};

const renderYouTubeVideos = (videos) => {
  const videoContainer = document.getElementById(VIDEO_CONTAINER_ID);

  videoContainer.innerHTML = "";

  videos.forEach((video) => {
    const videoCard = createVideoCard(video);
    videoContainer.appendChild(videoCard);
  });
};

const createVideoCard = (video) => {
  const videoItem = video.items;
  const snippet = videoItem.snippet;
  const statistics = videoItem.statistics;

  const videoCard = document.createElement("div");
  videoCard.classList.add(...VIDEO_CARD_STYLE_CLASSES);

  const thumbnail = createThumbnail(snippet, videoItem.id);
  videoCard.appendChild(thumbnail);

  const videoDetails = createVideoDetails(snippet, statistics);
  videoCard.appendChild(videoDetails);

  return videoCard;
};

const createThumbnail = (snippet, videoId) => {
  const thumbnail = document.createElement("img");
  thumbnail.src = snippet.thumbnails.high.url;
  thumbnail.alt = snippet.title;
  thumbnail.classList.add(...THUMBNAIL_STYLE_CLASSES);

  thumbnail.onclick = () =>
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");

  return thumbnail;
};

const createVideoDetails = (snippet, statistics) => {
  const videoDetails = document.createElement("div");
  videoDetails.classList.add(...VIDEO_DETAILS_STYLE_CLASSES);

  const title = document.createElement("div");
  title.classList.add(...VIDEO_TITLE_STYLE_CLASSES);
  title.textContent = snippet.title;

  const channelAndViews = document.createElement("div");
  channelAndViews.classList.add(...CHANNEL_AND_VIEWS_STYLE_CLASSES);
  channelAndViews.textContent = `${snippet.channelTitle} • ${statistics.viewCount} views`;

  const publishDate = document.createElement("div");
  publishDate.classList.add(...PUBLISHED_DATE_STYLE_CLASSES);
  publishDate.textContent = new Date(snippet.publishedAt).toLocaleDateString();

  videoDetails.appendChild(title);
  videoDetails.appendChild(channelAndViews);
  videoDetails.appendChild(publishDate);

  return videoDetails;
};

document.getElementById(SEARCH_FIELD_ID).addEventListener("input", (event) => {
  const searchTerm = event.target.value;

  const filteredVideos = fetchedVideos.filter((video) =>
    video.items.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  renderYouTubeVideos(filteredVideos);
});

fetchAndRenderVideos();
