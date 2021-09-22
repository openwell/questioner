// 'use strict';
const baseUrl = 'https://questioner1.herokuapp.com/api/v1';
const baseUr = 'http://localhost:3000/api/v1';

const get = (url) =>
  new Request(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      tokens: localStorage.getItem('userToken'),
    },
  });
const patch = (url) =>
  new Request(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      tokens: localStorage.getItem('userToken'),
    },
  });

const post = (url, data, token) =>
  new Request(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      tokens: localStorage.getItem(token),
    },
  });
const errorToggler = () => {
  document.getElementById('alert').onclick = function (event) {
    document.getElementById('alert').classList.toggle('icon');
  };
};

const alertHandler = (message, link) => {
  document.getElementById('alert').classList.toggle('icon');
  document.getElementById('danger').innerHTML = message;
  return setTimeout(() => {
    window.location.href = link;
  }, 2000);
};

const notLoggedIn = () => {
  const token = localStorage.getItem('userToken');
  if (token === null) {
    return alertHandler(
      'You are not Logged in. You will be redirect to the login Page',
      'login.html'
    );
  }
  const decoded = parseJwt(token);
  if (decoded instanceof TypeError) {
    return alertHandler('Invalid Token', '../login.html');
  }
  if (decoded.exp < new Date().getTime() / 1000) {
    return alertHandler('Your Token as expired. Login Again', 'login.html');
  }
};

const displayLogout = () => {
  if (!localStorage.getItem('userToken')) {
    document.getElementById('logout').classList.toggle('icon');
  }
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } catch (err) {
    throw err;
  }
};

const timeSince = (timeStamp) => {
  const now = new Date();
  const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return `${parseInt(secondsPast)}s`;
  }
  if (secondsPast < 3600) {
    return `${parseInt(secondsPast / 60)}m`;
  }
  if (secondsPast <= 86400) {
    return `${parseInt(secondsPast / 3600)}h`;
  }
  if (secondsPast > 86400) {
    day = timeStamp.getDate();
    month = timeStamp
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(' ', '');
    year =
      timeStamp.getFullYear() == now.getFullYear()
        ? ''
        : ` ${timeStamp.getFullYear()}`;
    return `${day} ${month}${year}`;
  }
};

/*= =====================================================
                    // Login and CheckUser-Login
====================================================== */
const checkUserLogin = () => {
  const token = localStorage.getItem('userToken');
  if (token === null) {
    return (window.location.href = '../login.html');
  }
  const decoded = parseJwt(token);

  if (decoded.exp < new Date().getTime() / 1000) {
    return (alertHandler =
      ('Your Token as expired. Login Again', '../login.html'));
  }
};
const checkMeetupId = () => {
  if (localStorage.getItem('meetupId') === null) {
    return (window.location.href = '../index.html');
  }
};
const checkAdminLogin = () => {
  const token = localStorage.getItem('adminToken');
  if (token === null) {
    return (window.location.href = '../login.html');
  }

  const decoded = parseJwt(token);
  if (decoded.exp < new Date().getTime() / 1000) {
    return (alertHandler =
      ('Your Token as expired. Login Again', '../login.html'));
  }
};

const logOut = () => {
  localStorage.clear('userToken');
  return (window.location.href = '../index.html');
};

const adminLogOut = () => {
  localStorage.clear('adminToken');
  return (window.location.href = 'login.html');
};

const setMinDateTime = () => {
  const currentTimePlusTen = new Date(Date.now() + 4200000)
    .toISOString()
    .slice(0, -1);
  return document
    .getElementById('new_happeningon')
    .setAttribute('min', currentTimePlusTen);
};

/*= =====================================================
                  // Modal close by window
====================================================== */
const modal = document.getElementById('comment-container');
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'scroll';
  }
};

/*= =====================================================
                    // Form Validation
====================================================== */
if (!RegExp.escape) {
  RegExp.escape = function (s) {
    return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
  };
}

/*= =====================================================
                    // Screen Resize
====================================================== */

const myFun = () => {
  const x = document.querySelector('.nav-links');
  if (x.style.display === 'block') {
    x.style.display = 'none';
  } else {
    x.style.display = 'block';
  }
};

window.onresize = function (event) {
  if (window.matchMedia('(max-width: 576px)').matches) {
    var x = document.querySelector('.nav-links');
    x.style.display = 'none';
  } else if (window.screen.availWidth > 575.99) {
    var x = document.querySelector('.nav-links');
    x.style.display = 'block';
  }
};

