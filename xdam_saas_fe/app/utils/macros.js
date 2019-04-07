import { macro } from '@ember-decorators/object/computed';
import { array } from 'ember-awesome-macros';
import hashMacro from 'ember-awesome-macros/hash';
import getByMacro from 'ember-awesome-macros/get-by';

import { task as taskMacro } from 'ember-concurrency';

/* ======== Ember awesome macros ======== */
export const hash = macro(hashMacro);
export const getBy = macro(getByMacro);
export const findBy = macro(array.findBy);

/* ======== Ember concurrency ======== */
export const task = macro(taskMacro);
export const taskDrop = macro((generator) => taskMacro(generator).drop());

