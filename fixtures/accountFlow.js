const nock = require('nock');
nock.disableNetConnect();

nock('https://api.remove.bg:443', {"encodedQueryParams":true})
  .get('/v1.0/account')
  .reply(200, {"data":{"attributes":{"credits":{"total":200,"subscription":150,"payg":50},"api":{"free_calls":50,"sizes":"all"}}}}, [ 'Access-Control-Allow-Origin',
  '*',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '114',
  'ETag',
  'W/"72-a+pdNwod9EYBqczMsbdneo0sWgg"',
  'Date',
  'Sun, 03 Mar 2019 00:00:01 GMT',
  'Via',
  '1.1 google',
  'Alt-Svc',
  'clear',
  'Connection',
  'close' ]);