/*= =====================================================
                    // Meetup-id
====================================================== */
const setMeetup = (meetupId) => {
  localStorage.setItem('meetupId', meetupId);
};

/*= =====================================================
                    //Auto load of all meetups
====================================================== */
const loadMeetupsPage = () => {
  document.getElementById('cs-loader').removeAttribute('hidden', 'false');
  const url = `${baseUrl}/meetups`;
  const request = get(url);
  const getMeetupsDetails = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      for (let i = 0; i <= data.data.length - 1; i++) {
        const happening = new Date(
          Date.parse(data.data[i].happeningon)
        ).toLocaleString();
        const main = (document.getElementById(
          'question_loads'
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
      document.getElementById('cs-loader').setAttribute('hidden', 'true');
      return response.status;
    } catch (err) {
      document.getElementById('cs-loader').setAttribute('hidden', 'true');
      throw err;
    }
  };

  getMeetupsDetails(request);
};

/*= =====================================================
                    // Meetup details by the left rsvp
====================================================== */
const getRsvp = () => {
  notLoggedIn();
  const meetupId = localStorage.getItem('meetupId');
  const url = `${baseUrl}/meetups/rsvps`;
  const request = get(url);
  const getRsvpDetails = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (data.error === 'Token Forbidden') {
        return alertHandler('Forbidden Token', '../login.html');
      }
      if (data.data.length === 0) {
        return 'Yet to Decide';
      }
      const data2 = data.data.filter((db) => db.meetup_id === Number(meetupId));
      if (data2.length === 0) {
        return 'Yet to Decide';
      }
      document.querySelector('.rsvp-form').setAttribute('hidden', 'true');
      return data2[0].response;
    } catch (err) {
      throw err;
    }
  };

  return getRsvpDetails(request);
};

/*= =====================================================
                    // Meetup details by the left
====================================================== */
const meetupDetails = () => {
  const meetupId = localStorage.getItem('meetupId');
  const url = `${baseUrl}/meetups/${meetupId}`;
  const request = get(url);
  const getMeetupDetails = async (payLoad) => {
    try {
      let rsvp = 'Yet to decide';
      if (localStorage.getItem('userToken')) {
        rsvp = await getRsvp();
      }
      if (rsvp instanceof Error) {
        return alertHandler('Forbidden Token', '../login.html');
      }
      const response = await fetch(payLoad);
      const data = await response.json();
      const happening = new Date(
        Date.parse(data.data[0].happeningon)
      ).toLocaleString();
      document.getElementById('meet_up-info').innerHTML = `<h2>${
        data.data[0].topic
      }</h2>
          <p><i class="fas fa-map-marker-alt"></i>&nbsp; ${
            data.data[0].location
          }</p>
          <p><i class="fas fa-calendar-alt"></i>&nbsp; ${happening}</p>
          <p>RSVP -> ${rsvp.toUpperCase()}</p>`;
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  getMeetupDetails(request);
};

/*= =====================================================
                    Get all questions
====================================================== */
const QuestionsInit = () => {
  const url = `${baseUrl}/questions`;
  const request = get(url);
  const questionsDetailsAjax = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (data.error === 'No Questions Exist') {
        return (document.getElementById('question-load').innerHTML =
          'Be the First To Add a Question.');
      }
      const meetupId = localStorage.getItem('meetupId');
      const output = data.data.filter(
        (db) => db.meetup_id === Number(meetupId)
      );
      const sortSample = output.sort((a, b) => b.votes - a.votes);
      let all = '';
      output.forEach((x) => {
        const main = document.getElementById('question-load');
        const first =
          `${
            '<div class="questions">' +
            '<div class="vote_bar">' +
            '<button class="up-vote" id="green" onclick="return upVote(event)" >' +
            '<i class="fa fa-arrow-up" aria-hidden="true"></i></button>' +
            '<div id="count" data='
          }${x.id} >${x.votes} votes</div>` +
          '<button class="down-vote" id="red" onclick="return downVote(event)">' +
          '<i class="fa fa-arrow-down" aria-hidden="true"></i>' +
          '</button> </div>' +
          `<div class="questions-topic"><h4>${x.title}</h4>` +
          '<small class="show-comment" onclick="return openModal(event)">Show comments</small></div></div>';
        all += first;
        main.innerHTML = all;
      });
      return response.status;
    } catch (err) {
      throw err;
    }
  };
  questionsDetailsAjax(request);
};

