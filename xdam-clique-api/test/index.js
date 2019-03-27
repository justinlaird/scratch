const QUnit = require('qunit');

QUnit.on("runEnd", () => {
  process.nextTick(() => {
    process.exit(process.exitCode);
  });
});
