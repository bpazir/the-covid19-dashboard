import React from 'react';
import "./Widgets.css";
import {
    TwitterTimelineEmbed,
  } from "react-twitter-embed";

function Widgets() {
    return (
			<div className="widgets">
				<div className="widgets_widgetContainer">
					<TwitterTimelineEmbed
					sourceType="profile"
					screenName="CDCgov"
					options={{ height: 700 }}
					/>
				</div>
			</div>
    )
}

export default Widgets;
