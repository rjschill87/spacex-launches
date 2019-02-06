import React, { useState, useEffect } from 'react';
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://pb3c6uzk5zhrzbcuhssogcpq74.appsync-api.us-east-1.amazonaws.com/graphql', {
  headers: {
    'x-api-key': 'da2-tadwcysgfbgzrjsfmuf7t4huui'
  }
});

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

function CommentList({ comments }) {
  return (
    <div className="card-body">
      <ul className="user-timeline user-timeline-compact">
        {comments.map(comment => {
          const description = parseCommentForHTML(comment.body)
          const date = formatDate(comment.date);
          return (
            <li key={comment.id} className="latest">
              <div className="user-timeline-date">{date}</div>
              <div className="user-timeline-title">{comment.author}</div>
              <div className="user-timeline-description">{description}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Comments({ flightNumber }) {
  const [state, setState] = useState({ loading: true });

  const query = `{
    launchCommentsByFlightNumber(flightNumber: ${parseInt(flightNumber)}) {
      items {
        author
        body
        date
        flightNumber
        id
      }
    }
  }`;

  useEffect(() => {
    client.request(query).then(
      data => {
        setState({
          comments: data.launchCommentsByFlightNumber.items,
          loading: false
        });
      },
      err => {
        console.error('>>> err', err);
      }
    );
  }, [query]);

  return(
    <div>
      {!state.loading && (
        <div className="card">
          <div className="card-header">Comments</div>
          {state.comments.length === 0 ? <div className="card-body">No comments found.</div> : <CommentList comments={state.comments} />}
        </div>
      )}
    </div>
  );
}