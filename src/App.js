import React from 'react';
import './App.css';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';
import Launch from './components/Launch';

const launchesQuery = `{
  launches(sort: "launch_date_utc", order: "ASC") {
    id
    launch_success
    mission_name
    launch_date_utc
    launch_site {
      site_name
    }
    rocket {
      rocket_name
    }
    links {
      video_link
    }
    details
  }
}`;

const client = new GraphQLClient('https://api.spacex.land/graphql/');

function useGraphQL(query) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    client.request(query).then(
      data => {
        setState({ data, loading: false });
      },
      err => {
        console.error(err);
      }
    );
  }, [query]);

  return state;
}

function Header() {
  return (
    <div className="page-head">
      <h2 className="page-head-title text-center">Space X Launches</h2>
    </div>
  );
}

function Loading() {
  return (
    <div className="progress">
      <div
        className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: '100%' }}
        aria-valuenow="100"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        Loading
      </div>
    </div>
  );
}

function Launches({ launches }) {
  const launchesByDate = launches.reduce((list, launch) => {
    const date = launch.launch_date_utc.slice(0, 4);
    list[date] = list[date] || [];
    list[date].push(launch);
    return list;
  }, {});

  const isEven = number => number % 2 === 0;

  let num = 0;

  return (
    <ul data-testid="launches" className="timeline timeline-variant">
      {Object.keys(launchesByDate).map(launchDate => (
        <span key={launchDate}>
          <li className="timeline-month">{launchDate}</li>
          {launchesByDate[launchDate].map(launch => {
            num++;
            return (
              <Launch key={launch.id} launch={launch} side={isEven(num) ? 'right' : 'left'}/>
            );
          })}
        </span>
      ))}
    </ul>
  );
}

export default function App() {
  const { data, loading } = useGraphQL(launchesQuery);

  return (
    <div>
      <Header />
      {loading ? <Loading /> : <Launches launches={data.launches} />}
    </div>
  );
}
