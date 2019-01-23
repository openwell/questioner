/*======================================================
                    // Meetup pages by ID
======================================================*/
async function meetupDetailsAjax(dat) {
  try {
    let response = await fetch(dat);
    let data = await response.json();
    document.getElementById("meet_up-info").innerHTML = `<h2>MeetUp Name: ${
      data.data[0].topic
    }</h2>
          <p>Location - &nbsp; ${data.data[0].location}</p>
          <p>Happening On - ${data.data[0].happeningon}</p>
          <p>RSVP - ${data.data[0].title}</p>`;
    return response.status;
  } catch (err) {
    throw err;
  }
}

function meetup_details() {
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  const id = getUrlParameter("key");

  // sending
  const url = `https://questioner1.herokuapp.com/api/v1/meetups/1/${id}`;
  let request = new Request(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  meetupDetailsAjax(request);
}

/*======================================================
                    Get all comments
======================================================*/
function QuestionsInit() {
  const data = {
    status: "success",
    questions: [
      {
        subject: "Lorem ipsum, dolor sit amet consectetur",
        id: 1,
        votes: 8
      },
      {
        subject: "Lorem ipsum, dolor sit amet consecteturn",
        id: 3,
        votes: 4
      },
      {
        subject: "Lorem ipsum, dolor sit amet consectetur",
        id: 2,
        votes: 5
      },
      {
        subject: "Lorem ipsum, dolor sit amet consectetur",
        id: 3,
        votes: 4
      }
    ]
  };

  let all = "";
  const sortSample = data.questions.sort((a, b) => a.votes - b.votes);
  data.questions.forEach(x => {
    let main = document.getElementById("question-load");
    let first =
      '<div class="questions">' +
      '<div class="vote_bar">' +
      '<button class="up-vote" >' +
      '<i class="fa fa-arrow-up" aria-hidden="true"></i></button>' +
      '<div id="count">' +
      x.votes +
      " votes</div>" +
      '<button class="down-vote">' +
      '<i class="fa fa-arrow-down" aria-hidden="true"></i>' +
      "</button> </div>" +
      '<div class="questions-topic"><h4>' +
      x.subject +
      "</h4>" +
      '<small class="show-comment">Show comments</small></div></div>';
    all += first;
    main.innerHTML = all;
  });

  /*======================================================
                    // Vote
======================================================*/
  const upVote = document.getElementsByClassName("up-vote");
  for (i = 0; i < upVote.length; ++i) {
    upVote[i].onclick = function(event) {
      let vote = parseInt(event.currentTarget.nextSibling.innerHTML);
      vote = vote + 1;
      console.log(event);
      event.currentTarget.nextSibling.innerHTML = vote + " votes";
    };
  }

  const downVote = document.getElementsByClassName("down-vote");
  for (i = 0; i < downVote.length; ++i) {
    downVote[i].onclick = function(event) {
      let vote = parseInt(event.currentTarget.previousSibling.innerHTML);
      vote = vote - 1;
      event.currentTarget.previousSibling.innerHTML = vote + " votes";
    };
  }

  /*======================================================
                    // Comment
======================================================*/
document.getElementById("comment-close").onclick = function(event) {
  document.getElementById("comment-container").style.display = "none";
  document.body.style.overflow = "scroll";
};

const showComment = document.getElementsByClassName("show-comment");
for (i = 0; i < showComment.length; ++i) {
  showComment[i].onclick = function(event) {
    document.getElementById("comment-container").style.display = "block";
    document.body.style.overflow = "hidden";
  };
}
/*======================================================
                  // Modal
======================================================*/
const modal = document.getElementById("comment-container");
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.style.overflow = "hidden";
  }
};
}


/*======================================================
                    // RSVP
======================================================*/
function Rsvp(checkbox) {
  var checkBoxes = document.getElementsByName("rsvp");
  checkBoxes.forEach(item => {
    if (item !== checkbox) item.checked = false;
  });
}
function rsvpForm() {
  event.preventDefault();
}
/*======================================================
                    // Login and CheckUser-Login
======================================================*/
function checkUserLogin() {
  if (localStorage.getItem("userToken") === null) {
    window.location.href = "../login.html";
  }
}

