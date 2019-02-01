const baseUrl = "https://questioner1.herokuapp.com/api/v1";
const baseUr = `http://localhost:3000/api/v1`;

function get(url) {
  return new Request(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: localStorage.getItem("userToken")
    }
  });
}
function patch(url) {
  return new Request(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: localStorage.getItem("userToken")
    }
  });
}
function post(url, data) {
  return new Request(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: localStorage.getItem("userToken")
    }
  });
}
function errorToggler(){
  document.getElementById("alert").onclick = function(event) {
  document.getElementById("alert").classList.toggle("icon");
};
}


function notLoggedIn(){
  if (localStorage.getItem("userToken") === null) {
    document.getElementById("alert").classList.toggle("icon");
    document.getElementById("danger").innerHTML = 'You are not Logged in. You will be redirect to the login Page';
    return setTimeout(() => {
      (window.location.href = "login.html");
    }, 3000);
}
}

function displayLogout(){
  if (!localStorage.getItem("userToken")) {
    document.getElementById("logout").classList.toggle("icon");
  }
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};


function timeSince(timeStamp) {
  var now = new Date(),
    secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + "s";
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + "m";
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + "h";
  }
  if (secondsPast > 86400) {
    day = timeStamp.getDate();
    month = timeStamp
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(" ", "");
    year =
      timeStamp.getFullYear() == now.getFullYear()
        ? ""
        : " " + timeStamp.getFullYear();
    return day + " " + month + year;
  }
}

/*======================================================
                    // Login and CheckUser-Login
======================================================*/
function checkUserLogin() {
  if (localStorage.getItem("userToken") === null) {
    return (window.location.href = "../login.html");
  }
}
function checkMeetupId() {
  if (localStorage.getItem("meetupId") === null) {
    return (window.location.href = "../index.html");
  }
}
function checkAdminLogin() {
  if (localStorage.getItem("adminToken") === null) {
    return (window.location.href = "../login.html");
  }
}

function logOut() {
  localStorage.clear("userToken");
  return (window.location.href = "../index.html");
}


function adminLogOut() {
  localStorage.clear("adminToken");
  return (window.location.href = "login.html");
}

function setMinDateTime(){
  const currentTimePlusTen = (new Date(Date.now() + 4200000)).toISOString().slice(0, -1);
  return document.getElementById('new_happeningon').setAttribute('min', currentTimePlusTen)
}

/*======================================================
                  // Modal close by window
======================================================*/
const modal = document.getElementById("comment-container");
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = "scroll";
  }
};

/*======================================================
                    // Form Validation
======================================================*/
if (!RegExp.escape) {
  RegExp.escape = function(s) {
    return String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
  };
}

/*======================================================
                    // Screen Resize
======================================================*/

function myFun() {
  var x = document.querySelector(".nav-links");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

window.onresize = function(event) {
  if (window.matchMedia("(max-width: 576px)").matches) {
    var x = document.querySelector(".nav-links");
    x.style.display = "none";
  } else if (window.screen.availWidth > 575.99) {
    var x = document.querySelector(".nav-links");
    x.style.display = "block";
  }
};

/*======================================================
                    // Meetup-id
======================================================*/
function setMeetup(meetupId) {
  localStorage.setItem("meetupId", meetupId);
}

/*======================================================
                    //Auto load of all meetups
======================================================*/

function loadMeetupsPage() {
  document.getElementById("cs-loader").removeAttribute("hidden", "false");
  const url = `${baseUrl}/meetups`;
  let request = get(url);
  async function getMeetupsDetails(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      for (let i = 0; i <= data.data.length - 1; i++) {
        let happening = new Date(
          Date.parse(data.data[i].happeningon)
        ).toLocaleString();
        let main = (document.getElementById(
          "question_loads"
        ).innerHTML += `<div class="meetup-card">
            <a href="meetup.html" onclick="return setMeetup(${
              data.data[i].id
            })">
              <h1> ${data.data[i].topic.substring(0, 20)}...</h1>
              <h4>${data.data[i].location}</h4>
              <div class="meetup-img">
                <img
                  src="../resources/images/img5.webp"
                  alt="meetup-img"
                />
              </div>
              <h5>21 Questions</h5>
              <h5>${happening}</h5>
            </a>
          </div>`);
      }
      document.getElementById("cs-loader").setAttribute("hidden", "true");
      return response.status;
    } catch (err) {
      document.getElementById("cs-loader").setAttribute("hidden", "true");
      throw err;
    }
  }

  getMeetupsDetails(request);
}

