//window.location.replace("http://cle.golf/football/standings");

jQuery.ajaxSetup({async:false});

schedule = [
  {name: 'A Military Tribute at The Greenbrier', date: new Date(Date.parse('9-12-2019')), tournament_id: '490'},
  {name: 'Sanderson Farms Championship', date: new Date(Date.parse('9-19-2019')), tournament_id: '054'},
  {name: 'Safeway Open', date: new Date(Date.parse('9-26-2019')), tournament_id: '464'},
  {name: 'Shriners Hospitals for Children Open', date: new Date(Date.parse('10-3-2019')), tournament_id: '047'},
  {name: 'Houston Open', date: new Date(Date.parse('10-10-2019')), tournament_id: '020'},
  {name: 'THE CJ CUP @ NINE BRIDGES', date: new Date(Date.parse('10-17-2019')), tournament_id: '521'},
  {name: 'The ZOZO CHAMPIONSHIP', date: new Date(Date.parse('10-24-2019')), tournament_id: '527'},
  {name: 'Bermuda Championship', date: new Date(Date.parse('10-31-2019')), tournament_id: '528'},
  {name: 'World Golf Championships-HSBC Champions', date: new Date(Date.parse('10-31-2019')), tournament_id: '489'},
  {name: 'Mayakoba Golf Classic', date: new Date(Date.parse('11-14-2019')), tournament_id: '457'},
  {name: 'The RSM Classic', date: new Date(Date.parse('11-21-2019')), tournament_id: '493'},
  {name: 'Hero World Challenge', date: new Date(Date.parse('12-4-2019')), tournament_id: '478'},
  {name: 'Presidents Cup', date: new Date(Date.parse('12-12-2019')), tournament_id: '500'},
  {name: 'QBE Shootout', date: new Date(Date.parse('12-13-2019')), tournament_id: '058'},
  {name: 'Sentry Tournament of Champions', date: new Date(Date.parse('1-2-2020')), tournament_id: '016'},
  {name: 'Sony Open in Hawaii', date: new Date(Date.parse('1-9-2020')), tournament_id: '006'},
  {name: 'The American Express', date: new Date(Date.parse('1-16-2020')), tournament_id: '002'},
  {name: 'Farmers Insurance Open', date: new Date(Date.parse('1-23-2020')), tournament_id: '004'},
  {name: 'Waste Management Phoenix Open', date: new Date(Date.parse('1-30-2020')), tournament_id: '003'},
  {name: 'AT&T Pebble Beach Pro-Am', date: new Date(Date.parse('2-6-2020')), tournament_id: '005'},
  {name: 'The Genesis Invitational', date: new Date(Date.parse('2-13-2020')), tournament_id: '007'},
  {name: 'Puerto Rico Open', date: new Date(Date.parse('2-20-2020')), tournament_id: '483'},
  {name: 'World Golf Championships-Mexico Championship', date: new Date(Date.parse('2-20-2020')), tournament_id: '473'},
  {name: 'The Honda Classic', date: new Date(Date.parse('2-27-2020')), tournament_id: '010'},
  {name: 'Arnold Palmer Invitational presented by Mastercard', date: new Date(Date.parse('3-5-2020')), tournament_id: '009'},
  {name: 'THE PLAYERS Championship', date: new Date(Date.parse('3-12-2020')), tournament_id: '011'},
  {name: 'Valspar Championship', date: new Date(Date.parse('3-19-2020')), tournament_id: '475'},
  {name: 'Corales Puntacana Resort & Club Championship', date: new Date(Date.parse('3-26-2020')), tournament_id: '522'},
  {name: 'World Golf Championships-Dell Technologies Match Play', date: new Date(Date.parse('3-26-2020')), tournament_id: '470'},
  {name: 'Valero Texas Open', date: new Date(Date.parse('4-2-2020')), tournament_id: '041'},
  {name: 'Masters Tournament', date: new Date(Date.parse('4-9-2020')), tournament_id: '014'},
  {name: 'RBC Heritage', date: new Date(Date.parse('4-16-2020')), tournament_id: '012'},
  {name: 'Zurich Classic of New Orleans', date: new Date(Date.parse('4-23-2020')), tournament_id: '018'},
  {name: 'Wells Fargo Championship', date: new Date(Date.parse('4-30-2020')), tournament_id: '480'},
  {name: 'AT&T Byron Nelson', date: new Date(Date.parse('5-7-2020')), tournament_id: '019'},
  {name: 'PGA Championship', date: new Date(Date.parse('5-14-2020')), tournament_id: '033'},
  {name: 'Charles Schwab Challenge', date: new Date(Date.parse('5-21-2020')), tournament_id: '021'},
  {name: 'Rocket Mortgage Classic', date: new Date(Date.parse('5-28-2020')), tournament_id: '524'},
  {name: 'the Memorial Tournament presented by Nationwide', date: new Date(Date.parse('6-4-2020')), tournament_id: '023'},
  {name: 'RBC Canadian Open', date: new Date(Date.parse('6-11-2020')), tournament_id: '032'},
  {name: 'U.S. Open', date: new Date(Date.parse('6-18-2020')), tournament_id: '026'},
  {name: 'Travelers Championship', date: new Date(Date.parse('6-25-2020')), tournament_id: '034'},
  {name: 'Barracuda Championship', date: new Date(Date.parse('7-2-2020')), tournament_id: '472'},
  {name: 'World Golf Championships-FedEx St. Jude Invitational', date: new Date(Date.parse('7-2-2020')), tournament_id: '476'},
  {name: 'John Deere Classic', date: new Date(Date.parse('7-9-2020')), tournament_id: '030'},
  {name: 'Barbasol Championship', date: new Date(Date.parse('7-16-2020')), tournament_id: '518'},
  {name: 'The Open Championship', date: new Date(Date.parse('7-16-2020')), tournament_id: '100'},
  {name: '3M Open', date: new Date(Date.parse('7-23-2020')), tournament_id: '525'},
  {name: 'Olympic Men`s Golf Competition', date: new Date(Date.parse('7-30-2020')), tournament_id: '519'},
  {name: 'Wyndham Championship', date: new Date(Date.parse('8-6-2020')), tournament_id: '013'},
  {name: 'THE NORTHERN TRUST', date: new Date(Date.parse('8-13-2020')), tournament_id: '027'},
  {name: 'BMW Championship', date: new Date(Date.parse('8-20-2020')), tournament_id: '028'},
  {name: 'TOUR Championship', date: new Date(Date.parse('8-27-2020')), tournament_id: '060'},

];