function logOut() {
  localStorage.clear("userToken");
  window.location.href = "../index.html";
}
/*======================================================
                    // Screen Resize
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
                    // Questions
======================================================*/
function newQuestion() {
  event.preventDefault();

  if (localStorage.getItem("userToken") === null) {
    window.location.href = "login.html";
  }

  const title = document.getElementById("newQuestionTitle").innerHTML;
  const body = document.getElementById("newQuestionBody").innerHTML;
  // console.log(title, body)

  const data = {
    title: "1",
    body: body,
    createdBy: "2",
    meetup: "2"
  };

  const url = "https://questioner1.herokuapp.com/api/v1/questions";
  let request = new Request(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: localStorage.getItem("userToken")
    }
  });

  async function post(dat) {
    try {
      let response = await fetch(dat);
      let data = await response.json();
      if (response.ok) {
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  }

  post(request);
}

/*======================================================
                    // Sign Up
======================================================*/
async function signUpResquest(dat) {
  try {
    let response = await fetch(dat);
    let data = await response.json();
    if (response.ok) {
      document.getElementById("success").innerHTML = "Registration Successful";
      localStorage.setItem("userToken", data.token);
      setTimeout(() => {
        window.location.href = "user/dashboard.html";
      }, 3000);
      document.getElementById("cs-loader").setAttribute("hidden", "false");
      return response.status;
    }
    document.getElementById("success").innerHTML = response.statusText;
    return response.status;
  } catch (err) {
    document.getElementById("cs-loader").setAttribute("hidden", "false");
    throw err;
  }
}

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
    id: "1",
    firstName: fN,
    lastName: lN,
    otherName: oN,
    email: e,
    phoneNumber: pN,
    userName: uN,
    registered: "2018-3-3",
    isAdmin: "false",
    password: p1,
    confirmPassword: p2
  };
  const url = "https://questioner1.herokuapp.com/api/v1/auth/signup";
  let request = new Request(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: "adminToken"
    }
  });
  signUpResquest(request);
}

/*======================================================
                    // Sign In
======================================================*/

async function signinRequest(dat) {
  try {
    let response = await fetch(dat);
    let data = await response.json();
    if (response.ok) {
      document.getElementById("success").innerHTML = "Login Successful";
      setTimeout(() => {
        window.location.href = "user/dashboard.html";
      }, 3000);
      localStorage.setItem("userToken", data.data[0].token);
      return response.status;
    }
    document.getElementById("success").innerHTML = response.statusText;
    document.getElementById("cs-loader").setAttribute("hidden", "false");
    return response.status;
  } catch (err) {
    document.getElementById("cs-loader").setAttribute("hidden", "false");
    throw err;
  }
}

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
  // https://questioner1.herokuapp.com
  const url = "https://questioner1.herokuapp.com/api/v1/auth/login";
  let request = new Request(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      tokens: "adminToken"
    }
  });
  signinRequest(request);
}

/*======================================================
                    //Auto load of meetup details
======================================================*/

async function meetupDetailsRequest(dat) {
  try {
    let response = await fetch(dat);
    let data = await response.json();
    for (let i = 0; i <= data.data.length - 1; i++) {
      let main = (document.getElementById(
        "question_loads"
      ).innerHTML += `<div class="meetup-card">
        <a href="questions.html?key=${data.data[i].id}">
          <h1> ${data.data[i].topic.substring(0, 20)}...</h1>
          <h4>${data.data[i].location}</h4>
          <div class="meetup-img">
            <img
              src="../UI/resources/images/img5.webp"
              alt="meetup-img"
            />
          </div>
          <h5>21 Questions</h5>
          <h5>${data.data[i].happeningon}</h5>
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

function loadMeetupPage() {
  document.getElementById("cs-loader").removeAttribute("hidden", "false");
  const url = "https://questioner1.herokuapp.com/api/v1/meetups";
  let request = new Request(url, {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });
  meetupDetailsRequest(request);
}