/*======================================================
                    // Meetup details by the left
======================================================*/
function meetupDetails() {
  const meetupId = localStorage.getItem("meetupId");
  const url = `${baseUrl}/meetups/${meetupId}`;
  let request = get(url);
  async function getMeetupDetails(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      let happening = new Date(
        Date.parse(data.data[0].happeningon)
      ).toLocaleString();
      document.getElementById("meet_up-info").innerHTML = `<h2>${
        data.data[0].topic
      }</h2>
          <p><i class="fas fa-map-marker-alt"></i>&nbsp; ${
            data.data[0].location
          }</p>
          <p><i class="fas fa-calendar-alt"></i>&nbsp; ${happening}</p>
          <p>RSVP -</p>`;
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  getMeetupDetails(request);
}

/*======================================================
                    // Post Questions need Valid Token
======================================================*/
function newQuestion() {
  event.preventDefault();
  notLoggedIn();
  const title = document.getElementById("newQuestionTitle").value;
  const body = document.getElementById("newQuestionBody").value;
  const meetupId = localStorage.getItem("meetupId");
  const data = {
    title: title,
    body: body,
    meetup: meetupId
  };

  const url = `${baseUrl}/questions`;
  let request = post(url, data);

  async function postNewQuestion(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (!response.ok) {
        // console.log(data.error.message);
        // console.log(data.errors[0].msg)
        return response.status;
      }
      if (response.ok) {
        document.getElementById("new-question-form").reset();
        QuestionsInit();
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  postNewQuestion(request);
}

/*======================================================
                    // Sign Up
======================================================*/

function signUp() {
  let fN, lN, oN, e, pN, uN, p1, p2;
  event.preventDefault();
  document.getElementById("cs-loader").removeAttribute("hidden", "true");
  fN = document.getElementById("firstName").value;
  lN = document.getElementById("lastName").value;
  oN = document.getElementById("otherName").value;
  e = document.getElementById("email").value;
  pN = document.getElementById("phoneNumber").value;
  uN = document.getElementById("userName").value;
  p1 = document.getElementById("password").value;
  p2 = document.getElementById("confirmPassword").value;
  const data = {
    firstName: fN,
    lastName: lN,
    otherName: oN,
    email: e,
    phoneNumber: pN,
    userName: uN,
    password: p1,
    confirmPassword: p2
  };
  const url = `${baseUrl}/auth/signup`;
  let request = post(url, data);

  async function signUpRequest(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (response.ok) {
        document.getElementById("alert").classList.toggle("icon");
        document.getElementById("success").innerHTML =
          "Registration Successful";
        localStorage.setItem("userToken", data.data[0].token);
        localStorage.setItem("user", data.data[0].user.firstname);
        localStorage.setItem("tQ", data.data[0].totalQuestions);
        localStorage.setItem("tC", data.data[0].totalComments);
        setTimeout(() => {
          window.location.href = "user/dashboard.html";
        }, 3000);
        document.getElementById("cs-loader").setAttribute("hidden", "false");
        return response.status;
      }
      document.getElementById("alert").classList.toggle("icon");
      document.getElementById("danger").innerHTML = data.error;
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      return response.status;
    } catch (err) {
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      throw err;
    }
  }
  signUpRequest(request);
}

/*======================================================
                    // Sign In
======================================================*/
function signin() {
  let uE, pW;
  event.preventDefault();
  document.getElementById("cs-loader").removeAttribute("hidden", "true");
  uE = document.getElementById("email").value;
  pW = document.getElementById("pw").value;
  const data = {
    email: uE,
    password: pW
  };
  const url = `${baseUrl}/auth/login`;
  let request = post(url, data);
  async function postUserSignin(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (response.ok) {
        document.getElementById("alert").classList.toggle("icon");
        document.getElementById("success").innerHTML = "Login Successful";
        setTimeout(() => {
          window.location.href = "user/dashboard.html";
        }, 3000);
        localStorage.setItem("userToken", data.data[0].token);
        localStorage.setItem("user", data.data[0].user.firstname);
        localStorage.setItem("tQ", data.data[0].totalQuestions);
        localStorage.setItem("tC", data.data[0].totalComments);
        return response.status;
      }
      document.getElementById("alert").classList.toggle("icon");
      document.getElementById("danger").innerHTML = data.error;
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      return response.status;
    } catch (err) {
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      throw err;
    }
  }
  postUserSignin(request);
}

/*======================================================
                    //Auto load of all meetups
======================================================*/

function loadMeetupsPage() {
  document.getElementById("cs-loader").removeAttribute("hidden", "false");
  const url = `${baseUrl}/meetups`;
  let request = get(url);
  async function getMeetupsDetails(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      for (let i = 0; i <= data.data.length - 1; i++) {
        let happening = new Date(
          Date.parse(data.data[i].happeningon)
        ).toLocaleString();
        let main = (document.getElementById(
          "question_loads"
        ).innerHTML += `<div class="meetup-card">
            <a href="meetup.html" onclick="return setMeetup(${
              data.data[i].id
            })">
              <h1> ${data.data[i].topic.substring(0, 20)}...</h1>
              <h4>${data.data[i].location}</h4>
              <div class="meetup-img">
                <img
                  src="../resources/images/img5.webp"
                  alt="meetup-img"
                />
              </div>
              <h5>21 Questions</h5>
              <h5>${happening}</h5>
            </a>
          </div>`);
      }
      document.getElementById("cs-loader").setAttribute("hidden", "true");
      return response.status;
    } catch (err) {
      document.getElementById("cs-loader").setAttribute("hidden", "true");
      throw err;
    }
  }

  getMeetupsDetails(request);
}
/*======================================================
                    // Admin Sign-in
======================================================*/
function adminSignin() {
  let uE, pW;
  event.preventDefault();
  document.getElementById("cs-loader").removeAttribute("hidden", "true");
  uE = document.getElementById("email").value;
  pW = document.getElementById("pw").value;
  const data = {
    email: uE,
    password: pW
  };
  const url = `${baseUrl}/auth/admin`;
  let request = post(url, data);

  async function postAdminSignin(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (response.ok) {
        document.getElementById("alert").classList.toggle("icon");
        document.getElementById("success").innerHTML = "Login Successful";
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 3000);
        localStorage.setItem("adminToken", data.data[0].token);
        return response.status;
      }
      document.getElementById("alert").classList.toggle("icon");
      document.getElementById("danger").innerHTML = data.error;
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      return response.status;
    } catch (err) {
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      throw err;
    }
  }
  postAdminSignin(request);
}

