// storing variable names
let form = document.getElementById("search-form");
let qNum = document.getElementById("qNum");
let wrapper = document.getElementById("wrapper-row");
let modal = document.getElementById("modal-wrapper");
let advocatesNum = document.getElementById("advocatesNum");
let url = "http://127.0.0.1:8000/advocates/";
let loadingEl = document.getElementById("loading");

// sending csrf token into our form to submit user data into the database
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
let csrftoken = getCookie("csrftoken");

// function for all advocates
let advocateList = (advocates) => {
  for (var i = 0; i < advocates.length; i++) {
    let name = `${advocates[i].name}`;
    if (name == "null") {
      // skip the current iteration of THE loop and move on to the next iteration if THE name is NULL
      continue;
    } else {
      var list = `
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <div id="card-header">
              <img
                id="user_avatar"
                src="${advocates[i].profile_pic}"
                class="img-fluid rounded-circle"
                alt="user_avatar"
              />
              <div id="user_details">
                <h6>${advocates[i].name}</h6>
                <a href="${advocates[i].twitter}">
                  <small>@${advocates[i].username}</small>
                </a>
              </div>
              <!-- End user_details-->
            </div>
            <!-- End card-header-->
            <p>
              ${advocates[i].bio}
            </p>
          </div>
          <!-- End card-body-->
        </div>
        <!-- End card-->
      </div>
      <!-- End col-->
    `;
      wrapper.innerHTML += list;
    }
  }
};

async function getAdvocates() {
  // Show the loading message
  loadingEl.style.display = "block";

  try {
    // Make the API call
    const res = await fetch(url);
    const data = await res.json();
    const advocates = data.advocates;
    const total_advocates = data.total;

    // Clear the wrapper element and display the data
    wrapper.innerHTML = "";
    advocatesNum.innerHTML += total_advocates;
    advocateList(advocates);
    return data; // return the data so it can be used in the updatePagination function
  } catch (error) {
    console.error(error);
  } finally {
    // Hide the loading message
    loadingEl.style.display = "none";
  }
}
// Call the getAdvocates function to make the API call
getAdvocates();

// send a GET request to the server with the search query in the URL
form.addEventListener("submit", (e) => {
  // prevent the form from being submitted
  e.preventDefault();
  wrapper.innerHTML = "";
  qNum.innerHTML = "";
  let query = e.target.query.value;
  let url = `http://127.0.0.1:8000/advocates/?query=${query}`;
  fetch(url)
    .then((res) => res.json()) // parse the response as JSON
    .then((data) => {
      // handle the search results here
      let advocates = data.advocates;
      let total_advocates = data.total;
      advocateList(advocates);
      if (query !== "") {
        let queryNum = `
        <h6>Your search for [ ${query} ], found ${total_advocates} Developer Advocate(s)</h6>
      `;
        qNum.innerHTML += queryNum;
      }
    });
});

// send a POST request to the server to create a new advocate
modal.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ username: username }),
  })
    .then((res) => res.json())
    .then((data) => {
      let twitterUsername = data.username;
      return fetch(`http://127.0.0.1:8000/advocates/${twitterUsername}/`);
    })
    .then((response) => response.json())
    .then((data) => {
      // Do something with the data from the second fetch
      console.log(data);
      window.location.href = window.location.href;
    });
});

// ===== Scroll to Top ====
$(window).scroll(function () {
  if ($(this).scrollTop() >= 50) {
    // If page is scrolled more than 50px
    $("#return-to-top").fadeIn(200); // Fade in the arrow
  } else {
    $("#return-to-top").fadeOut(200); // Else fade out the arrow
  }
});
$("#return-to-top").click(function () {
  // When arrow is clicked
  $("body,html").animate(
    {
      scrollTop: 0, // Scroll to top of body
    },
    500
  );
});
