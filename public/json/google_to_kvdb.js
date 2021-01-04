const request = require("request")
const KVdb = require('kvdb.io');

// Schedule
request("https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/1/public/full?alt=json", function(error, response, body) {
  const bucket = KVdb.bucket("vRrcDLPTr4WWpVTJxim1H");
  bucket.set('schedule', body);
});


// Rosters
request("https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/2/public/full?alt=json", function(error, response, body) {
  const bucket = KVdb.bucket("vRrcDLPTr4WWpVTJxim1H");
  bucket.set('rosters', body);
});

// Overall
request("https://spreadsheets.google.com/feeds/list/1YsZn_ovmbxOE8gUlmAT7z_nUv5mg9qRdwnNAX-lIrnI/3/public/full?alt=json", function(error, response, body) {
  const bucket = KVdb.bucket("vRrcDLPTr4WWpVTJxim1H");
  bucket.set('overall', body);
});


// DV Rosters
request("https://spreadsheets.google.com/feeds/list/1DHwz1zRTstqmD1Ej8ypqgzkx8D46Uu_RjAqhS1zenR0/1/public/full?alt=json", function(error, response, body) {
  const bucket = KVdb.bucket("vRrcDLPTr4WWpVTJxim1H");
  bucket.set('dv_rosters', body);
});

// DV Overall Standings
// request("https://spreadsheets.google.com/feeds/list/1DHwz1zRTstqmD1Ej8ypqgzkx8D46Uu_RjAqhS1zenR0/1/public/full?alt=json", function(error, response, body) {
//   const bucket = KVdb.bucket("vRrcDLPTr4WWpVTJxim1H");
//   bucket.set('dv_rosters', body);
// });