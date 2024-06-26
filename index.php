<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebDevGroupProject</title>
    <link rel="stylesheet" type="text/css" href="./content/style.css"></link>
    <script src="content/script.js"></script>
</head>
<body>
    <div id="home-container">
    <div id="home-content">
    <img id="header-logo" src="./content/img/logo-color_aid.png" alt="image of Color Aid logo">
    <div class="navbar">
        <ul>
            <li><a href="./content/colorCoordinationGen.html">Color Coordination Generator</a></li>
            <li><a href="./content/colorSelection.html">Color Selection</a></li>
            <li><a href="./content/about.html">About</a></li>
        </ul>
    </div>
    <div id="welcomeBlurb" class="float_left p_dText_lBack">
        <h1 class="title">Investigate Color.<br>Increase Confidence.<br>Inspire Creativity.</h1>

        <p>Color Aid is an online tool to practice color identification and discrimination or simply to play around with pixel art.</p>

        <ul>
            <li>Many options:
                <ul>
                    <li>Choose from up to ten unique colors</li>
                    <li>Coordinate grid can be a variety of sizes</li>
                </ul>
            </li>
            <li>User friendly. View your work effortlessly before printing.</li>
            <li>No payment required. Color Aid provides a free, easily accessbile tool.</li>
        </ul>

        <button id="toGenBtn" class="btn centered" onclick="window.location.href='./content/colorCoordinationGen.html';">Test it out!</button>
    </div>
    <img id="ex-pic" src="./content/img/example.png" alt="image of color coordination generator in use" class="float_right">

    </div>

    <footer class="p_dText_lBack">
        <p>Color Aid Company<br>
            Quintin Pavilonis - Kade Engle - Chase Wagner
        </p>
    </footer>
</div>
</body>
</html>