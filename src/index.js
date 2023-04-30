
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
const API_KEY = "35807349-c4d05eecb707cc9566f3700f2"; 
const BASE_URL = `https://pixabay.com/api/`;

const searchForm = document.querySelector("#search-form");
const loadMoreBtn = document.querySelector(".load-more");
const galleryList = document.querySelector(".gallery");

let images = [];
let searchQuery = "";
let page = 1;

const createGalleryItemMarkup = (image) => {
  const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;

  return `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="stats">
        <p class="stats-item">
          <i class="material-icons">thumb_up</i>
          ${likes}
        </p>
        <p class="stats-item">
          <i class="material-icons">visibility</i>
          ${views}
        </p>
        <p class="stats-item">
          <i class="material-icons">comment</i>
          ${comments}
        </p>
        <p class="stats-item">
          <i class="material-icons">cloud_download</i>
          ${downloads}
        </p>
      </div>
    </div>`;
};

const fetchImages = () => {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error("Network response was not ok");
    })
    .then((data) => {
      const images = data.hits;

      if (images.length === 0) {
        Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
      } else {
        const galleryItemsMarkup = images.map((image) => createGalleryItemMarkup(image)).join("");
        galleryList.insertAdjacentHTML("beforeend", galleryItemsMarkup);

       
        const { height: cardHeight } = galleryList.firstElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: "smooth",
        });

        if (images.length < 40) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          loadMoreBtn.classList.add("is-hidden");
        } else {
          loadMoreBtn.classList.remove("is-hidden");
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      Notiflix.Notify.failure("Oops! Something went wrong. Please try again later.");
    });
};


searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = event.currentTarget.elements.searchQuery;

  if (!input.value) {
    return;
  }

  searchQuery = input.value.trim();
  page = 1;

  galleryList.innerHTML = "";
  loadMoreBtn.classList.add("is-hidden");

  fetchImages();
});

loadMoreBtn.addEventListener("click", () => {
  page += 1;

  fetchImages();
});






if (images.length < 40) {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  loadMoreBtn.classList.add("is-hidden");
} else {
  loadMoreBtn.classList.remove("is-hidden");
}


loadMoreBtn.addEventListener("click", () => {
  if (loadMoreBtn.classList.contains("is-hidden")) {
    return;
  }
  
  page += 1;
  fetchImages();
});


let loading = false;

const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

  if (isAtBottom && !loading) {
    loading = true;
    page += 1;
    fetchImages().finally(() => {
      loading = false;
    });
  }
};

window.addEventListener("scroll", handleScroll);
