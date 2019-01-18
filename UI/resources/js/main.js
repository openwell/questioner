/*======================================================
                    Questions
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
      '<small class="show-comment">show comments</small></div></div>';
    all += first;
    main.innerHTML = all;
  });

  document.getElementById("comment-close").onclick = function(event) {
    document.getElementById("comment-container").style.display = "none";
  };

  const showComment = document.getElementsByClassName("show-comment");
  for (i = 0; i < showComment.length; ++i) {
    showComment[i].onclick = function(event) {
      document.getElementById("comment-container").style.display = "block";
    };
  }

  const modal = document.getElementById("comment-container");
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  const upVote = document.getElementsByClassName("up-vote");
  for (i = 0; i < upVote.length; ++i) {
    upVote[i].onclick = function(event) {
      let vote = parseInt(event.currentTarget.nextSibling.innerHTML);
      vote = vote + 1;
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
}

function Rsvp(checkbox) {
  var checkBoxes = document.getElementsByName("rsvp");
  checkBoxes.forEach(item => {
    if (item !== checkbox) item.checked = false;
  });
}

function checkUserLogin() {
  if (localStorage.getItem("userToken") === null) {
    window.location.href = "../login.html";
  }
}

function logOut() {
  localStorage.clear("userToken") 
  window.location.href = "../login.html";
}

if (!RegExp.escape) {
  RegExp.escape = function(s) {
    return String(s).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
  };
}
