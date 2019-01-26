jQuery.ajaxSetup({async:false});

schedule = [{name: 'Safeway Open', date: new Date(Date.parse('10-4-2018')), tournament_id: '464'},
  {name: 'CIMB Classic', date: new Date(Date.parse('10-11-2018')), tournament_id: '494'},
  {name: 'THE CJ CUP', date: new Date(Date.parse('10-18-2018')), tournament_id: '521'},
  {name: 'Sanderson Farms Championship', date: new Date(Date.parse('10-25-2018')), tournament_id: '054'},
  {name: 'WGC-HSBC Champions', date: new Date(Date.parse('10-25-2018')), tournament_id: '489'},
  {name: 'Shriners Hospitals for Child', date: new Date(Date.parse('11-1-2018')), tournament_id: '047'},
  {name: 'Mayakoba Golf Classic', date: new Date(Date.parse('11-8-2018')), tournament_id: '457'},
  {name: 'The RSM Classic', date: new Date(Date.parse('11-15-2018')), tournament_id: '493'},
  {name: 'World Cup', date: new Date(Date.parse('11-22-2018')), tournament_id: '169'},
  {name: 'World Challenge', date: new Date(Date.parse('11-29-2018')), tournament_id: '478'},
  {name: 'QBE Shootout', date: new Date(Date.parse('12-7-2018')), tournament_id: '058'},
  {name: 'Sentry T of C', date: new Date(Date.parse('01-3-2019')), tournament_id: '016'},
  {name: 'Sony Open in Hawaii', date: new Date(Date.parse('01-10-2019')), tournament_id: '006'},
  {name: 'CareerBuilder', date: new Date(Date.parse('01-17-2019')), tournament_id: '002'},
  {name: 'Farmers Insurance Open', date: new Date(Date.parse('01-24-2019')), tournament_id: '004'},
  {name: 'Phoenix Open', date: new Date(Date.parse('01-31-2019')), tournament_id: '003'},
  {name: 'AT&T Pebble Beach', date: new Date(Date.parse('02-7-2019')), tournament_id: '005'},
  {name: 'Genesis Open', date: new Date(Date.parse('02-14-2019')), tournament_id: '007'},
  {name: 'Puerto Rico', date: new Date(Date.parse('02-21-2019')), tournament_id: '483'},
  {name: 'WGC-Mexico Championship', date: new Date(Date.parse('02-21-2019')), tournament_id: '473'},
  {name: 'The Honda Classic', date: new Date(Date.parse('02-28-2019')), tournament_id: '010'},
  {name: 'Arnold Palmer Invt`l', date: new Date(Date.parse('03-7-2019')), tournament_id: '009'},
  {name: 'THE PLAYERS Championship', date: new Date(Date.parse('03-14-2019')), tournament_id: '011'},
  {name: 'Valspar Champ', date: new Date(Date.parse('03-21-2019')), tournament_id: '475'},
  {name: 'Puntacana', date: new Date(Date.parse('03-28-2019')), tournament_id: '522'},
  {name: 'WGC-Match Play', date: new Date(Date.parse('03-27-2019')), tournament_id: '470'},
  {name: 'Valero Texas Open', date: new Date(Date.parse('04-4-2019')), tournament_id: '041'},
  {name: 'Masters Tournament', date: new Date(Date.parse('04-11-2019')), tournament_id: '014'},
  {name: 'RBC Heritage', date: new Date(Date.parse('04-18-2019')), tournament_id: '012'},
  {name: 'Zurich Classic', date: new Date(Date.parse('04-25-2019')), tournament_id: '018'},
  {name: 'Wells Fargo Championship', date: new Date(Date.parse('05-2-2019')), tournament_id: '480'},
  {name: 'AT&T Byron Nelson', date: new Date(Date.parse('05-9-2019')), tournament_id: '019'},
  {name: 'PGA Championship', date: new Date(Date.parse('05-16-2019')), tournament_id: '033'},
  {name: 'Fort Worth Invt', date: new Date(Date.parse('05-23-2019')), tournament_id: '021'},
  {name: 'the Memorial Tournament', date: new Date(Date.parse('05-30-2019')), tournament_id: '023'},
  {name: 'RBC Canadian Open', date: new Date(Date.parse('06-6-2019')), tournament_id: '032'},
  {name: 'U.S. Open', date: new Date(Date.parse('06-13-2019')), tournament_id: '026'},
  {name: 'Travelers Championship', date: new Date(Date.parse('06-20-2019')), tournament_id: '034'},
  {name: 'Rocket Mortgage Classic', date: new Date(Date.parse('06-27-2019')), tournament_id: '524'},
  {name: '3M Open', date: new Date(Date.parse('07-4-2019')), tournament_id: '525'},
  {name: 'John Deere Classic', date: new Date(Date.parse('07-11-2019')), tournament_id: '030'},
  {name: 'Barbasol Champ', date: new Date(Date.parse('07-18-2019')), tournament_id: '518'},
  {name: 'The Open', date: new Date(Date.parse('07-18-2019')), tournament_id: '100'},
  {name: 'WGC-FedEx St Jude Invit`l', date: new Date(Date.parse('07-25-2019')), tournament_id: '476'},
  {name: 'Barracuda Championship', date: new Date(Date.parse('07-25-2019')), tournament_id: '472'},
  {name: 'Wyndham Championship', date: new Date(Date.parse('08-1-2019')), tournament_id: '013'},
  {name: 'NORTHERN TRUST', date: new Date(Date.parse('08-8-2019')), tournament_id: '027'},
  {name: 'BMW Championship', date: new Date(Date.parse('08-15-2019')), tournament_id: '028'},
  {name: 'TOUR Championship', date: new Date(Date.parse('08-22-2019')), tournament_id: '060'},
];

