schedule = [{name: 'Safeway Open', date: new Date(Date.parse('10-5-2017')), tournament_id: '464'},
            {name: 'CIMB Classic', date: new Date(Date.parse('10-12-2017')), tournament_id: '494'},
            {name: 'THE CJ CUP', date: new Date(Date.parse('10-19-2017')), tournament_id: '521'},
            {name: 'Sanderson Farms Championship', date: new Date(Date.parse('10-26-2017')), tournament_id: '054'},
            {name: 'WGC-HSBC Champions', date: new Date(Date.parse('10-26-2017')), tournament_id: '489'},
            {name: 'Shriners Hospitals for Child', date: new Date(Date.parse('11-2-2017')), tournament_id: '47'},
            {name: 'OHL Classic at Mayakoba', date: new Date(Date.parse('11-9-2017')), tournament_id: '457'},
            {name: 'The RSM Classic', date: new Date(Date.parse('11-16-2017')), tournament_id: '493'},
            {name: 'World Challenge', date: new Date(Date.parse('11-30-2017')), tournament_id: '478'},
            {name: 'QBE Shootout', date: new Date(Date.parse('12-8-2017')), tournament_id: '58'},
            {name: 'Sentry T of C', date: new Date(Date.parse('1-4-2018')), tournament_id: '16'},
            {name: 'Sony Open in Hawaii', date: new Date(Date.parse('1-11-2018')), tournament_id: '6'},
            {name: 'CareerBuilder', date: new Date(Date.parse('1-18-2018')), tournament_id: '2'},
            {name: 'Farmers Insurance Open', date: new Date(Date.parse('1-25-2018')), tournament_id: '004'},
            {name: 'Phoenix Open', date: new Date(Date.parse('2-1-2018')), tournament_id: '003'},
            {name: 'AT&T Pebble Beach', date: new Date(Date.parse('2-8-2018')), tournament_id: '5'},
            {name: 'Genesis Open', date: new Date(Date.parse('2-15-2018')), tournament_id: '7'},
            {name: 'The Honda Classic', date: new Date(Date.parse('2-22-2018')), tournament_id: '10'},
            {name: 'Puerto Rico', date: new Date(Date.parse('3-1-2018')), tournament_id: '483'},
            {name: 'WGC-Mexico Championship', date: new Date(Date.parse('3-1-2018')), tournament_id: '473'},
            {name: 'Valspar Champ', date: new Date(Date.parse('3-8-2018')), tournament_id: '475'},
            {name: 'Arnold Palmer Invtl', date: new Date(Date.parse('3-15-2018')), tournament_id: '9'},
            {name: 'Puntacana', date: new Date(Date.parse('3-22-2018')), tournament_id: '522'},
            {name: 'WGC-Match Play', date: new Date(Date.parse('3-21-2018')), tournament_id: '470'},
            {name: 'Shell Houston Open', date: new Date(Date.parse('3-29-2018')), tournament_id: '20'},
            {name: 'Masters Tournament', date: new Date(Date.parse('4-5-2018')), tournament_id: '14'},
            {name: 'RBC Heritage', date: new Date(Date.parse('4-12-2018')), tournament_id: '12'},
            {name: 'Valero Texas Open', date: new Date(Date.parse('4-19-2018')), tournament_id: '41'},
            {name: 'Zurich Classic', date: new Date(Date.parse('4-26-2018')), tournament_id: '18'},
            {name: 'Wells Fargo Championship', date: new Date(Date.parse('5-3-2018')), tournament_id: '480'},
            {name: 'THE PLAYERS Championship', date: new Date(Date.parse('5-10-2018')), tournament_id: '11'},
            {name: 'AT&T Byron Nelson', date: new Date(Date.parse('5-17-2018')), tournament_id: '019'},
            {name: 'DEAN & DELUCA', date: new Date(Date.parse('5-24-2018')), tournament_id: '021'},
            {name: 'the Memorial Tournament', date: new Date(Date.parse('5-31-2018')), tournament_id: '023'},
            {name: 'FedEx St. Jude Classic', date: new Date(Date.parse('6-7-2018')), tournament_id: '025'},
            {name: 'U.S. Open', date: new Date(Date.parse('6-14-2018')), tournament_id: '026'},
            {name: 'Travelers Championship', date: new Date(Date.parse('6-21-2018')), tournament_id: '034'},
            {name: 'The National', date: new Date(Date.parse('6-28-2018')), tournament_id: '471'},
            {name: 'The Greenbrier Classic', date: new Date(Date.parse('7-5-2018')), tournament_id: '490'},
            {name: 'John Deere Classic', date: new Date(Date.parse('7-12-2018')), tournament_id: '030'},
            {name: 'Barbasol Champ', date: new Date(Date.parse('7-19-2018')), tournament_id: '518'},
            {name: 'The Open', date: new Date(Date.parse('7-19-2018')), tournament_id: '100'},
            {name: 'RBC Canadian Open', date: new Date(Date.parse('7-26-2018')), tournament_id: '032'},
            {name: 'Barracuda Championship', date: new Date(Date.parse('8-2-2018')), tournament_id: '472'},
            {name: 'WGC-Bridgestone Invitational', date: new Date(Date.parse('8-2-2018')), tournament_id: '476'},
            {name: 'PGA Championship', date: new Date(Date.parse('8-9-2018')), tournament_id: '033'},
            {name: 'Wyndham Championship', date: new Date(Date.parse('8-16-2018')), tournament_id: '013'},
            {name: 'NORTHERN TRUST', date: new Date(Date.parse('8-23-2018')), tournament_id: '027'},
            {name: 'Dell Tech Champ', date: new Date(Date.parse('8-31-2018')), tournament_id: '505'},
            {name: 'BMW Championship', date: new Date(Date.parse('9-6-2018')), tournament_id: '028'},
            {name: 'TOUR Championship', date: new Date(Date.parse('9-20-2018')), tournament_id: '060'},
            {name: 'Ryder Cup', date: new Date(Date.parse('9-28-2018')), tournament_id: '468'}
];

