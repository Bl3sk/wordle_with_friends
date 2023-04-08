import { Link } from "react-router-dom";
import '../styles/aboutStyle.css';

const About = () => {
    return ( 
        <div className="about-page">
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Wordle with friends</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#creators">Creators</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#howToPlay">How to play</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#features">Features</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-5">
                <button type="button" className="btn btn-dark btn-lg mb-5"><Link className="navbar-brand" to="/">Go on Wordle</Link></button>
                <h1 id="creators">Creators</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <h2>Original game</h2>
                        <p>This game was inspired by:</p>
                        <a href="https://www.nytimes.com/games/wordle/index.html">New York times Wordle</a>
                    </div>
                    <div className="col-sm-6">
                        <h2>Developed by</h2>
                        <h5>
                            Patrik Fiala    
                            <a href="https://github.com/Bl3sk"><i class="bi bi-github" style={{fontSize:"1.5rem", padding:"0.2rem"}}></i></a>
                            <a href="https://www.instagram.com/patrik.fiala/"><i class="bi bi-instagram" style={{fontSize:"1.5rem", padding:"0.2rem"}}></i></a>
                        </h5>
                        <p>Used technologies: Mongodb, Express, React, Node.js, Bootstrap</p>
                    </div>
                </div>

                <h1 id="howToPlay">How to play</h1>
                <div className="row">
                    <div className="col-sm-12">
                        <iframe src="https://www.youtube.com/embed/lv4Zg-209MY" title="YouTube video player" frameBorder="0" allowFullScreen></iframe>
                    </div>
                </div>
                
                <h1 id="features">Features</h1>
                <p>Next features will be added soon. I keep working on it.</p>
                <div className="row">
                    <div className="col-sm-4">
                        <h2>Profile overview</h2>
                        <p>On your profile you can see overview of your user info like date, when you registered, your email and total score.</p>
                        <img src={process.env.PUBLIC_URL + '/profile_overview.png'} alt="profile overview"/>
                        <p>Next thing you can find on your profile is Edit. You can change your nickname or change your avatar.</p>
                    </div>
                    
                    <div className="col-sm-4">
                        <h2>Game result</h2>
                        <p>Result modal appears when you guess a word or after 6 unsuccessful attempts. You will see your history of guessing, which you can share with your friends by clicking button Share result </p>
                        <img src={process.env.PUBLIC_URL + '/result.png'} alt="profile overview"/>
                        <p>The fewer attempts you need to guess the word, the more points you get!</p>
                    </div>
                    <div className="col-sm-4">
                        <h2>Leaderboards</h2>
                        <p>In Leaderboards you will find TOP 5 players with highest score.</p>
                        <img src={process.env.PUBLIC_URL + '/leaderboards.png'} alt="profile overview"/>
                        <p>Try your best to get there!</p>
                    </div>
                </div>
            
            </div>

                
            <div className="mt-5 p-4 bg-dark text-white text-center">
                <p>Patrik Fiala</p>
            </div>
        </div>
     );
}
 
export default About;