import React from 'react'
import {
    TwitterShareButton,
  } from "react-twitter-embed";

function Footer() {
	return (
		<div style={{textAlign:"center",color:"black"}}>
				Made by Bilal 
				<TwitterShareButton
						url={"https://twitter.com/CDCgov"}
						options={{ text: "Wear a mask and follow CDC guidelines! #staysafe", via: "" }}
				/>
		</div>
	)
}

export default Footer;