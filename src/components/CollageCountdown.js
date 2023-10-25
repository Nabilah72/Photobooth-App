import React, { useState, useEffect } from "react";
import '../styles/CollageCountdown.css'

  const CollageCountdown = ({ seconds, onTimeout, photoTaken }) => {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    const startCountdown = () => {
      if (count > 0) {
        const timer = setInterval(() => {
          setCount(count - 1);
        }, 1000);

        return () => clearInterval(timer);
      } else {
        if (photoTaken) {
          // Reset the countdown to 5 seconds when it reaches 0 and a photo is taken
          setCount(3);
        }
      }
    };

    if (count > 0 || photoTaken) {
      startCountdown();
    }

  }, [count, onTimeout, photoTaken, seconds]);

  return (
    <div className="colcountdown">{count}</div>
  );
};

export default CollageCountdown;