var today = new Date();
tourneysBeforeToday = schedule.filter(event => event.date.setHours(0,0,0,0) <= today.setHours(0,0,0,0));;
tourneysAfterToday = schedule.filter(event => event.date.setHours(0,0,0,0) >= today.setHours(0,0,0,0));;

relevantTourney = {};

relevantTourney = tourneysBeforeToday.slice(-1)[0];  

teams = {
  "We Are Groot! (Brent Valenti)": [{name: "Xander Schauffele", id: "48081"},{name: "Brian Harman", id: "27644"},{name: "Chesson Hadley", id: "34563"},{name: "Beau Hossler", id: "35461"},{name: "Andrew Putnam", id: "34256"},{name: "Peter Uihlein", id: "29484"},{name: "Abraham Ancer", id: "45526"},{name: "Talor Gooch", id: "46402"}],
  "The Rookie 2.0 (Hillman)": [{name: "Tiger Woods", id: "08793"},{name: "Paul Casey", id: "25364"},{name: "Zach Johnson", id: "24024"},{name: "Ángel Cabrera", id: "20848"},{name: "Jerry Kelly", id: "08075"},{name: "Geoff Ogilvy", id: "22046"},{name: "Hunter Mahan", id: "24781"},{name: "Matt Every", id: "28307"}],
  "Indecision (Spiro)": [{name: "Dustin Johnson", id: "30925"},{name: "Tommy Fleetwood", id: "30911"},{name: "Peter Uihlein", id: "29484"},{name: "Cameron Davis", id: "45157"},{name: "Cameron Champ", id: "52372"},{name: "Sam Burns", id: "47504"},{name: "Kramer Hickok", id: "49298"},{name: "Wyndham Clark", id: "51766"}],
  "Fig`s Newtons (Figler)": [{name: "Bryson DeChambeau", id: "47959"},{name: "Aaron Wise", id: "49964"},{name: "Martin Kaymer", id: "27408"},{name: "Abraham Ancer", id: "45526"},{name: "Keegan Bradley", id: "33141"},{name: "Ted Potter, Jr.", id: "27556"},{name: "Kramer Hickok", id: "49298"},{name: "Cameron Champ", id: "52372"}],
  "Team Ole (Andrew Olson)": [{name: "Tony Finau", id: "29725"},{name: "Xander Schauffele", id: "48081"},{name: "Tommy Fleetwood", id: "30911"},{name: "Beau Hossler", id: "35461"},{name: "Cameron Champ", id: "52372"},{name: "Kramer Hickok", id: "49298"},{name: "Corey Conners", id: "39997"},{name: "Talor Gooch", id: "46402"}],
  "Nate`s Great 8 (Nielsen)": [{name: "Andrew Landry", id: "33410"},{name: "Andrew Putnam", id: "34256"},{name: "Beau Hossler", id: "35461"},{name: "Chesson Hadley", id: "34563"},{name: "Jordan Spieth", id: "34046"},{name: "Kramer Hickok", id: "49298"},{name: "Sam Burns", id: "47504"},{name: "Sam Ryder", id: "37275"}],
  "FL00R S3TT3RS REVENGE (Andrae)": [{name: "Francesco Molinari", id: "25198"},{name: "Chez Reavie", id: "26476"},{name: "Tyrrell Hatton", id: "34363"},{name: "Austin Cook", id: "46435"},{name: "Beau Hossler", id: "35461"},{name: "Kelly Kraft", id: "35879"},{name: "Sam Saunders", id: "29223"},{name: "Stephan Jaeger", id: "36799"}],
  "Quiet Storm (Barnes)": [{name: "Tiger Woods", id: "08793"},{name: "Patrick Cantlay", id: "35450"},{name: "Chez Reavie", id: "26476"},{name: "Beau Hossler", id: "35461"},{name: "Andrew Putnam", id: "34256"},{name: "Matt Every", id: "28307"},{name: "Stephan Jaeger", id: "36799"},{name: "Talor Gooch", id: "46402"}],
  "Clevelunder Par (Fred McLeod)": [{name: "Tiger Woods", id: "08793"},{name: "Tony Finau", id: "29725"},{name: "Beau Hossler", id: "35461"},{name: "Keith Mitchell", id: "39546"},{name: "Abraham Ancer", id: "45526"},{name: "Seamus Power", id: "28252"},{name: "Sam Ryder", id: "37275"},{name: "Talor Gooch", id: "46402"}],
  "Three Putt (Pauly)": [{name: "Rickie Fowler", id: "32102"},{name: "Tony Finau", id: "29725"},{name: "Jamie Lovemark", id: "29461"},{name: "Sungjae Im", id: "39971"},{name: "Cameron Champ", id: "52372"},{name: "Anders Albertson", id: "49303"},{name: "Sam Burns", id: "47504"},{name: "Kramer Hickok", id: "49298"}],
  "Tink Floyd (Dan Tinklenberg": [{name: "Kevin Kisner", id: "29478"},{name: "Gary Woodland", id: "31323"},{name: "Patrick Cantlay", id: "35450"},{name: "Andrew Landry", id: "33410"},{name: "Camilo Villegas", id: "27770"},{name: "Seamus Power", id: "28252"},{name: "Scott Langley", id: "34261"},{name: "Geoff Ogilvy", id: "22046"}],
  "Smails` Paralegals (Tink #2)": [{name: "Tony Finau", id: "29725"},{name: "Tommy Fleetwood", id: "30911"},{name: "Patrick Cantlay", id: "35450"},{name: "Tyrrell Hatton", id: "34363"},{name: "Sungjae Im", id: "39971"},{name: "Sam Burns", id: "47504"},{name: "Dylan Frittelli", id: "29970"},{name: "Ben Silverman", id: "39327"}],
  "Kings/Essex County (Koby + Will Harrison)": [{name: "Tony Finau", id: "29725"},{name: "Patton Kizzire", id: "32757"},{name: "Chesson Hadley", id: "34563"},{name: "Andrew Landry", id: "33410"},{name: "Austin Cook", id: "46435"},{name: "Andrew Putnam", id: "34256"},{name: "Wyndham Clark", id: "51766"},{name: "Talor Gooch", id: "46402"}],
  "Easy Ed (Ed Kordel)": [{name: "Alex Prugh", id: "30946"},{name: "Sam Ryder", id: "37275"},{name: "Hunter Mahan", id: "24781"},{name: "J.T. Poston", id: "49771"},{name: "Peter Uihlein", id: "29484"},{name: "Ryan Armour", id: "19803"},{name: "Joaquin Niemann", id: "45486"},{name: "Justin Thomas", id: "33448"}],
  "Optimistic Eight (Joe G)": [{name: "Tiger Woods", id: "08793"},{name: "Si Woo Kim", id: "37455"},{name: "Byeong Hun An", id: "33948"},{name: "Thomas Pieters", id: "33293"},{name: "Sungjae Im", id: "39971"},{name: "Denny McCarthy", id: "47993"},{name: "Kyoung-Hoon Lee", id: "32791"},{name: "Jim Knous", id: "36852"}],
  "Power Fade (Rosneck)": [{name: "Justin Thomas", id: "33448"},{name: "Aaron Wise", id: "49964"},{name: "Beau Hossler", id: "35461"},{name: "Peter Uihlein", id: "29484"},{name: "Sungjae Im", id: "39971"},{name: "Hunter Mahan", id: "24781"},{name: "Sam Burns", id: "47504"},{name: "Dylan Frittelli", id: "29970"}],
  "Team Loyalty Spiders (Big Dan)": [{name: "Brooks Koepka", id: "36689"},{name: "Webb Simpson", id: "29221"},{name: "Aaron Wise", id: "49964"},{name: "Tyler Duncan", id: "45609"},{name: "Ben Silverman", id: "39327"},{name: "Matt Every", id: "28307"},{name: "Brendon de Jonge", id: "23638"},{name: "Talor Gooch", id: "46402"}],
  "Team HDMI (Joe Frietchen)": [{name: "Ollie Schniederjans", id: "46501"},{name: "Abraham Ancer", id: "45526"},{name: "Peter Uihlein", id: "29484"},{name: "Austin Cook", id: "46435"},{name: "Beau Hossler", id: "35461"},{name: "Aaron Wise", id: "49964"},{name: "Byeong Hun An", id: "33948"},{name: "Patrick Cantlay", id: "35450"}],
  "White Rascal (Cobra)": [{name: "Hideki Matsuyama", id: "32839"},{name: "Patrick Cantlay", id: "35450"},{name: "Cameron Smith", id: "35891"},{name: "Sungjae Im", id: "39971"},{name: "Denny McCarthy", id: "47993"},{name: "Cody Gribble", id: "39954"},{name: "Cameron Davis", id: "45157"},{name: "Sam Burns", id: "47504"}],
  "Team Wally (Chris Bergstrom)": [{name: "Tony Finau", id: "29725"},{name: "Tommy Fleetwood", id: "30911"},{name: "Alex Noren", id: "27349"},{name: "Beau Hossler", id: "35461"},{name: "Sam Burns", id: "47504"},{name: "Nick Watney", id: "27095"},{name: "Sangmoon Bae", id: "28259"},{name: "Hunter Mahan", id: "24781"}],
  "Ty Webb`s Blindfolded Team (Trey Platt)": [{name: "Tony Finau", id: "29725"},{name: "Luke List", id: "27129"},{name: "Andrew Landry", id: "33410"},{name: "Brian Gay", id: "19846"},{name: "Austin Cook", id: "46435"},{name: "Kevin Streelman", id: "27214"},{name: "Andrew Putnam", id: "34256"},{name: "Matt Every", id: "28307"}],
  "Miles of Mistakes (Schaefer)": [{name: "Jordan Spieth", id: "34046"},{name: "Jon Rahm", id: "46970"},{name: "Richy Werenski", id: "47128"},{name: "Julian Suri", id: "45478"},{name: "Cameron Champ", id: "52372"},{name: "Kramer Hickok", id: "49298"},{name: "Max Homa", id: "39977"},{name: "Stephan Jaeger", id: "36799"}],
  "Provo`s Putt Putters": [{name: "Tony Finau", id: "29725"},{name: "Xander Schauffele", id: "48081"},{name: "Cameron Smith", id: "35891"},{name: "Beau Hossler", id: "35461"},{name: "Sungjae Im", id: "39971"},{name: "Sam Burns", id: "47504"},{name: "Dylan Frittelli", id: "29970"},{name: "Brandon Hagy", id: "46550"}],
  "Hawks Swoop (Rob Griffin)": [{name: "Bryson DeChambeau", id: "47959"},{name: "Francesco Molinari", id: "25198"},{name: "Joaquin Niemann", id: "45486"},{name: "David Lingmerth", id: "34409"},{name: "Sungjae Im", id: "39971"},{name: "Sebastián Muñoz", id: "48822"},{name: "Alex Prugh", id: "30946"},{name: "Stephan Jaeger", id: "36799"}],
  "The Eyes of Texas are Upon White Pants (Trent #2)": [{name: "Jordan Spieth", id: "34046"},{name: "Rory McIlroy", id: "28237"},{name: "Sam Burns", id: "47504"},{name: "Cameron Champ", id: "52372"},{name: "Curtis Luck", id: "37380"},{name: "Kramer Hickok", id: "49298"},{name: "Dylan Frittelli", id: "29970"},{name: "Colt Knost", id: "30711"}],
  "Pony Loyalty Express (Trent #1)": [{name: "Bryson DeChambeau", id: "47959"},{name: "Aaron Wise", id: "49964"},{name: "Kelly Kraft", id: "35879"},{name: "Beau Hossler", id: "35461"},{name: "Andrew Putnam", id: "34256"},{name: "Peter Uihlein", id: "29484"},{name: "Sungjae Im", id: "39971"},{name: "Cameron Davis", id: "45157"}],
  "877 CASH NOW (Hartman)": [{name: "C.T. Pan", id: "29908"},{name: "Abraham Ancer", id: "45526"},{name: "Scott Brown", id: "29479"},{name: "Chesson Hadley", id: "34563"},{name: "Patrick Reed", id: "34360"},{name: "Nick Taylor", id: "25493"},{name: "Ollie Schniederjans", id: "46501"},{name: "Richy Werenski", id: "47128"}],
  "Light Projector (DV)": [{name: "Jason Day", id: "28089"},{name: "Tommy Fleetwood", id: "30911"},{name: "Abraham Ancer", id: "45526"},{name: "Richy Werenski", id: "47128"},{name: "Tom Hoge", id: "35532"},{name: "Sungjae Im", id: "39971"},{name: "Cameron Davis", id: "45157"},{name: "Cameron Champ", id: "52372"}],
  "Decanted Rosé (Meredith)": [{name: "Justin Rose", id: "22405"},{name: "Francesco Molinari", id: "25198"},{name: "Chesson Hadley", id: "34563"},{name: "Chase Wright", id: "37340"},{name: "Seamus Power", id: "28252"},{name: "Dylan Frittelli", id: "29970"},{name: "Dominic Bozzelli", id: "40009"},{name: "Corey Conners", id: "39997"}],
  "Thunder from Down Under (Alex Moore)": [{name: "Bryson DeChambeau", id: "47959"},{name: "Tommy Fleetwood", id: "30911"},{name: "Chesson Hadley", id: "34563"},{name: "Ollie Schniederjans", id: "46501"},{name: "Ben Martin", id: "33413"},{name: "Matt Jones", id: "26300"},{name: "Cameron Davis", id: "45157"},{name: "Stephan Jaeger", id: "36799"}],
  "Second to Joaquin (Rafa)": [{name: "Tiger Woods", id: "08793"},{name: "Joaquin Niemann", id: "45486"},{name: "Sungjae Im", id: "39971"},{name: "Denny McCarthy", id: "47993"},{name: "Andrew Landry", id: "33410"},{name: "Aaron Wise", id: "49964"},{name: "Abraham Ancer", id: "45526"},{name: "Anders Albertson", id: "49303"}],
  "Sonoma`s Stompers (Griff #1)": [{name: "Xander Schauffele", id: "48081"},{name: "Tommy Fleetwood", id: "30911"},{name: "Emiliano Grillo", id: "31646"},{name: "Patrick Cantlay", id: "35450"},{name: "Curtis Luck", id: "37380"},{name: "Tyler Duncan", id: "45609"},{name: "Brandon Hagy", id: "46550"},{name: "Kevin Stadler", id: "26679"}],
  "Splashing the Pot (Griff #2)": [{name: "Patrick Cantlay", id: "35450"},{name: "Aaron Wise", id: "49964"},{name: "Joaquin Niemann", id: "45486"},{name: "J.J. Spaun", id: "39324"},{name: "Tyrrell Hatton", id: "34363"},{name: "Beau Hossler", id: "35461"},{name: "Kevin Tway", id: "32333"},{name: "Abraham Ancer", id: "45526"}],
  "Clark Bars (Mike Clark)": [{name: "Hideki Matsuyama", id: "32839"},{name: "Byeong Hun An", id: "33948"},{name: "Aaron Wise", id: "49964"},{name: "Beau Hossler", id: "35461"},{name: "Peter Uihlein", id: "29484"},{name: "Sangmoon Bae", id: "28259"},{name: "Cameron Champ", id: "52372"},{name: "Sam Burns", id: "47504"}],
  "WPGA (Colleen)": [{name: "Justin Thomas", id: "33448"},{name: "Patrick Cantlay", id: "35450"},{name: "Ollie Schniederjans", id: "46501"},{name: "Abraham Ancer", id: "45526"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Haotong Li", id: "35296"},{name: "Ben Silverman", id: "39327"},{name: "Stephan Jaeger", id: "36799"}],
  "The 1 Irons (Sevic)": [{name: "Brandt Snedeker", id: "27649"},{name: "Zach Johnson", id: "24024"},{name: "Patrick Cantlay", id: "35450"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Peter Uihlein", id: "29484"},{name: "Andrew Putnam", id: "34256"},{name: "Shawn Stefani", id: "33418"},{name: "Sam Burns", id: "47504"}],
  "Carolina Fairways (BJ)": [{name: "Rory McIlroy", id: "28237"},{name: "Tiger Woods", id: "08793"},{name: "Harold Varner III", id: "37189"},{name: "Michael Kim", id: "39975"},{name: "Talor Gooch", id: "46402"},{name: "Matt Every", id: "28307"},{name: "Geoff Ogilvy", id: "22046"},{name: "Zecheng Dou", id: "37338"}],
  "No Loyalty (Dombrowski)": [{name: "Tony Finau", id: "29725"},{name: "Brandt Snedeker", id: "27649"},{name: "Luke List", id: "27129"},{name: "Beau Hossler", id: "35461"},{name: "Sangmoon Bae", id: "28259"},{name: "Bronson Burgoon", id: "29268"},{name: "Sungjae Im", id: "39971"},{name: "Hunter Mahan", id: "24781"}],
  "Asian Tiger Returns feat. the soy sauce Kuma (UK)": [{name: "Tiger Woods", id: "08793"},{name: "Hideki Matsuyama", id: "32839"},{name: "C.T. Pan", id: "29908"},{name: "Sangmoon Bae", id: "28259"},{name: "K.J. Choi", id: "24357"},{name: "Kyoung-Hoon Lee", id: "32791"},{name: "Hiroshi Iwata", id: "27747"},{name: "Zecheng Dou", id: "37338"}],
  "Numbers Don`t Lie (Nichols)": [{name: "Francesco Molinari", id: "25198"},{name: "Tommy Fleetwood", id: "30911"},{name: "Alex Noren", id: "27349"},{name: "Tyrrell Hatton", id: "34363"},{name: "Kiradech Aphibarnrat", id: "30978"},{name: "Abraham Ancer", id: "45526"},{name: "Sungjae Im", id: "39971"},{name: "Sam Burns", id: "47504"}],
  "Ebony and Ivory (Nance #1)": [{name: "Tiger Woods", id: "08793"},{name: "Henrik Stenson", id: "21528"},{name: "Ian Poulter", id: "24138"},{name: "Wesley Bryan", id: "48084"},{name: "Jerry Kelly", id: "08075"},{name: "Brendon Todd", id: "30927"},{name: "Greg Owen", id: "20691"},{name: "Matt Every", id: "28307"}],
  "Half and Half (Nance #2)": [{name: "Sergio Garcia", id: "21209"},{name: "Jimmy Walker", id: "25632"},{name: "Patrick Cantlay", id: "35450"},{name: "Jim Furyk", id: "10809"},{name: "Danny Lee", id: "29926"},{name: "Robert Streb", id: "34431"},{name: "Tim Wilkinson", id: "25349"},{name: "Tyler Aldridge", id: "29745"}]
};

//Spiro replacement

function getRedSoxRecord() {
  
  today = new Date().toISOString().slice(0,10);
  lastUpdated = "";
  record = "";

  $.get("https://api.keyvalue.xyz/94d2fdac/redSoxRecordCleGolfLastUpdated", function(data) {
    lastUpdated = data.trim();
    if (today == lastUpdated)
    {
      $.get("https://api.keyvalue.xyz/78a47776/redSoxRecordCleGolf", function(data) {
        record = data.trim();
        console.log("No need to update! The record is " + record);
      });
      
    }
    else
    {
      console.log("Need to update!");

      $.getJSON('http://anyorigin.com/go?url=https%3A//www.baseball-reference.com/teams/BOS/2018.shtml&callback=?', function(data){
      
        blob = data.contents.substring(data.contents.search("<strong>Record:</strong>"), data.contents.search("<strong>Record:</strong>")+50);
        blob = blob.substring(0, blob.search(","));
        blob = blob.replace("<strong>Record:</strong>", "").trim()
        $.post("https://api.keyvalue.xyz/78a47776/redSoxRecordCleGolf/" + blob);
        $.post("https://api.keyvalue.xyz/94d2fdac/redSoxRecordCleGolfLastUpdated/" + today);
        record = blob;
      });

    }
    
    })
    return record;
}






var processedTeams = Object.keys(teams).map(function(team) {
  return {teamName: team, playerNamesAndIds: teams[team], players: []}
});






// On ready do the magic!
$(function() {
  checkForData();
  window.setInterval(function(){
    checkForData();
  }, 30000);

});


function SortByTeamTotal(a, b){
  return ((a.teamTotal.value() > b.teamTotal.value()) ? -1 : ((a.teamTotal.value() < b.teamTotal.value()) ? 1 : 0));
}


function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
// JSON stuff

currentData = {};



function checkForData() {
  


  $.getJSON("https://statdata.pgatour.com/r/" + relevantTourney.tournament_id + "/2019/leaderboard-v2.json", function( data ) {


    if (! _.isEqual(data, currentData))
    {
      $(".tournament-name").html("");
      $(".panel-group").html("");
      currentData = data;
      players = [];

      $.each( processedTeams, function(i, team){
          team.players = [];
          team.teamTotal = null;
      })
      // put the players' data into a local array of objects

      $.each( data.leaderboard.players, function( i, player ){
        //console.log(player.player_bio.first_name + ' ' + player.player_bio.last_name);
        console.log(player);
        players.push(
            {
              name: player.player_bio.first_name + ' ' + player.player_bio.last_name,
              positionNum: parseInt(player.current_position.replace(/\D/g,'')),
              position: player.current_position,
              proj_money: numeral(player.rankings.projected_money_event),
              today: player.today,
              thru: player.thru,
              total: player.total,
              player_id: player.player_id
            }
          );
      });
      
      // IF WE HAVE A 2nd TOURNEY PUT IT HERE
      /*
      $.getJSON("https://statdata.pgatour.com/r/054/2019/leaderboard-v2.json", function( dataSanderson ) {

        $.each( dataSanderson.leaderboard.players, function( i, player ){
        //console.log(player.player_bio.first_name + ' ' + player.player_bio.last_name);
        console.log(player);
        players.push(
            {
              name: player.player_bio.first_name + ' ' + player.player_bio.last_name,
              positionNum: parseInt(player.current_position.replace(/\D/g,'')),
              position: player.current_position,
              proj_money: numeral(player.rankings.projected_money_event),
              today: player.today,
              thru: player.thru,
              total: player.total,
              player_id: player.player_id
            }
          );
      });
      
      });
      */



      

      //players.forEach(function(p){ console.log(p.name)});

      //FOR THE MASTERS DO SOME MANUAL MATH
      //calculatePayouts(players);

      $.each(processedTeams, function(i, team) {
        $.each(players, function(j, player) {
          //Name check
          //if (player.name.includes("Byeong"))
          //{
            //debugger;
          //}
          
          playerIds = team.playerNamesAndIds.map(function(p){return p.id});
          
          if (playerIds.includes(player.player_id))
          {
            team.players.push(player);
          }
        });
        sum = 0;
        $.each(team.players, function(j, player) {
          sum += player.proj_money.value();

          if (! player.thru) { player.thru = "" };
          if (player.today === "" || player.today === null)
          {
            player.today = ""
          }
          if (player.today === 0)
          {
            player.today = "E"
          }

          if (player.total == 0)
          {
            player.total = "E"
          }


        });
        team.teamTotal = numeral(sum);
      });

      //Sort

      processedTeams = processedTeams.sort(SortByTeamTotal);
      $.each(processedTeams, function(i, team) {
          htmlString = "<div class='panel panel-default'>"
                    + "<a class='click-track' data-toggle='collapse' href='#collapse" + i+1 + "'>"
                    + "<div class='panel-heading'>"
                    + "<h4 class='panel-title'>"
                    + "<span class='pull-left label label-default'>" + (i+1) + "</span>"
                    + "<span class='team-name'>" + team.teamName
                    //+"(" + (team.players.length - 1) + ")"
                    + "</span>"
                    + "<span class='pull-right label label-default'>" + team.teamTotal.format('$0,0') + "</span>"
                    + "</h4></div></a>"
                    + "<div id='collapse" + i+1 + "' class='panel-collapse collapse'><table class='table-bordered table-condensed'>"
                    + "<thead><tr>"
                    + "<th>Golfer</th>"
                    + "<th>Proj. $</th>"
                    + "<th>Pos</th>"
                    + "<th>Total</th>"
                    + "<th>Today</th>"
                    + "<th>Thru</th>"
                    + "</tr></thead>";

          $.each(team.players, function(index, player) {

            htmlString += "<tr width='100%'>"
                        + "<td>" + player.name + "</td>"
                        + "<td>" + player.proj_money.format('$0,0') + "</td>"
                        + "<td>" + player.position + "</td>"
                        + "<td>" + player.total + "</td>"
                        + "<td>" + player.today + "</td>"
                        + "<td>" + player.thru + "</td>"
                        + "</tr>"

          });
                    //+
                    htmlString+= "</table></ul></div></div>";
          $(".panel-group").append(htmlString);
      });

      $(".tournament-name").append("<h1>" + data.leaderboard.tournament_name + "</h1>");
      //$(".tournament-name").append("<h1>2019 TRENT REDDEN OPEN</h1>");
      

      $(".click-track").click(function(){
          ga('send', 'event', 'Teams', 'Click', $(this).find(".team-name").text());
      });

      //window.redSoxRecord = getRedSoxRecord();
      //$( "span:contains('Spiro')" ).html("Indecision AKA " + window.redSoxRecord + " (Spiro)");
    }
    else
    {
      console.log("Data hasn't changed!");
    }
    $(".error-message").hide();
  }) 
}
