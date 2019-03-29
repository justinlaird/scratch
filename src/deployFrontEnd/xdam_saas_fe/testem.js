module.exports = {
  test_page: 'tests/index.html?hidepassed&dockcontainer',
  disable_watching: true,
  growl: !process.env.CI,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        //
        // NOTE: Clique specfic -  when running ember-cli-update it will try
        // to put a process.CI check here, don't commit that.
        // Our CI server needs --no-sandbox b/c we run as root. Will fail with:
        // `Running as root without --no-sandbox is not supported`
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};