/*= =====================================================
                    // RSVP
====================================================== */
const rsvpForm = async () => {
  event.preventDefault();
  notLoggedIn();
  event.preventDefault();
  const response = event.target.value;
  const meetupId = localStorage.getItem('meetupId');
  const data = {
    response,
  };
  const url = `${baseUrl}/meetups/${meetupId}/rsvps`;
  const request = post(url, data, 'userToken');

  const postRsvp = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      location.reload();
      return response.status;
    } catch (err) {
      throw err;
    }
  };
  setTimeout(() => postRsvp(request), 3000);
};

/*= =====================================================
                    // Sign Up
====================================================== */

const signUp = () => {
  event.preventDefault();
  document.getElementById('cs-loader').removeAttribute('hidden', 'true');
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const otherName = document.getElementById('otherName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const userName = document.getElementById('userName').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const data = {
    firstName,
    lastName,
    otherName,
    email,
    phoneNumber,
    userName,
    password,
    confirmPassword,
  };
  const url = `${baseUrl}/auth/signup`;
  const request = post(url, data, 'userToken');

  const signUpRequest = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (response.ok) {
        document.getElementById('alert').classList.toggle('icon');
        document.getElementById('success').innerHTML =
          'Registration Successful';
        localStorage.setItem('userToken', data.data[0].token);
        localStorage.setItem('user', data.data[0].user.firstname);
        setTimeout(() => {
          window.location.href = 'user/dashboard.html';
        }, 2000);
        document.getElementById('cs-loader').setAttribute('hidden', 'false');
        return response.status;
      }
      document.getElementById('alert').classList.toggle('icon');
      document.getElementById('danger').innerHTML = data.error;
      document.getElementById('cs-loader').setAttribute('hidden', 'false');
      return response.status;
    } catch (err) {
      document.getElementById('cs-loader').setAttribute('hidden', 'false');
      throw err;
    }
  };
  signUpRequest(request);
};

/*= =====================================================
                    // Sign In
====================================================== */
const signin = () => {
  event.preventDefault();
  document.getElementById('cs-loader').removeAttribute('hidden', 'true');
  const email = document.getElementById('email').value;
  const password = document.getElementById('pw').value;
  const data = {
    email,
    password,
  };
  const url = `${baseUrl}/auth/login`;
  const request = post(url, data, 'userToken');
  const postUserSignin = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (response.ok) {
        document.getElementById('alert').classList.toggle('icon');
        document.getElementById('success').innerHTML = 'Login Successful';
        setTimeout(() => {
          window.location.href = 'user/dashboard.html';
        }, 2000);
        localStorage.setItem('userToken', data.data[0].token);
        localStorage.setItem('user', data.data[0].user.firstname);
        return response.status;
      }
      document.getElementById('alert').classList.toggle('icon');
      document.getElementById('danger').innerHTML = data.error;
      document.getElementById('cs-loader').setAttribute('hidden', 'false');
      return response.status;
    } catch (err) {
      document.getElementById('cs-loader').setAttribute('hidden', 'false');
      throw err;
    }
  };
  postUserSignin(request);
};

