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
                        <h5>Patrik Fiala</h5>
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
                <div className="row">
                    <div className="col-sm-4">
                        <h2>Profile overview</h2>
                        <p>Some text..</p>
                        <img src={process.env.PUBLIC_URL + '/profile_overview.png'} alt="profile overview"/>
                        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                    </div>
                    
                    <div className="col-sm-4">
                        <h2>Edit profile</h2>
                        <h5>Title description, Sep 2, 2020</h5>
                        <div className="fakeimg">Fake Image</div>
                        <p>Some text..</p>
                        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                    </div>
                    <div className="col-sm-4">
                        <h2>Leaderboards</h2>
                        <h5>Title description, Sep 2, 2020</h5>
                        <div className="fakeimg">Fake Image</div>
                        <p>Some text..</p>
                        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
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