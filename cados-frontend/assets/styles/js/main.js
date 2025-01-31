// DOM Elements
const form = document.getElementById("search-form");
const qNum = document.getElementById("qNum");
const wrapper = document.getElementById("wrapper-row");
const modal = document.getElementById("modal-wrapper");
const advocatesNum = document.getElementById("advocatesNum");
const loadingEl = document.getElementById("loading");
const BASE_URL = "http://127.0.0.1:1234/advocates/";

// CSRF Token handling
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
}

const csrftoken = getCookie("csrftoken");

// Advocate card template
function createAdvocateCard(advocate) {
  if (!advocate.name) return ""; // Skip if no name

  return `
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <div id="card-header">
                        <img
                            id="user_avatar"
                            src="${advocate.profile_pic || "avatar-default.PNG"}"
                            class="img-fluid rounded-circle"
                            alt="${advocate.name}'s avatar"
                            onerror="this.src='avatar-default.PNG'"
                        />
                        <div id="user_details">
                            <h6>${advocate.name}</h6>
                            ${
                              advocate.twitter
                                ? `<a href="${advocate.twitter}" target="_blank" rel="noopener noreferrer">
                                    <small>@${advocate.username}</small>
                                </a>`
                                : "<small>No Twitter handle</small>"
                            }
                        </div>
                    </div>
                    <p>${advocate.bio || "No bio available"}</p>
                </div>
            </div>
        </div>
    `;
}

// Render advocate list
function advocateList(advocates) {
  wrapper.innerHTML = advocates
    .map(createAdvocateCard)
    .filter((card) => card) // Remove empty cards
    .join("");
}

// Fetch advocates
async function getAdvocates() {
  loadingEl.style.display = "block";
  wrapper.innerHTML = "";

  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    advocatesNum.textContent = data.total;
    advocateList(data.advocates);
    return data;
  } catch (error) {
    console.error("Error fetching advocates:", error);
    wrapper.innerHTML = `<div class="alert alert-danger">Failed to load advocates. Please try again later.</div>`;
  } finally {
    loadingEl.style.display = "none";
  }
}

// Search form handler
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = e.target.query.value.trim();
  const searchUrl = `${BASE_URL}?query=${encodeURIComponent(query)}`;

  loadingEl.style.display = "block";
  wrapper.innerHTML = "";
  qNum.innerHTML = "";

  try {
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    advocateList(data.advocates);

    if (query) {
      qNum.innerHTML = `
                <h6>Your search for [ ${query} ] found ${data.total} Developer Advocate(s)</h6>
            `;
    }
  } catch (error) {
    console.error("Error searching advocates:", error);
    wrapper.innerHTML = `<div class="alert alert-danger">Search failed. Please try again later.</div>`;
  } finally {
    loadingEl.style.display = "none";
  }
});

// Modal form handler
modal?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username")?.value.trim();
  if (!username) return;

  try {
    // First API call to create advocate
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ username }),
    });

    if (!createRes.ok) throw new Error(`HTTP error! status: ${createRes.status}`);

    const data = await createRes.json();

    // Second API call to fetch advocate details
    const fetchRes = await fetch(`${BASE_URL}${data.username}/`);
    if (!fetchRes.ok) throw new Error(`HTTP error! status: ${fetchRes.status}`);

    await fetchRes.json();
    window.location.reload();
  } catch (error) {
    console.error("Error creating advocate:", error);
    alert("Failed to create advocate. Please try again later.");
  }
});

// Scroll to top functionality
$(window).scroll(function () {
  const returnToTop = $("#return-to-top");
  if ($(this).scrollTop() >= 50) {
    returnToTop.fadeIn(200);
  } else {
    returnToTop.fadeOut(200);
  }
});

$("#return-to-top").click(function () {
  $("body,html").animate({ scrollTop: 0 }, 500);
});

// Initial load
document.addEventListener("DOMContentLoaded", getAdvocates);
