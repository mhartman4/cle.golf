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
  "We Are Groot! (Brent Valenti)": ["Xander Schauffele","Brian Harman","Chesson Hadley","Beau Hossler","Andrew Putnam","Peter Uihlein","Abraham Ancer","Talor Gooch"],
  "The Rookie 2.0 (Hillman)": ["Tiger Woods","Paul Casey","Zach Johnson","Angel Cabrera","Jerry Kelly","Geoff Ogilvy","Hunter Mahan","Matt Every"],
  "Indecision (Spiro)": ["Dustin Johnson","Tommy Fleetwood","Peter Uihlein","Cameron Davis","Cameron Champ","Sam Burns","Kramer Hickok","Wyndham Clark"],
  "Fig`s Newtons": ["Bryson DeChambeau","Aaron Wise","Martin Kaymer","Abraham Ancer","Keegan Bradley","Ted Potter, Jr.","Kramer Hickok","Cameron Champ"],
  "Team Ole (Andrew Olsen)": ["Tony Finau","Xander Schauffele","Tommy Fleetwood","Beau Hossler","Cameron Champ","Kramer Hickok","Corey Conners","Talor Gooch"],
  "Nate`s Great 8 (Nielsen)": ["Andrew Landry","Andrew Putnam","Beau Hossler","Chesson Hadley","Jordan Spieth","Kramer Hickok","Sam Burns","Sam Ryder"],
  "FL00R S3TT3RS REVENGE (Dre)": ["Francesco Molinari","Chez Reavie","Tyrrell Hatton","Austin Cook","Beau Hossler","Kelly Kraft","Sam Saunders","Stephan Jaeger"],
  "Quiet Storm (Barnes)": ["Tiger Woods","Patrick Cantlay","Chez Reavie","Beau Hossler","Andrew Putnam","Matt Every","Stephan Jaeger","Talor Gooch"],
  "Clevelunder Par (Fred McLeod)": ["Tiger Woods","Tony Finau","Beau Hossler","Keith Mitchell","Abraham Ancer","Seamus Power","Sam Ryder","Talor Gooch"],
  "Three Putt (Pauly)": ["Rickie Fowler","Tony Finau","Jamie Lovemark","Sungjae Im","Cameron Champ","Anders Albertson","Sam Burns","Kramer Hickok"],
  "Tink Floyd (Dan Tinklenberg": ["Kevin Kisner","Gary Woodland","Patrick Cantlay","Andrew Landry","Camilo Villegas","Seamus Power","Scott Langley","Geoff Ogilvy"],
  "Smails` Paralegals (Tink #2)": ["Tony Finau","Tommy Fleetwood","Patrick Cantlay","Tyrrell Hatton","Sungjae Im","Sam Burns","Dylan Frittelli","Ben Silverman"],
  "Kings/Essex County (Will Harrison + Koby)": ["Tony Finau","Patton Kizzire","Chesson Hadley","Andrew Landry","Austin Cook","Andrew Putnam","Wyndham Clark","Talor Gooch"],
  "Easy Ed (Ed Kordel)": ["Alex Prugh","Sam Ryder","Hunter Mahan","J.T. Poston","Peter Uihlein","Ryan Armour","Joaquin Niemann","Justin Thomas"],
  "Optimistic Eight (Joe G)": ["Tiger Woods","Si Woo Kim","Byeong Hun An","Thomas Pieters","Sungjae Im","Denny McCarthy","Kyoung-Hoon Lee","Jim Knous"],
  "Power Fade (Rosneck)": ["Justin Thomas","Aaron Wise","Beau Hossler","Peter Uihlein","Sungjae Im","Hunter Mahan","Sam Burns","Dylan Frittelli"],
  "Team Loyalty Spiders (Big Dan)": ["Brooks Koepka","Webb Simpson","Aaron Wise","Tyler Duncan","Ben Silverman","Matt Every","Brendon de Jonge","Talor Gooch"],
  "Team HDMI (Joe Frietchen)": ["Ollie Schniederjans","Abraham Ancer","Peter Uihlein","Austin Cook","Beau Hossler","Aaron Wise","Byeong Hun An","Patrick Cantlay"],
  "White Rascal (Cobra)": ["Hideki Matsuyama","Patrick Cantlay","Cameron Smith","Sungjae Im","Denny McCarthy","Cody Gribble","Cameron Davis","Sam Burns"],
  "Team Wally (Chris Bergstrom)": ["Tony Finau","Tommy Fleetwood","Alexander Noren","Beau Hossler","Sam Burns","Nick Watney","Sangmoon Bae","Hunter Mahan"],
  "Ty Webb`s Blindfolded Team (Trey Platt)": ["Tony Finau","Luke List","Andrew Landry","Brian Gay","Austin Cook","Kevin Streelman","Andrew Putnam","Matt Every"],
  "Miles of Mistakes (Schaefer)": ["Jordan Spieth","Jon Rahm","Richy Werenski","Julian Suri","Cameron Champ","Kramer Hickok","Max Homa","Stephan Jaeger"],
  "Provo`s Putt Putters": ["Tony Finau","Xander Schauffele","Cameron Smith","Beau Hossler","Sungjae Im","Sam Burns","Dylan Frittelli","Brandon Hagy"],
  "Hawks Swoop (Rob Griffin)": ["Bryson DeChambeau","Francesco Molinari","Joaquin Niemann","David Lingmerth","Sungjae Im","Sebastian Munoz","Alex Prugh","Stephan Jaeger"],
  "The Eyes of Texas are Upon White Pants": ["Jordan Spieth","Rory McIlroy","Sam Burns","Cameron Champ","Curtis Luck","Kramer Hickok","Dylan Frittelli","Colt Knost"],
  "Pony Loyalty Express": ["Bryson DeChambeau","Aaron Wise","Kelly Kraft","Beau Hossler","Andrew Putnam","Peter Uihlein","Sungjae Im","Cameron Davis"],
  "877 CASH NOW (Hartman)": ["Cheng Tsung Pan","Abraham Ancer","Scott Brown","Chesson Hadley","Patrick Reed","Nick Taylor","Ollie Schniederjans","Richy Werenski"],
  "Light Projector (DV)": ["Jason Day","Tommy Fleetwood","Abraham Ancer","Richy Werenski","Tom Hoge","Sungjae Im","Cameron Davis","Cameron Champ"],
  "Decanted Rosé (Meredith)": ["Justin Rose","Francesco Molinari","Chesson Hadley","Chase Wright","Seamus Power","Dylan Frittelli","Dominic Bozzelli","Corey Conners"],
  "Thunder from Down Under (Alex Moore)": ["Bryson DeChambeau","Tommy Fleetwood","Chesson Hadley","Ollie Schniederjans","Ben Martin","Matt Jones","Cameron Davis","Stephan Jaeger"],
  "Second to Joaquin (Rafa)": ["Tiger Woods","Joaquin Niemann","Sungjae Im","Denny McCarthy","Andrew Landry","Aaron Wise","Abraham Ancer","Anders Albertson"],
  "Sonoma`s Stompers (Griff #1)": ["Xander Schauffele","Tommy Fleetwood","Emiliano Grillo","Patrick Cantlay","Curtis Luck","Tyler Duncan","Brandon Hagy","Kevin Stadler"],
  "Splashing the Pot (Griff #2)": ["Patrick Cantlay","Aaron Wise","Joaquin Niemann","J.J. Spaun","Tyrrell Hatton","Beau Hossler","Kevin Tway","Abraham Ancer"],
  "Clark Bars (Mike Clark)": ["Hideki Matsuyama","Byeong Hun An","Aaron Wise","Beau Hossler","Peter Uihlein","Sangmoon Bae","Cameron Champ","Sam Burns"],
  "WPGA (Colleen)": ["Justin Thomas","Patrick Cantlay","Ollie Schniederjans","Abraham Ancer","Matthew Fitzpatrick","Haotong Li","Ben Silverman","Stephan Jaeger"],
  "The 1 Irons (Sevic)": ["Brandt Snedeker","Zach Johnson","Patrick Cantlay","Matthew Fitzpatrick","Peter Uihlein","Andrew Putnam","Shawn Stefani","Sam Burns"],
  "Carolina Fairways (BJ)": ["Rory McIlroy","Tiger Woods","Harold Varner III","Michael Kim","Talor Gooch","Matt Every","Geoff Ogilvy","Marty Dou"],
  "No Loyalty (Dombrowski)": ["Tony Finau","Brandt Snedeker","Luke List","Beau Hossler","Sangmoon Bae","Bronson Burgoon","Sungjae Im","Hunter Mahan"],
  "Asian Tiger Returns feat. the soy sauce Kuma (UK)": ["Tiger Woods","Hideki Matsuyama","Cheng Tsung Pan","Sangmoon Bae","K.J. Choi","Kyoung-Hoon Lee","Hiroshi Iwata","Marty Dou"],
  "Numbers Don`t Lie (Nichols)": ["Francesco Molinari","Tommy Fleetwood","Alexander Noren","Tyrrell Hatton","Kiradech Aphibarnrat","Abraham Ancer","Sungjae Im","Sam Burns"],
  "Ebony and Ivory (Nance #1)": ["Tiger Woods","Henrik Stenson","Ian Poulter","Wesley Bryan","Jerry Kelly","Brendon Todd","Greg Owen","Matt Every"],
  "Half and Half (Nance #2)": ["Sergio Garcia","Jimmy Walker","Patrick Cantlay","Jim Furyk","Danny Lee","Robert Streb","Tim Wilkinson","Tyler Aldridge"]
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
  return {teamName: team, playerNames: teams[team], players: []}
});






