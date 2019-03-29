import Application from '../app';
import config from '../config/environment';
import {
  setApplication
} from '@ember/test-helpers';
import {
  start
} from 'ember-qunit';
import loadEmberExam from 'ember-exam/test-support/load';
import sassVariables from 'xdam-saas-fe/utils/sass-variables';

/* global QUnit */
QUnit.begin(() => {
  if (window.innerWidth < sassVariables['$xui-breakpoints'].desktop) {
    throw new Error(`Tests require a minimum screen width of ${sassVariables['$xui-breakpoints'].desktop}px. Please expand the window and/or reduce the size of the dev tools.`);
  }
});

setApplication(Application.create(config.APP));

loadEmberExam();
start();
