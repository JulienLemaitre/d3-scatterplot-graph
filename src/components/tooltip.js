import React from 'react';

const Tooltip = (props) => {
  if (props.datas) {
    const { Name, Nationality, Time, Year, Doping } = props.datas;

    const show = props.show ? "show" : "hide";
    const showDope = Doping ? "doped" : "no-doped";

    return (
      <div className={`tooltip ${show} ${showDope}`}>
        <div className="identity">
          <div className="name">{Name}</div>
          <div className="nationality">{Nationality}</div>
        </div>
        <div className="perf">
          <div className="time">{Time}</div>
          <div className="year">{Year}</div>
        </div>
        <div className={`dope ${showDope}`}>
          <h4>Doping allegation</h4>
          <div className="story">{Doping}</div>
        </div>
      </div>
    );

  } else {
    return <div className="tooltip"></div>;
  }
};

export default Tooltip;