var today = new Date();
tourneysBeforeToday = schedule.filter(event => event.date.setHours(0,0,0,0) <= today.setHours(0,0,0,0));;
tourneysAfterToday = schedule.filter(event => event.date.setHours(0,0,0,0) >= today.setHours(0,0,0,0));;

relevantTourneys = [];

relevantTourney = tourneysBeforeToday.slice(-1)[0];  

teams = {
 "Smails` Paralegals (Josh Maus #1)": [{name: "Rory McIlroy", id: "28237"},{name: "Sungjae Im", id: "39971"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Viktor Hovland", id: "46717"},{name: "Joaquin Niemann", id: "45486"},{name: "Kristoffer Ventura", id: "35658"},{name: "Matt Wallace", id: "48887"},{name: "Lucas Bjerregaard", id: "33803"}],
"Josh Maus #2": [{name: "Xander Schauffele", id: "48081"},{name: "Patrick Cantlay", id: "35450"},{name: "Matthew Wolff", id: "56278"},{name: "Scottie Scheffler", id: "46046"},{name: "Eddie Pepperell", id: "34709"},{name: "Maverick McNealy", id: "46442"},{name: "Matt Wallace", id: "48887"},{name: "Bernd Wiesberger", id: "29454"}],
"Marv`s Misfits": [{name: "Rory McIlroy", id: "28237"},{name: "Sungjae Im", id: "39971"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Joaquin Niemann", id: "45486"},{name: "Wyndham Clark", id: "51766"},{name: "Scottie Scheffler", id: "46046"},{name: "Sam Burns", id: "47504"},{name: "Matt Wallace", id: "48887"}],
"Team Ole (Andrew Olson # 1)": [{name: "Xander Schauffele", id: "48081"},{name: "Collin Morikawa", id: "50525"},{name: "Matthew Wolff", id: "56278"},{name: "Viktor Hovland", id: "46717"},{name: "Joaquin Niemann", id: "45486"},{name: "Wyndham Clark", id: "51766"},{name: "Scottie Scheffler", id: "46046"},{name: "Kristoffer Ventura", id: "35658"}],
"Rory, Corey, & Youngn`s (Andrew Olson #2)": [{name: "Rory McIlroy", id: "28237"},{name: "Sungjae Im", id: "39971"},{name: "Corey Conners", id: "39997"},{name: "Collin Morikawa", id: "50525"},{name: "Wyndham Clark", id: "51766"},{name: "Scottie Scheffler", id: "46046"},{name: "Maverick McNealy", id: "46442"},{name: "Matt Wallace", id: "48887"}],
"Trophies & Stone Colt Luck (Trajan)": [{name: "Dustin Johnson", id: "30925"},{name: "Jordan Spieth", id: "34046"},{name: "Aaron Wise", id: "49964"},{name: "Ben Crane", id: "23541"},{name: "Blayne Barber", id: "35545"},{name: "Brandon Stone", id: "35225"},{name: "Colt Knost", id: "30711"},{name: "Curtis Luck", id: "37380"}],
"Figs Newtons (Figler)": [{name: "Rory McIlroy", id: "28237"},{name: "Cameron Champ", id: "52372"},{name: "Sungjae Im", id: "39971"},{name: "Viktor Hovland", id: "46717"},{name: "Kiradech Aphibarnrat", id: "30978"},{name: "Beau Hossler", id: "35461"},{name: "Sam Ryder", id: "37275"},{name: "Matt Wallace", id: "48887"}],
"Carolina Fairways (BJ)": [{name: "Brooks Koepka", id: "36689"},{name: "Sergio Garcia", id: "21209"},{name: "Harold Varner III", id: "37189"},{name: "Matt Every", id: "28307"},{name: "Talor Gooch", id: "46402"},{name: "Ben Taylor", id: "48119"},{name: "Camilo Villegas", id: "27770"},{name: "Ryan Brehm", id: "28420"}],
"Mulligan Please (Gentry)": [{name: "Brooks Koepka", id: "36689"},{name: "Emiliano Grillo", id: "31646"},{name: "Rory Sabbatini", id: "23621"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Camilo Villegas", id: "27770"},{name: "Bernd Wiesberger", id: "29454"},{name: "D.A. Points", id: "25240"},{name: "Ángel Cabrera", id: "20848"}],
"Kings County (Koby)": [{name: "Patrick Cantlay", id: "35450"},{name: "Lucas Glover", id: "25900"},{name: "Sungjae Im", id: "39971"},{name: "Viktor Hovland", id: "46717"},{name: "Matthew Wolff", id: "56278"},{name: "Cameron Champ", id: "52372"},{name: "Chase Wright", id: "37340"},{name: "Ben Crane", id: "23541"}],
"Thunder from Down Under (Alex Moore)": [{name: "Jon Rahm", id: "46970"},{name: "Russell Henley", id: "34098"},{name: "Jason Kokrak", id: "30944"},{name: "Sungjae Im", id: "39971"},{name: "Viktor Hovland", id: "46717"},{name: "Zac Blair", id: "40058"},{name: "Hunter Mahan", id: "24781"},{name: "Lucas Bjerregaard", id: "33803"}],
"Team Kovacs (Mark Kovacs)": [{name: "Matt Kuchar", id: "23108"},{name: "Zach Johnson", id: "24024"},{name: "Daniel Berger", id: "40026"},{name: "Matthew Wolff", id: "56278"},{name: "Cameron Champ", id: "52372"},{name: "K.J. Choi", id: "24357"},{name: "Camilo Villegas", id: "27770"},{name: "Ryan Brehm", id: "28420"}],
"Silent Storm (Adam Barnes)": [{name: "Patrick Cantlay", id: "35450"},{name: "Adam Scott", id: "24502"},{name: "Abraham Ancer", id: "45526"},{name: "Corey Conners", id: "39997"},{name: "Matt Every", id: "28307"},{name: "Matt Wallace", id: "48887"},{name: "Chase Wright", id: "37340"},{name: "Scott Langley", id: "34261"}],
"Geaux Boss Rosé (Meredith)": [{name: "Justin Rose", id: "22405"},{name: "Chez Reavie", id: "26476"},{name: "Aaron Wise", id: "49964"},{name: "Chesson Hadley", id: "34563"},{name: "Lanto Griffin", id: "35310"},{name: "Scott Harrington", id: "27554"},{name: "Hunter Mahan", id: "24781"},{name: "Maverick McNealy", id: "46442"}],
"Bludgeoned But Upright (Joel Meyers)": [{name: "Jordan Spieth", id: "34046"},{name: "Daniel Berger", id: "40026"},{name: "Collin Morikawa", id: "50525"},{name: "Matthew Wolff", id: "56278"},{name: "Viktor Hovland", id: "46717"},{name: "Ollie Schniederjans", id: "46501"},{name: "Ross Fisher", id: "27896"},{name: "Ben Silverman", id: "39327"}],
"Provo`s PUP Putters (BYU)": [{name: "Matthew Wolff", id: "56278"},{name: "Viktor Hovland", id: "46717"},{name: "Scottie Scheffler", id: "46046"},{name: "Matt Wallace", id: "48887"},{name: "Doc Redman", id: "53165"},{name: "Xander Schauffele", id: "48081"},{name: "Sungjae Im", id: "39971"},{name: "Collin Morikawa", id: "50525"}],
"Three Putt (Pauly)": [{name: "Tony Finau", id: "29725"},{name: "Tommy Fleetwood", id: "30911"},{name: "Viktor Hovland", id: "46717"},{name: "Kristoffer Ventura", id: "35658"},{name: "Harold Varner III", id: "37189"},{name: "Sam Burns", id: "47504"},{name: "Bud Cauley", id: "34021"},{name: "Zac Blair", id: "40058"}],
"I`m Ping (Griff Sr.)": [{name: "Louis Oosthuizen", id: "26329"},{name: "Corey Conners", id: "39997"},{name: "Viktor Hovland", id: "46717"},{name: "Joaquin Niemann", id: "45486"},{name: "Tyrrell Hatton", id: "34363"},{name: "Nate Lashley", id: "28775"},{name: "Sungjae Im", id: "39971"},{name: "Sebastián Muñoz", id: "48822"}],
"You Gotta Play More (Griff #1)": [{name: "Joaquin Niemann", id: "45486"},{name: "Emiliano Grillo", id: "31646"},{name: "Sungjae Im", id: "39971"},{name: "Tommy Fleetwood", id: "30911"},{name: "Matt Wallace", id: "48887"},{name: "Scottie Scheffler", id: "46046"},{name: "Matthew Wolff", id: "56278"},{name: "Matthew Fitzpatrick", id: "40098"}],
"Splashing the Pot (Griff #2)": [{name: "Joaquin Niemann", id: "45486"},{name: "Emiliano Grillo", id: "31646"},{name: "Abraham Ancer", id: "45526"},{name: "Xander Schauffele", id: "48081"},{name: "Matt Wallace", id: "48887"},{name: "Scottie Scheffler", id: "46046"},{name: "Matt Every", id: "28307"},{name: "Beau Hossler", id: "35461"}],
"Turn and Kaufman (Nick Berne)": [{name: "Justin Thomas", id: "33448"},{name: "Tommy Fleetwood", id: "30911"},{name: "Collin Morikawa", id: "50525"},{name: "Wyndham Clark", id: "51766"},{name: "Kristoffer Ventura", id: "35658"},{name: "Henrik Norlander", id: "30163"},{name: "Matt Wallace", id: "48887"},{name: "Smylie Kaufman", id: "46440"}],
"Team Fynbos (Tink)": [{name: "Gary Woodland", id: "31323"},{name: "Louis Oosthuizen", id: "26329"},{name: "Branden Grace", id: "29974"},{name: "Charl Schwartzel", id: "26331"},{name: "Dylan Frittelli", id: "29970"},{name: "Robert Streb", id: "34431"},{name: "Justin Harding", id: "28938"},{name: "Brandon Stone", id: "35225"}],
"Team Wally (Chris Bergstrom)": [{name: "Jason Kokrak", id: "30944"},{name: "Viktor Hovland", id: "46717"},{name: "Bryson DeChambeau", id: "47959"},{name: "Sungjae Im", id: "39971"},{name: "Matthew Wolff", id: "56278"},{name: "Sepp Straka", id: "49960"},{name: "Tom Hoge", id: "35532"},{name: "Fabian Gomez", id: "28679"}],
"Ty Webb`s Blindfolded (Trey)": [{name: "Gary Woodland", id: "31323"},{name: "Sung Kang", id: "27974"},{name: "J.T. Poston", id: "49771"},{name: "Kevin Streelman", id: "27214"},{name: "Cameron Champ", id: "52372"},{name: "Chris Stroud", id: "27963"},{name: "Sam Burns", id: "47504"},{name: "Roberto Castro", id: "32200"}],
"Miles of Mistakes (Schaefer)": [{name: "Jordan Spieth", id: "34046"},{name: "Jon Rahm", id: "46970"},{name: "Collin Morikawa", id: "50525"},{name: "Talor Gooch", id: "46402"},{name: "Xinjun Zhang", id: "32254"},{name: "Maverick McNealy", id: "46442"},{name: "Lucas Bjerregaard", id: "33803"},{name: "Graham DeLaet", id: "27436"}],
"Easy Ed (Ed Kordel)": [{name: "Justin Thomas", id: "33448"},{name: "Collin Morikawa", id: "50525"},{name: "Viktor Hovland", id: "46717"},{name: "Joaquin Niemann", id: "45486"},{name: "Max Homa", id: "39977"},{name: "Talor Gooch", id: "46402"},{name: "Josh Teater", id: "27330"},{name: "Wes Roach", id: "35732"}],
"Nowhere Men (Dombrowski)": [{name: "Xander Schauffele", id: "48081"},{name: "Sungjae Im", id: "39971"},{name: "Jason Kokrak", id: "30944"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Viktor Hovland", id: "46717"},{name: "Sepp Straka", id: "49960"},{name: "Kristoffer Ventura", id: "35658"},{name: "Maverick McNealy", id: "46442"}],
"Enter Xan Man (Rafa)": [{name: "Xander Schauffele", id: "48081"},{name: "Patrick Cantlay", id: "35450"},{name: "Scottie Scheffler", id: "46046"},{name: "Andrew Landry", id: "33410"},{name: "Harry Higgs", id: "33597"},{name: "Bo Hoag", id: "33490"},{name: "Kristoffer Ventura", id: "35658"},{name: "Xinjun Zhang", id: "32254"}],
"Debt Kuma (UK)": [{name: "Hideki Matsuyama", id: "32839"},{name: "Sung Kang", id: "27974"},{name: "Sungjae Im", id: "39971"},{name: "C.T. Pan", id: "29908"},{name: "Kiradech Aphibarnrat", id: "30978"},{name: "Xinjun Zhang", id: "32254"},{name: "HaoTong Li", id: "35296"},{name: "Doug Ghim", id: "52375"}],
"877 CASH NOW (Hartman)": [{name: "Patrick Reed", id: "34360"},{name: "Bubba Watson", id: "25804"},{name: "Rory Sabbatini", id: "23621"},{name: "Scott Stallings", id: "30692"},{name: "Robert Garrigus", id: "24358"},{name: "David Hearn", id: "26758"},{name: "Xinjun Zhang", id: "32254"},{name: "John Huh", id: "34174"}],
"Power Fade (Rosneck)": [{name: "Justin Thomas", id: "33448"},{name: "Collin Morikawa", id: "50525"},{name: "Matthew Wolff", id: "56278"},{name: "Viktor Hovland", id: "46717"},{name: "Wyndham Clark", id: "51766"},{name: "Scottie Scheffler", id: "46046"},{name: "Doug Ghim", id: "52375"},{name: "Maverick McNealy", id: "46442"}],
"Light Projector (DV)": [{name: "Jason Day", id: "28089"},{name: "Patrick Cantlay", id: "35450"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Wyndham Clark", id: "51766"},{name: "Adam Schenk", id: "47347"},{name: "Sam Burns", id: "47504"},{name: "Doug Ghim", id: "52375"},{name: "Cameron Davis", id: "45157"}],
"Numbers Don`t Lie (Nichols)": [{name: "Rory McIlroy", id: "28237"},{name: "Tommy Fleetwood", id: "30911"},{name: "Dylan Frittelli", id: "29970"},{name: "Matt Jones", id: "26300"},{name: "Adam Long", id: "35449"},{name: "Sam Ryder", id: "37275"},{name: "Peter Malnati", id: "34466"},{name: "Sepp Straka", id: "49960"}],
"Loyalty Spiders (Big Dan)": [{name: "Brooks Koepka", id: "36689"},{name: "Brandt Snedeker", id: "27649"},{name: "J.T. Poston", id: "49771"},{name: "Scottie Scheffler", id: "46046"},{name: "Xinjun Zhang", id: "32254"},{name: "Scott Langley", id: "34261"},{name: "Chase Wright", id: "37340"},{name: "Adam Svensson", id: "40115"}],
"Snow White Pants & the 7 Dwarfs (Trent #1)": [{name: "Rory McIlroy", id: "28237"},{name: "Jordan Spieth", id: "34046"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Maverick McNealy", id: "46442"},{name: "Chris Baker", id: "33404"},{name: "Cameron Davis", id: "45157"},{name: "Matt Wallace", id: "48887"},{name: "Doug Ghim", id: "52375"}],
"Pony Loyalty Express (Trent #2)": [{name: "Bryson DeChambeau", id: "47959"},{name: "Cameron Smith", id: "35891"},{name: "Abraham Ancer", id: "45526"},{name: "Sungjae Im", id: "39971"},{name: "Dylan Frittelli", id: "29970"},{name: "Harry Higgs", id: "33597"},{name: "Kristoffer Ventura", id: "35658"},{name: "Henrik Norlander", id: "30163"}],
"WPGA (Colleen)": [{name: "Justin Thomas", id: "33448"},{name: "Collin Morikawa", id: "50525"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Wesley Bryan", id: "48084"},{name: "Thomas Pieters", id: "33293"},{name: "Kristoffer Ventura", id: "35658"},{name: "Scottie Scheffler", id: "46046"},{name: "Maverick McNealy", id: "46442"}],
"Stay Winning (Bryson Graham)": [{name: "Justin Rose", id: "22405"},{name: "Bryson DeChambeau", id: "47959"},{name: "Zach Johnson", id: "24024"},{name: "Vince Covello", id: "32982"},{name: "Hunter Mahan", id: "24781"},{name: "Willy Wilcox", id: "34265"},{name: "Carlos Ortiz", id: "33667"},{name: "Alexander Björk", id: "34310"}],
"Latvian Orthodox (JJ Polk)": [{name: "Adam Scott", id: "24502"},{name: "Tommy Fleetwood", id: "30911"},{name: "J.B. Holmes", id: "27141"},{name: "Jimmy Walker", id: "25632"},{name: "Andrew Landry", id: "33410"},{name: "Jonas Blixt", id: "27895"},{name: "Luke Donald", id: "23983"},{name: "Robert Garrigus", id: "24358"}],
"Top Heavy (Dre)": [{name: "Rory McIlroy", id: "28237"},{name: "Jordan Spieth", id: "34046"},{name: "Andrew Putnam", id: "34256"},{name: "Rob Oppenheim", id: "27942"},{name: "Yusaku Miyazato", id: "23821"},{name: "Chase Wright", id: "37340"},{name: "Michael Putnam", id: "28486"},{name: "Ben Silverman", id: "39327"}],
"Nate`s Great 8 (Nielsen)": [{name: "Brooks Koepka", id: "36689"},{name: "Jordan Spieth", id: "34046"},{name: "Talor Gooch", id: "46402"},{name: "Wes Roach", id: "35732"},{name: "Sam Burns", id: "47504"},{name: "Hunter Mahan", id: "24781"},{name: "Colt Knost", id: "30711"},{name: "Matt Wallace", id: "48887"}],
"Emotional Rescue (Pandya)": [{name: "Rory McIlroy", id: "28237"},{name: "Billy Horschel", id: "29420"},{name: "Viktor Hovland", id: "46717"},{name: "Tom Hoge", id: "35532"},{name: "Xinjun Zhang", id: "32254"},{name: "Tom Lewis", id: "35104"},{name: "Kristoffer Ventura", id: "35658"},{name: "Maverick McNealy", id: "46442"}],
"Nance & A Splash Of Spiro": [{name: "Rickie Fowler", id: "32102"},{name: "Collin Morikawa", id: "50525"},{name: "Matthew Wolff", id: "56278"},{name: "Jason Kokrak", id: "30944"},{name: "Joaquin Niemann", id: "45486"},{name: "Robby Shelton", id: "46441"},{name: "Scottie Scheffler", id: "46046"},{name: "Bo Hoag", id: "33490"}],
"Indecision (Spiro)": [{name: "Dustin Johnson", id: "30925"},{name: "Tommy Fleetwood", id: "30911"},{name: "Joaquin Niemann", id: "45486"},{name: "Wyndham Clark", id: "51766"},{name: "Robby Shelton", id: "46441"},{name: "Kristoffer Ventura", id: "35658"},{name: "Doug Ghim", id: "52375"},{name: "Maverick McNealy", id: "46442"}],
"Belmont Koguma (Windler #1)": [{name: "Tony Finau", id: "29725"},{name: "Joaquin Niemann", id: "45486"},{name: "Sungjae Im", id: "39971"},{name: "Viktor Hovland", id: "46717"},{name: "Matthew Fitzpatrick", id: "40098"},{name: "Danny Willett", id: "32139"},{name: "Scottie Scheffler", id: "46046"},{name: "Doug Ghim", id: "52375"}],
"Peyton Was Better (Windler #2)": [{name: "Keith Mitchell", id: "39546"},{name: "Collin Morikawa", id: "50525"},{name: "Lucas Glover", id: "25900"},{name: "Sungjae Im", id: "39971"},{name: "Viktor Hovland", id: "46717"},{name: "Scottie Scheffler", id: "46046"},{name: "Corey Conners", id: "39997"},{name: "Joaquin Niemann", id: "45486"}],
"White Rascal (Cobra)": [{name: "Hideki Matsuyama", id: "32839"},{name: "Bubba Watson", id: "25804"},{name: "Collin Morikawa", id: "50525"},{name: "Viktor Hovland", id: "46717"},{name: "Brendon Todd", id: "30927"},{name: "Tyler McCumber", id: "40042"},{name: "Nelson Ledesma", id: "35230"},{name: "Vincent Whaley", id: "51894"}],
"5 iron huh? Well, you`re fired (Shane Kupperman)": [{name: "Patrick Cantlay", id: "35450"},{name: "Sungjae Im", id: "39971"},{name: "Jason Kokrak", id: "30944"},{name: "Joaquin Niemann", id: "45486"},{name: "Anirban Lahiri", id: "31420"},{name: "Beau Hossler", id: "35461"},{name: "Erik van Rooyen", id: "40006"},{name: "Sam Burns", id: "47504"}],
"Marc Chasanoff": [{name: "Rory McIlroy", id: "28237"},{name: "Matt Kuchar", id: "23108"},{name: "Brice Garnett", id: "29535"},{name: "Steve Stricker", id: "6527"},{name: "John Chin", id: "34306"},{name: "Adam Long", id: "35449"},{name: "Curtis Luck", id: "37380"},{name: "Anders Albertson", id: "49303"}],
"The Bottom! (Brent Valenti)": [{name: "Xander Schauffele", id: "48081"},{name: "Rickie Fowler", id: "32102"},{name: "Max Homa", id: "39977"},{name: "Peter Uihlein", id: "29484"},{name: "Talor Gooch", id: "46402"},{name: "Sepp Straka", id: "49960"},{name: "Tyler McCumber", id: "40042"},{name: "Maverick McNealy", id: "46442"}],
"The Forever Freddie`s": [{name: "Joaquin Niemann", id: "45486"},{name: "Sungjae Im", id: "39971"},{name: "Wyndham Clark", id: "51766"},{name: "Robby Shelton", id: "46441"},{name: "Scottie Scheffler", id: "46046"},{name: "Tommy Fleetwood", id: "30911"},{name: "Viktor Hovland", id: "46717"},{name: "Brandt Snedeker", id: "27649"}],
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
  }, 200000);
  //change back to 30000

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

  $.getJSON("https://statdata.pgatour.com/r/" + relevantTourney.tournament_id + "/2020/leaderboard-v2.json" + "?userTrackingId=exp=1578177569~acl=*~hmac=a9e0199214287a633029f2fb1b59180c61609605f069acf1d8de0ebf4c72befe", function( data ) {


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
        //console.log(player);
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
                    + "<div id='collapse" + i+1 + "' class='panel-collapse collapse " + team.teamName.replace(/ .*/,'') + "'><table class='table-bordered table-condensed'>"
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
      //$(".Pony").html("<img src='https://media.giphy.com/media/WUb5Evd7s4vO0bePDQ/giphy.gif'>");
      //$(".Snow").html("<img src='https://media.giphy.com/media/WUb5Evd7s4vO0bePDQ/giphy.gif'>");
      //$(".Loyalty").html("<img width='400' src='https://i.imgur.com/IOB6ySC.png'>");
//      $(".877").html("<img src='https://uploads.tapatalk-cdn.com/20190330/824f9c0282ecd962fe63287a27c93685.gif'>");
//      $(".White").html("<img src='https://i.imgur.com/nC5KVqU.jpg'>");
//      $(".Debt").html("<img src='https://i.imgur.com/iDuiPcH.jpg'>");
      

      //$(".Indecision").html("<img src='https://i.imgur.com/aX5ObI5.jpg' width='250'>");
    }
    else
    {
      console.log("Data hasn't changed!");
    }
    $(".error-message").hide();
  }) 
}
