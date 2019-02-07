import React, { useState } from 'react';
import YouTube from 'react-youtube';
import Comments from './Comments';

export default function Launch({ launch, side }) {
  const [videoDisplayed, displayVideo] = useState(false);
  const [commentsDisplayed, displayComments] = useState(false);

  const launchIcon = launch.launch_success ? (
    <i className="icon mdi mdi-rocket" />
  ) : (
    <i className="icon mdi mdi-bomb" />
  );

  const iconType = launch.launch_success ? 'success' :  'failure';

  const getYouTubeVideoID = link => {
    const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/;
    const match = link.match(regExp);
    return match[1];
  }

  function toggleVideo() {
    displayVideo(!videoDisplayed);
  }

  function toggleComments() {
    displayComments(!commentsDisplayed);
  }

  return (
    <li className={`timeline-item timeline-item-detailed ${side}`}>
      <div className={`timeline-content timeline-type file ${iconType}`}>
        <div className="timeline-icon">{launchIcon}</div>
        <div className="timeline-header">
          <span className="timeline-autor">
            #{launch.id}: {launch.mission_name}
          </span>{' '}
          <p className="timeline-activity">
            {launch.rocket.rocket_name} &mdash; {launch.launch_site.site_name}
          </p>
          <span className="timeline-time">{launch.launch_date_utc.slice(0, 10)}</span>
        </div>
        <div className="timeline-summary">
          <p>{launch.details}</p>
          <div>
            <button className="btn btn-space btn-primary" onClick={toggleComments} >
              {commentsDisplayed ? 'Close' : 'View'} Comments
            </button>
            {launch.links.video_link !== null && (
              <button className="btn btn-space btn-primary" onClick={toggleVideo} >
                {videoDisplayed ? 'Close' : 'View'} Video
              </button>
            )}
          </div>
          {videoDisplayed && launch.links.video_link !== null && (
            <YouTube
              videoId={getYouTubeVideoID(launch.links.video_link)}
            />
          )}
          {commentsDisplayed && (
            <Comments key={launch.id} flightNumber={parseInt(launch.id)} />
          )}
        </div>
      </div>
    </li>
  );
}