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
function errorToggler() {
  document.getElementById("alert").onclick = function(event) {
    document.getElementById("alert").classList.toggle("icon");
  };
}

function notLoggedIn() {
  if (localStorage.getItem("userToken") === null) {
    document.getElementById("alert").classList.toggle("icon");
    document.getElementById("danger").innerHTML =
      "You are not Logged in. You will be redirect to the login Page";
    return setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  }
}

function displayLogout() {
  if (!localStorage.getItem("userToken")) {
    document.getElementById("logout").classList.toggle("icon");
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

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

function setMinDateTime() {
  const currentTimePlusTen = new Date(Date.now() + 4200000)
    .toISOString()
    .slice(0, -1);
  return document
    .getElementById("new_happeningon")
    .setAttribute("min", currentTimePlusTen);
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
                  src="../UI/resources/images/img5.webp"
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
                    Get all questions
======================================================*/
function QuestionsInit() {
  const url = `${baseUrl}/questions`;
  let request = get(url);

  async function questionsDetailsAjax(payLoad) {
    try {
      let response = await fetch(payLoad);
      const data = await response.json();
      const meetupId = localStorage.getItem("meetupId");
      const output = data.data.filter(db => db.meetup_id === Number(meetupId));
      const sortSample = output.sort((a, b) => b.votes - a.votes);
      let all = "";
      output.forEach(x => {
        let main = document.getElementById("question-load");
        let first =
          '<div class="questions">' +
          '<div class="vote_bar">' +
          '<button class="up-vote" id="green" onclick="return upVote(event)" >' +
          '<i class="fa fa-arrow-up" aria-hidden="true"></i></button>' +
          '<div id="count" data=' +
          x.id +
          " >" +
          x.votes +
          " votes</div>" +
          '<button class="down-vote" id="red" onclick="return downVote(event)">' +
          '<i class="fa fa-arrow-down" aria-hidden="true"></i>' +
          "</button> </div>" +
          '<div class="questions-topic"><h4>' +
          x.title +
          "</h4>" +
          '<small class="show-comment" onclick="return openModal(event)">Show comments</small></div></div>';
        all += first;
        main.innerHTML = all;
      });
      return response.status;
    } catch (err) {
      throw err;
    }
  }
  questionsDetailsAjax(request);
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
                    // Vote
======================================================*/
function upVote(event) {
  let vote = parseInt(event.currentTarget.nextSibling.innerHTML);
  vote = vote + 1;
  notLoggedIn();

  const id = event.currentTarget.nextSibling.getAttribute("data");
  const url = `${baseUrl}/questions/${id}/upvote`;
  let request = patch(url);
  async function postUpVote(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (response.ok) {
        event.currentTarget.nextSibling.innerHTML = vote + " votes";
        location.reload();
        return response.status;
      }
      document.getElementById("alert").classList.toggle("icon");
      document.getElementById("danger").innerHTML = data.data;
      return response.status;
    } catch (err) {
      throw err;
    }
  }
  postUpVote(request);
}

function downVote(event) {
  let vote = parseInt(event.currentTarget.previousSibling.innerHTML);
  vote = vote - 1;
  notLoggedIn();
  const id = event.currentTarget.previousSibling.getAttribute("data");
  const url = `${baseUrl}/questions/${id}/downvote`;
  let request = patch(url);

  async function postDownVote(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (response.ok) {
        event.currentTarget.previousSibling.innerHTML = vote + " votes";
        location.reload();
        return response.status;
      }
      document.getElementById("alert").classList.toggle("icon");
      document.getElementById("danger").innerHTML = data.data;
      return response.status;
    } catch (err) {
      throw err;
    }
  }
  postDownVote(request);
}

/*======================================================
                    // open Comment and question
======================================================*/

function closeModal(event) {
  document.getElementById("comment-container").style.display = "none";
  document.body.style.overflow = "scroll";
}

function openModal() {
  const questionId = event.target.parentElement.previousElementSibling.children[1].getAttribute(
    "data"
  );
  localStorage.setItem("questionId", questionId);
  document.getElementById("comment-container").style.display = "block";
  document.body.style.overflow = "hidden";

  const url = `${baseUrl}/questions/${localStorage.getItem("questionId")}`;
  let request = get(url);

  async function getQuestionComments(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      let all = "";
      data.comment.forEach(x => {
        const hap = timeSince(new Date(x.created_on));
        let first = `<small><i class="far fa-user-circle"></i>&nbsp;${
          x.username
        }&nbsp;${hap}&nbsp;ago</small><p class="comments_bar" >${
          x.comment
        }</p><br/>`;
        all += first;
      });
      let main = (document.getElementById(
        "comment-main"
      ).innerHTML = `  <span><i class="fas fa-times" id="comment-close" onclick="return closeModal()"></i></span><br />
      <div class="modal-topic-body">
        <h3>${data.data.title}</h3><br />
        <p>${data.data.body}</p><br />
      </div>
      <div class="modal-new-comment">
        <h5>New Comment</h5>
        <form action="" onsubmit="return createNewComment()" id="modalcommentform" class="comment-form";>
          <textarea name="body" placeholder= 'Post a comment' id="commentTextarea"cols="60" rows="3" required maxlength="200" minlength="2" title="2 to 200 characters"
          ></textarea>
          <button>Submit</button>
        </form>
      </div>
      <div class="modal-comment">
        <h3>Comments</h3>
        ${all}
      </div> `);
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  getQuestionComments(request);
}

/*======================================================
                    // Upcoming Table
======================================================*/
function loadUpcomingTable() {
  if (localStorage.getItem("userToken") === null) {
    return (window.location.href = "../login.html");
  }
  const url = `${baseUrl}/meetups/upcoming`;
  let request = get(url);
  async function getUpcomingTable(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      let all = "";
      data.data.forEach(x => {
        let first = ` 
        <tr>
        <td>${x.topic}</td>
        <td>${x.location}</td>
        <td>${x.happeningon}</td>
      </tr>`;
        all += first;
      });
      document.getElementById(
        "userDashboard"
      ).innerHTML = ` <div class="user-details">
      <span class="user-avatar"></span>
      <p>user - ${localStorage.getItem("user")}</p>
      <p>last login -</p>
    </div>
    <div class="user-statistic-bar">
      <div class="user-statistic">
        <div class="user-statistic-1">
          <i class="fas fa-question-circle    "></i>
          <p>No of Questions Posted</p> <p>${localStorage.getItem(
            "tQ"
          )}</p></div>
        <div class="user-statistic-2">
            <i class="fas fa-comments    "></i>
          <p>No of Questions Commented on</p><p>${localStorage.getItem(
            "tC"
          )}</p>
        </div>
      </div>
      <div class="user-top-feed">
        <table id="upcoming_table">
        <caption>
      <h2>Top Questions Feed</h2> 
    </caption>
    <tr >
      <th>Meetups</th>
      <th>Location</th>
      <th>Date</th>
    </tr>
        ${all}
      </div> 
      </table>
      </div>
    </div> `;
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  getUpcomingTable(request);
}

/*======================================================
                    // post new Comment
======================================================*/
function createNewComment() {
  event.preventDefault();
  if (localStorage.getItem("userToken") === null) {
    return (window.location.href = "login.html");
  }

  const newComment = document.getElementById("commentTextarea").value;
  const questionId = localStorage.getItem("questionId");
  const data = {
    comment: newComment,
    question: questionId
  };

  const url = `${baseUrl}/comments`;
  let request = post(url, data);

  async function postComment(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      if (!response.ok) {
        // console.log(data.error.message);
        // console.log(data.errors[0].msg)
        return response.status;
      }
      if (response.ok) {
        document.getElementById("modalcommentform").reset();
        location.reload();
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  }
  postComment(request);
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

/*======================================================
                    // delete meetup
======================================================*/
function deleteMeetup(id) {
  if (localStorage.getItem("adminToken") === null) {
    return (window.location.href = "login.html");
  }
  async function delMeetup(payLoad) {
    try {
      let response = await fetch(payLoad);
      let data = await response.json();
      location.reload();
      return response.status;
    } catch (err) {
      throw err;
    }
  }
  const url = `${baseUrl}/meetups/${id}`;
  let request = new Request(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: localStorage.getItem("adminToken")
    }
  });
  delMeetup(request);
}
