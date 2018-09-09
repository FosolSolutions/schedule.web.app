//------------------------------------------------------------------------------
// Purpose
//------------------------------------------------------------------------------
// This module contains mocked backend endpoint responses for testing. If
// responses are trivially mocked and compact, no need to place them here. This
// is mainly meant for responses that are large and recorded using nock. To
// re-record, remove all other nock() calls and call nock.recorder.rec() before
// making a call to an endpoint in a test. The relevant response data will be
// output to the console. Or, if possible, hit the endpoint in a browser.