/*======================================================
                    // admin table get all meetup
======================================================*/
function loadAllMeetupAdmin() {
  if (localStorage.getItem("adminToken") === null) {
    return (window.location.href = "login.html");
  }

  const url = `${baseUrl}/meetups`;
  let request = get(url);
  async function getAllMeetUp(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      let all = "";
      data.data.forEach(x => {
        let first = `<tr>
        <td>${x.topic}</td>
        <td><button onclick="return deleteMeetup(${x.id})">DELETE</button></td>
      </tr>`;
        all += first;
      });
      let main = (document.getElementById(
        "admin_all_meetups"
      ).innerHTML = `  <caption>
      <h3>MEETUPS</h3>
    </caption>
    <tr>
      <th>Meetups</th>
      <th>Delete</th>
    </tr>
        ${all}
      </div> `);
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  getAllMeetUp(request);
}

/*======================================================
                    // meetup post by admin
======================================================*/
function newMeetup() {
  async function postMeetup(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (response.ok) {
        location.reload();
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  event.preventDefault();
  const mT = document.getElementById("new_meetup-name").value;
  const mL = document.getElementById("new_location").value;
  const mD = document.getElementById("new_happeningon").value;
  const data = {
    topic: mT,
    location: mL,
    happeningOn: mD
  };
  const url = `${baseUrl}/meetups`;
  let request = new Request(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: localStorage.getItem("adminToken")
    }
  });
  postMeetup(request);
}
