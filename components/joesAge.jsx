import React, { useState, useEffect } from 'react';
import styles from './joesAge.module.css'; 
import Confetti from 'react-dom-confetti';


function TimeSince() {
    const [timeDifference, setTimeDifference] = useState('');
    const [format, setFormat] = useState('Years')
    const birthDate = new Date('April 14, 1999 19:11:00');
    const [isConfettiActive, setIsConfettiActive] = useState(false);

    function calculateTimeDifference() {
        const currentDate = new Date();
        const difference = currentDate.getTime() - birthDate.getTime();
        let formattedDifference = '';
    
        if (format === 'Years') {
            let years = currentDate.getFullYear() - birthDate.getFullYear();
            let months = currentDate.getMonth() - birthDate.getMonth();
            let days = currentDate.getDate() - birthDate.getDate();
            let hours = currentDate.getHours() - birthDate.getHours();
            let minutes = currentDate.getMinutes() - birthDate.getMinutes();
            let seconds = currentDate.getSeconds() - birthDate.getSeconds();

            if (seconds < 0) {
                seconds += 60;
                minutes--;
            }
            if (minutes < 0) {
                minutes += 60;
                hours--;
            }
            if (hours < 0) {
                hours += 24;
                days--;
            }
            if (days < 0) {
                const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
                days += prevMonthLastDay;
                months--;
            }
            if (months < 0) {
                months += 12;
                years--;
            }
        
            formattedDifference = `${years} YEARS, ${months} MONTHS, ${days} DAYS, ${hours} HOURS, ${minutes} MINUTES, ${seconds} SECONDS`;
        } else if (format === 'Days') {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            formattedDifference = `${days.toLocaleString()} DAYS, ${hours} HOURS, ${minutes} MINUTES, ${seconds} SECONDS`;
        } else if (format === 'Minutes'){
            const minutes = Math.floor(difference / (1000*60)); 
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            formattedDifference = `${minutes.toLocaleString()} MINUTES, ${seconds} SECONDS`;
        } else if (format === 'Seconds') {
            const seconds = Math.round(difference / 1000);
            formattedDifference = `${seconds.toLocaleString()} SECONDS`;
        }
    
        setTimeDifference(formattedDifference);
    }

    const handleMouseEnter = () => {
        setIsConfettiActive(true);
    };

    const handleMouseLeave = () => {
        setIsConfettiActive(false);
    };

    useEffect(() => {
        calculateTimeDifference(); 
        const intervalId = setInterval(() => calculateTimeDifference(), 1000); 
        return () => clearInterval(intervalId);
    }, [timeDifference]); 
    
    

    return (
        <div className='containner' style={{width: '100%'}}>
            <div className='row'>
                <h1 className={styles.heading}>Joseph Nestler is: </h1>
            </div> 
            <div className='row'>
                <div className={styles.hisAge} id="hisAge"
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave}>{timeDifference}
                    <Confetti active={isConfettiActive} config={{spread:180}}/></div>
            </div>
            <div className='row'>
                <div className='col d-flex justify-content-end'>
                    <h1 className={styles.heading}>old. </h1>
                </div>
                <div className='col'>
                    <div className="dropdown">
                        <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {format}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><button className="dropdown-item" onClick={() => setFormat('Years')}>In years</button></li>
                            <li><button className="dropdown-item" onClick={() => setFormat('Days')}>In days</button></li>
                            <li><button className="dropdown-item" onClick={() => setFormat('Minutes')}>In minutes</button></li>
                            <li><button className="dropdown-item" onClick={() => setFormat('Seconds')}>In seconds</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeSince;