// On ready do the magic!
$(function() {
  checkForData();
  window.setInterval(function(){
    checkForData();
  }, 10000);

});


function SortByTeamTotal(a, b){
  return ((a.teamTotal.value() > b.teamTotal.value()) ? -1 : ((a.teamTotal.value() < b.teamTotal.value()) ? 1 : 0));
}


function toTitleCase(str)
{
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
        players.push(
            {
              name: toTitleCase(player.player_bio.first_name + ' ' + player.player_bio.last_name),
              positionNum: parseInt(player.current_position.replace(/\D/g,'')),
              position: player.current_position,
              proj_money: numeral(player.rankings.projected_money_event),
              today: player.today,
              thru: player.thru,
              total: player.total
            }
          );
      });


      players.forEach(function(p){ console.log(p.name)});

      //FOR THE MASTERS DO SOME MANUAL MATH
      //calculatePayouts(players);

      $.each(processedTeams, function(i, team) {
        $.each(players, function(j, player) {
          //Name check
          //if (player.name.includes("Noren"))
          //{
            //debugger;
          //}
          capitalized = team.playerNames.map(function(name){return name.toUpperCase()});
          if (capitalized.includes(player.name.toUpperCase()))
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



function correctedName(name) {
  if (name == "Siwoo Kim")
  {
    return "Si Woo Kim";
  }
  else if (name == "Sunghoon Kang")
  {
    return "Sung Kang";
  }
  else if (name == "Byeonghun An")
  {
    return "Byeong Hun An";
  }
  else if (name == "Byeong-Hun An")
  {
    return "Byeong Hun An";
  }
  else if (name == "Shih-chang Chan")
  {
    return "Chan Shih-chang";
  }
  else if (name == "S.S.P Chawrasia")
  {
    return "SSP Chawrasia";
  }
  else if (name == "Soomin Lee")
  {
    return "Lee Soo-Min";
  }
  else if (name == "Younghan Song")
  {
    return "Young-han Song";
  }
  else if (name == "Alex Noren")
  {
    return "Alexander Noren";
  }
  else if (name == "J.T. Poston")
  {
    return "JT Poston";
  }
  else if (name == "C.T. Pan")
  {
    return "Cheng Tsung Pan";
  }
  else if (name == "Willy Wilcox")
  {
    return "Will Wilcox";
  }
  else if (name == "Jeung-hun Wang")
  {
    return "Jeunghun Wang";
  }
  else if (name == "Thorbjørn Olesen")
  {
    return "Thorbjorn Olesen";
  }
  else if (name == "Sebastián Muñoz")
  {
    return "Sebastian Munoz";
  }
  else if (name == "Ángel Cabrera")
  {
    return "Angel Cabrera";
  }
  else if (name == "Julián Etulain")
  {
    return "Julian Etulain";
  }
  else if (name == "Søren Kjeldsen")
  {
    return "Soren Kjeldsen";
  }
  else if (name == "Fabián Gómez")
  {
    return "Fabian Gomez";
  }
  else if (name == "Roberto Díaz")
  {
    return "Roberto Diaz";
  }
  else if (name == "Richard T. lee")
  {
    return "Richard Lee";
  }
  else if (name == "C. T. Pan")
  {
    return "Cheng Tsung Pan";
  }
  else if (name == "C. T. Pan")
  {
    return "Cheng Tsung Pan";
  }
  else if (name == "Hao Tong Li")
  {
    return "Haotong Li";
  }
  else if (name == "Rodney Pampling")
  {
    return "Rod Pampling";
  }
  else{return name;}

}