/*= =====================================================
                    // Post Questions need Valid Token
====================================================== */
const newQuestion = () => {
  event.preventDefault();
  notLoggedIn();
  const title = document.getElementById('newQuestionTitle').value;
  const body = document.getElementById('newQuestionBody').value;
  const meetupId = localStorage.getItem('meetupId');
  const data = {
    title,
    body,
    meetup: meetupId,
  };

  const url = `${baseUrl}/questions`;
  const request = post(url, data, 'userToken');
  const postNewQuestion = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (!response.ok) {
        return response.status;
      }
      if (response.ok) {
        document.getElementById('new-question-form').reset();
        QuestionsInit();
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  return postNewQuestion(request);
};

/*= =====================================================
                    // Vote
====================================================== */
const upVote = (event) => {
  let vote = parseInt(event.currentTarget.nextSibling.innerHTML);
  vote += 1;
  notLoggedIn();

  const id = event.currentTarget.nextSibling.getAttribute('data');
  const url = `${baseUrl}/questions/${id}/upvote`;
  const request = patch(url);
  const postUpVote = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (response.ok) {
        event.target.parentNode.nextSibling.innerHTML = `${vote} votes`;
        return response.status;
      }
      document.getElementById('alert').classList.toggle('icon');
      document.getElementById('danger').innerHTML = data.data;
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  return postUpVote(request);
};

const downVote = (event) => {
  let vote = parseInt(event.currentTarget.previousSibling.innerHTML);
  vote -= 1;
  notLoggedIn();
  const id = event.currentTarget.previousSibling.getAttribute('data');
  const url = `${baseUrl}/questions/${id}/downvote`;
  const request = patch(url);

  const postDownVote = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (response.ok) {
        event.target.parentNode.previousSibling.innerHTML = `${vote} votes`;
        return response.status;
      }
      document.getElementById('alert').classList.toggle('icon');
      document.getElementById('danger').innerHTML = data.data;
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  return postDownVote(request);
};

/*= =====================================================
                    // open Comment and question
====================================================== */

const closeModal = (event) => {
  document.getElementById('comment-container').style.display = 'none';
  document.body.style.overflow = 'scroll';
};

const openModal = () => {
  const questionId =
    event.target.parentElement.previousElementSibling.children[1].getAttribute(
      'data'
    );
  localStorage.setItem('questionId', questionId);
  document.getElementById('comment-container').style.display = 'block';
  document.body.style.overflow = 'hidden';

  const url = `${baseUrl}/questions/${localStorage.getItem('questionId')}`;
  const request = get(url);

  const getQuestionComments = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      let all = '';
      data.comment.forEach((x) => {
        const hap = timeSince(new Date(x.created_on));
        const first = `<div class="comment_comments">
        <small><img src="./resources/images/avatar1.png" width="30px" height="30" alt=""></small >
        <div> 
          &nbsp;${x.username}&nbsp;&nbsp;${hap}&nbsp;ago 
          <p class="comments_bar" >${x.comment}</p>
          </div>
        </div>`;
        all += first;
      });
      document.getElementById(
        'comment-main'
      ).innerHTML = `<span><i class="fas fa-times" id="comment-close" onclick="return closeModal()"></i></span><br />
      <div class="modal-topic-body">
        <h3>${data.data.title}</h3><br />
        <p>${data.data.body}</p><br />
      </div>
      <div class="modal-new-comment">
        <h5>New Comment</h5>
        <form action="" onsubmit="return createNewComment()" id="modalcommentform" class="comment-form";>
          <textarea name="body" placeholder= 'Add a comment' id="commentTextarea"cols="60" rows="3" required maxlength="200" minlength="2" title="2 to 200 characters"
          ></textarea>
          <button>Add a Comment</button>
        </form>
      </div>
      <div class="modal-comment">
        <h3>Comments</h3>
        ${all}
      </div> `;
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  getQuestionComments(request);
};

/*= =====================================================
                    // Top Question Feed Table
====================================================== */
const topFeeds = () => {
  if (localStorage.getItem('userToken') === null) {
    return (window.location.href = '../login.html');
  }

  const url = `${baseUrl}/questions/topfeed`;
  const request = get(url);
  const getTopFeed = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      let all = '';
      if (data.data === 'Empty Resource') {
        return (document.getElementById('upcoming_table').innerHTML = `<caption>
        <h2>Top Questions Feed</h2> 
      </caption>
      <tr >
        <th>Questions</th>
        <th>Vote</th>
        <th>Meetups</th>
        <th>Date</th>
      </tr> 
          <h1>Empty Feeds</h1>`);
      }
      data.data.forEach((x) => {
        const happening = new Date(Date.parse(x.happeningon)).toLocaleString();
        first = ` <tr>
        <td>${x.title}</td>
        <td>${x.votes}</td>
        <td>${x.topic}</td>
        <td>${happening}</td>
        </tr>`;
        all += first;
      });
      document.getElementById('upcoming_table').innerHTML += `<caption>
      <h2>Top Questions Feed</h2> 
    </caption>
    <tr >
    <th>Questions</th>
    <th>Vote</th>
    <th>Meetups</th>
    <th>Date</th>
    </tr> 
    ${all}`;
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  getTopFeed(request);
};

const userStatistic = () => {
  const url = `${baseUrl}/meetups/user/statistic/`;
  const request = get(url);

  const getUserStatistic = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      document.getElementById('user_question_stats').innerHTML =
        data.data[0].totalQuestions;
      document.getElementById('user_comment_stats').innerHTML =
        data.data[0].totalComments;
      return true;
    } catch (err) {
      throw err;
    }
  };
  getUserStatistic(request);
};

