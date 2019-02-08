import React, { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';

const query = `query getComments($flightNumber: Int!, $nextToken: String) {
  launchCommentsByFlightNumber(flightNumber: $flightNumber, nextToken: $nextToken) {
    items {
      author
      body
      date
      flightNumber
      id
    }
    nextToken
  }
}
`;

const client = new GraphQLClient('https://pb3c6uzk5zhrzbcuhssogcpq74.appsync-api.us-east-1.amazonaws.com/graphql', {
  headers: {
    'x-api-key': 'da2-tadwcysgfbgzrjsfmuf7t4huui'
  }
});

function queryComments(flightNumber) {
  const [state, setState] = useState({ loading: true });
  const variables = { flightNumber };

  useEffect(() => {
    client.request(query, variables).then(
      data => {
        setState({
          comments: data.launchCommentsByFlightNumber.items,
          nextToken: data.launchCommentsByFlightNumber.nextToken,
          loading: false
        });
      },
      err => {
        console.error('>>> err', err);
      }
    );
  }, []);

  return state;
}


function parseCommentForHTML(body) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(body, 'text/html');
  return dom.body.textContent;
}

function formatDate(date) {
  const dateObj = new Date(date);
  const dateString = dateObj.toUTCString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dateArray = dateString.split(' ');
  return dateArray[4];
}

function Comment({ comment }) {
  const description = parseCommentForHTML(comment.body);
  const date = formatDate(comment.date);
  return (
    <li className="latest">
      <div className="user-timeline-date">{date}</div>
      <div className="user-timeline-title">{comment.author}</div>
      <div className="user-timeline-description">{description}</div>
    </li>
  )
}

function CommentList({ comments, token, flightNumber }) {
  const [comms, updateComments] = useState(comments);
  const [nextToken, updateToken] = useState(token);

  function loadMoreComments(oldComments) {
    const variables = {
      flightNumber,
      nextToken,
    };

    client.request(query, variables).then(
      data => {
        updateComments(oldComments.concat(data.launchCommentsByFlightNumber.items));
        updateToken(data.launchCommentsByFlightNumber.nextToken);
      },
      err => {
        console.error('>>> err', err);
      }
    );
  }

  return (
    <div className="card-body">
      <ul className="user-timeline user-timeline-compact">
        {comms.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </ul>
      {nextToken !== null && (
        <button className="btn btn-space btn-primary" onClick={() => {loadMoreComments(comms)}}>Load More</button>
      )}
    </div>
  );
}

export default function Comments({ flightNumber }) {
  const { comments, loading, nextToken } = queryComments(flightNumber);

  return(
    <div>
      {!loading && (
        <div className="card">
          <div className="card-header">Comments</div>
          {comments.length === 0 ? <div className="card-body">No comments found.</div> : <CommentList comments={comments} token={nextToken} flightNumber={flightNumber} />}
        </div>
      )}
    </div>
  );
}