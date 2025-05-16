import profile from "../assets/PIC.jpg";
function About() {
    return (
        <div className="about" >
             <div className='points'>
                <p>✅<strong> Daily Football News</strong> – Stay updated with the latest happenings in the football world.</p>
                <p>✅<strong> Live Match Updates</strong> – Follow live scores, match highlights, and results.</p>
                <p>✅<strong> Transfer Rumors & Confirmations</strong> – Get the latest on player transfers and deals.</p>
                <p>✅<strong> Expert Analysis & Opinions</strong> – Read in-depth articles from football analysts.</p>
                <p>✅ <strong>Fan Community & Discussions</strong> – Join the conversation and share your views.</p><br />
            </div>  

    <img src ={profile} alt='profile-pic' className="profile-pic" />
            <h6>Created by Manerss,<br /> a passionate football enthusiast<br /> dedicated<b /> to bringing fans closer to <br />the game.</h6>
           
    <p className="styling"><mark>Never miss an update!!</mark></p>
<p>
 Subscribe now and follow us for daily football news and insights. Stay ahead of the game!</p>
</div>
        
    )
}

export default About;