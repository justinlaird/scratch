module.exports = {
  // TODO: refactor to use hapi plugin auth scheme of test, or at least pull the
  // auth token generator into its own file that does not require starting the
  // server to grab the token from the header.
  //
  // @see github.com/hapijs/shot for how hapi injects a request that will be handled
  // by a http(s) server, w/o having to call listen on a scheme://host:port when running
  // its tests.
  authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJZCI6InVzNWNjYTJlLTBkZDgtNGI5NS04Y2ZjLWExMTIzMGU3MzExNiJ9LCJpYXQiOjE1MzY5Nzc0MDcsImV4cCI6MTY5NDY1NzQwN30.x9uUDueKrnqPjsFaMmvUP-q3ZFGrI-9z5BiLCX0RRxErpKn9Ynd0WOZ0hfCmNCIDiKrpx44mBQ53V-0Pgg9kSg',
};