var today = new Date();
tourneysBeforeToday = schedule.filter(event => event.date.setHours(0,0,0,0) <= today.setHours(0,0,0,0));;
tourneysAfterToday = schedule.filter(event => event.date.setHours(0,0,0,0) >= today.setHours(0,0,0,0));;

relevantTourney = {};

  relevantTourney = tourneysBeforeToday.slice(-1)[0];  

debugger;

teams = {
  "Trump`s Blue Steele (Griff #1)": ["Daniel Berger","Patrick Cantlay","Tommy Fleetwood","Seamus Power","Jamie Lovemark","Emiliano Grillo","Bud Cauley","Brendan Steele"],
  "Team Hole in None (Mike Templin)": ["Jason Day","Cameron Percy","Thomas Bjorn","Bud Cauley","Andrew Landry","Graham DeLaet","Tony Finau","Brendan Steele"],
  "877 CASH NOW (Hartman)": ["Rory McIlroy","Aaron Wise","Beau Hossler","Peter Malnati","Ollie Schniederjans","Bud Cauley","Phil Mickelson","Tony Finau"],
  "Three Putt (Chris Paulson)": ["Jon Rahm","Patrick Reed","Keith Mitchell","Sam Ryder","Tom Lovelady","Grayson Murray","Chesson Hadley","Tony Finau"],
  "Pre-Christmas Bridesmaids (Alex Moore)": ["Sangmoon Bae","Sam Saunders","Jamie Lovemark","Patrick Rodgers","Kevin Na","Webb Simpson","Chesson Hadley","Tony Finau"],
  "Clevelunder Par (Fred McLeod)": ["Paul Casey","Jhonattan Vegas","Patrick Cantlay","Jonathan Randolph","Patrick Rodgers","Ollie Schniederjans","Bud Cauley","Tony Finau"],
  "The Domers (AC)": ["Jon Rahm","J.B. Holmes","Patrick Cantlay","Tyrrell Hatton","Jason Bohn","Harold Varner III","Bud Cauley","Tony Finau"],
  "Clark Bars (Mike Clark)": ["Rory McIlroy","Patrick Cantlay","Thomas Pieters","Peter Uihlein","Aaron Wise","Corey Conners","Ollie Schniederjans","Tony Finau"],
  "Numbers Don`t Lie (Nichols)": ["Paul Casey","Francesco Molinari","Patrick Cantlay","Stewart Cink","Jason Kokrak","Chez Reavie","Bud Cauley","Phil Mickelson"],
  "The Chosen Juan (Rafa)": ["Dustin Johnson","James Hahn","Sam Ryder","Emiliano Grillo","Ollie Schniederjans","Brice Garnett","Andrew Landry","Chesson Hadley"],
  "Guardians of the Golf Galaxy (Valenti)": ["Brian Harman","Xander Schauffele","Smylie Kaufman","Talor Gooch","Patrick Rodgers","Ryan Moore","Bud Cauley","Chesson Hadley"],
  "Fig`s Newtons (Figler)": ["Sergio Garcia","Si Woo Kim","Andrew Johnston","Aaron Wise","Cody Gribble","Bryson DeChambeau","Ollie Schniederjans","Phil Mickelson"],
  "Hawks Swoops (Rob Griffin)": ["Rickie Fowler","Tyrrell Hatton","Cameron Tringale","Stephan Jaeger","Emiliano Grillo","Bryson DeChambeau","Ollie Schniederjans","Graham DeLaet"],
  "Smails` Paralegals (Dan Tinklenberg #2)": ["Hideki Matsuyama","Rickie Fowler","Patrick Cantlay","Sam Ryder","Richy Werenski","Stephan Jaeger","Bud Cauley","Andrew Landry"],
  "White Rascal (Cobra)": ["Hideki Matsuyama","Kevin Kisner","Patrick Cantlay","Peter Uihlein","Abraham Ancer","Brice Garnett","Bronson Burgoon","Tyler Duncan"],
  "Carolina Fairways Still No Woods (BJ)": ["Dustin Johnson","Patrick Reed","Alex Cejka","Greg Chalmers","Ryo Ishikawa","Harold Varner III","Chez Reavie","Bud Cauley"],
  "Pony Loyalty Express (Trent #1)": ["Jordan Spieth","Patrick Cantlay","Thomas Pieters","Colt Knost","Beau Hossler","Kelly Kraft","Bryson DeChambeau","Bud Cauley"],
  "DeLaet’s Try This Again (Jeff Schaefer)": ["Jordan Spieth","Si Woo Kim","Thomas Pieters","Nick Watney","Sam Ryder","Aaron Wise","Stephan Jaeger","Graham DeLaet"],
  "Tink Floyd (Dan Tinklenberg #1)": ["Kevin Kisner","Pat Perez","Gary Woodland","Charlie Wi","Martin Flores","Cameron Tringale","Andrew Putnam","Bud Cauley"],
  "Heavy Trunk Classes (Griff #2)": ["Jon Rahm","Patrick Reed","Patrick Cantlay","Byeong Hun An","Ross Fisher","Sam Ryder","Emiliano Grillo","Bud Cauley"],
  "Light Projector (Dan Vincent)": ["Jason Day","Peter Uihlein","Aaron Wise","Xander Schauffele","Ryan Blaum","Beau Hossler","Ollie Schniederjans","Nick Taylor"],
  "Indecision (Spiro)": ["Dustin Johnson","Russell Henley","Patrick Cantlay","Patton Kizzire","Peter Uihlein","Sam Ryder","Stephan Jaeger","Andrew Landry"],
  "Wine Country Tour (Meredith G.)": ["Rickie Fowler","Rafa Cabrera Bello","Francesco Molinari","Thomas Pieters","Alexander Noren","Cameron Smith","Stephan Jaeger","Bud Cauley"],
  "Kings County (Koby)": ["Marc Leishman","Xander Schauffele","Patrick Cantlay","Seamus Power","Sung Kang","Kevin Tway","Richy Werenski","Grayson Murray"],
  "Power Fade (Jim Rosneck)": ["Rory McIlroy","Rickie Fowler","Patrick Cantlay","Peter Uihlein","Aaron Wise","Sam Ryder","Talor Gooch","Bud Cauley"],
  "Provo`s Putt Putters (BYU)": ["Rickie Fowler","Jon Rahm","Patrick Cantlay","Thomas Pieters","Aaron Wise","Austin Cook","Beau Hossler","Bud Cauley"],
  "Nate`s Great 8 (Nielsen)": ["Jordan Spieth","Jon Rahm","Patton Kizzire","JT Poston","Seamus Power","Cameron Percy","Tag Ridings","Bud Cauley"],
  "Sir Jim 4.0": ["Rickie Fowler","Patrick Reed","Branden Grace","Patrick Cantlay","Tyrrell Hatton","Brandon Hagy","Sam Ryder","Bud Cauley"],
  "Team 1 Irons (Dan Sevic)": ["Matt Kuchar","Xander Schauffele","Patrick Cantlay","Peter Uihlein","Anirban Lahiri","Beau Hossler","Ollie Schniederjans","Chez Reavie"],
  "Team High Definition (Joe Frietchen)": ["Keegan Bradley","Branden Grace","Danny Willett","Daniel Summerhays","Jamie Lovemark","Kevin Na","Bryson DeChambeau","Martin Laird"],
  "The Rookie (Hillman)": ["Bubba Watson","Henrik Stenson","Xander Schauffele","K.J. Choi","Jonathan Randolph","David Toms","Tiger Woods","Grayson Murray"],
  "DD (Under the Radar) (Dombrowski)": ["Rickie Fowler","Patrick Reed","Sangmoon Bae","Matthew Fitzpatrick","Maverick McNealy","Patrick Rodgers","Richy Werenski","Ollie Schniederjans"],
  "Chubbs` Right Hand Men (Trey Platt)": ["Justin Thomas","Keegan Bradley","Martin Kaymer","Danny Willett","Boo Weekley","K.J. Choi","Austin Cook","Hunter Mahan"],
  "Spiders (Big Dan)": ["Rickie Fowler","Keegan Bradley","Blayne Barber","Andrew Loupe","Mark Hubbard","Y.E. Yang","Emiliano Grillo","Webb Simpson"],
  "Can`t Get Right (Andrae Patterson)": ["Sergio Garcia","Jim Furyk","Tommy Fleetwood","Ernie Els","K.J. Choi","Davis Love III","Jeff Overton","Bill Haas"],
  "WPGA (Colleen Garrity)": ["Justin Thomas","Wesley Bryan","Thomas Pieters","Cheng Tsung Pan","Matthew Fitzpatrick","Austin Cook","Abraham Ancer","Ollie Schniederjans"],
  "United Nations of White Pants (Trent #2)": ["Rory McIlroy","Paul Casey","Anirban Lahiri","Alexander Noren","Peter Uihlein","Aaron Wise","Sung Kang","Andrew Putnam"],
  "Easy Ed Kordel": ["Justin Thomas","Paul Casey","Peter Uihlein","Tiger Woods","Ryan Armour","Miguel Angel Carballo","Harold Varner III","Jamie Lovemark"],
  "The F*%ked Kuma (UK)": ["Hideki Matsuyama","Rickie Fowler","Sangmoon Bae","Cheng Tsung Pan","Tiger Woods","Zecheng Dou","Andrew Yun","Xinjun Zhang"],
  "J Mike Hates Golf": ["Rickie Fowler","Jon Rahm","Sangmoon Bae","Michael Kim","Andrew Loupe","Michael Bradley","Jonathan Byrd","Smylie Kaufman"],
  "Team Wally (Chris Bergstrom)": ["Justin Thomas","Charley Hoffman","Tommy Fleetwood","Tyrrell Hatton","Bernd Wiesberger","Ross Fisher","Trevor Immelman","Tiger Woods"],
  "We`re All Related (Adam Barnes)": ["Adam Scott","Adam Hadwin","Adam Long","Adam Schenk","Blake Adams","Ricky Barnes","Kiradech Aphibarnrat","Henrik Stenson"]
};



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

  $.getJSON("https://statdata.pgatour.com/r/" + relevantTourney.tournament_id + "/2018/leaderboard-v2.json", function( data ) {


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
              name: toTitleCase(correctedName(player.player_bio.first_name + ' ' + player.player_bio.last_name)),
              positionNum: parseInt(player.current_position.replace(/\D/g,'')),
              position: player.current_position,
              proj_money: numeral(player.rankings.projected_money_event),
              today: player.today,
              thru: player.thru,
              total: player.total
            }
          );
      });


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
      //$(".tournament-name").append("<h1>" + "WGC-HSBC/Sanderson Farms" + "</h1>");

      $(".click-track").click(function(){
          ga('send', 'event', 'Teams', 'Click', $(this).find(".team-name").text());
      });
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