/*= =====================================================
                    // post new Comment
====================================================== */
const createNewComment = () => {
  event.preventDefault();
  notLoggedIn();
  const comment = document.getElementById('commentTextarea').value;
  const question = localStorage.getItem('questionId');
  const data = {
    comment,
    question,
  };

  const url = `${baseUrl}/comments`;
  const request = post(url, data, 'userToken');

  const postComment = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (!response.ok) {
        // console.log(data.error.message);
        // console.log(data.errors[0].msg)
        return response.status;
      }
      if (response.ok) {
        document.getElementById('modalcommentform').reset();
        const date_fix = new Date().toISOString();
        const hap = timeSince(new Date(date_fix));
        const first = `<div class="comment_comments">
        <small><img src="./resources/images/avatar1.png" width="30px" height="30" alt=""></small >
        <div> 
          &nbsp;me&nbsp;&nbsp;${hap}&nbsp;ago 
          <p class="comments_bar" >${comment}</p>
          </div>
        </div>`;
        document.querySelector('.modal-comment').innerHTML += first;
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  setTimeout(() => postComment(request), 3000);
};

/*= =====================================================
                    // Admin Sign-in
====================================================== */
const adminSignin = () => {
  event.preventDefault();
  document.getElementById('cs-loader').removeAttribute('hidden', 'true');
  const email = document.getElementById('email').value;
  const password = document.getElementById('pw').value;
  const data = {
    email,
    password,
  };
  const url = `${baseUrl}/auth/admin`;
  const request = post(url, data, 'adminToken');

  const postAdminSignin = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (response.ok) {
        document.getElementById('alert').classList.toggle('icon');
        document.getElementById('success').innerHTML = 'Login Successful';
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 2000);
        localStorage.setItem('adminToken', data.data[0].token);
        return response.status;
      }
      document.getElementById('alert').classList.toggle('icon');
      document.getElementById('danger').innerHTML = data.error;
      document.getElementById('cs-loader').setAttribute('hidden', 'false');
      return response.status;
    } catch (err) {
      document.getElementById('cs-loader').setAttribute('hidden', 'false');
      throw err;
    }
  };
  postAdminSignin(request);
};
const loadAllMeetupAdmin = () => {
  if (localStorage.getItem('adminToken') === null) {
    return (window.location.href = 'login.html');
  }

  const url = `${baseUrl}/meetups`;
  const request = get(url);
  const getAllMeetUp = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      let all = '';
      if (data.error === 'No Meetups Exist') {
        return (document.getElementById(
          'admin_all_meetups'
        ).innerHTML = `<caption>
        <h3>MEETUPS</h3>
      </caption>
      <tr>
        <th>Meetups</th>
        <th>Delete</th>
      </tr>
          <h1>No Available Questions</h1>`);
      }
      data.data.forEach((x) => {
        const first = `<tr>
        <td>${x.topic}</td>
        <td><button onclick="return deleteMeetup(${x.id})">DELETE</button></td>
      </tr>`;
        all += first;
      });
      const main = (document.getElementById(
        'admin_all_meetups'
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
  };

  getAllMeetUp(request);
};

/*= =====================================================
                    // meetup post by admin
====================================================== */
const newMeetup = () => {
  checkAdminLogin();
  const postMeetup = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      if (response.ok) {
        window.location.reload(true);
        return response.status;
      }
      return response.status;
    } catch (err) {
      throw err;
    }
  };

  event.preventDefault();
  const topic = document.getElementById('new_meetup-name').value;
  const location = document.getElementById('new_location').value;
  const happeningOn = document.getElementById('new_happeningon').value;
  const data = {
    topic,
    location,
    happeningOn,
  };
  const url = `${baseUrl}/meetups`;
  const request = post(url, data, 'adminToken');
  postMeetup(request);
};

/*= =====================================================
                    // delete meetup
====================================================== */
const deleteMeetup = (id) => {
  checkAdminLogin();
  const delMeetup = async (payLoad) => {
    try {
      const response = await fetch(payLoad);
      const data = await response.json();
      location.reload();
      return response.status;
    } catch (err) {
      throw err;
    }
  };
  const url = `${baseUrl}/meetups/${id}`;
  const request = new Request(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      tokens: localStorage.getItem('adminToken'),
    },
  });
  delMeetup(request);
};
