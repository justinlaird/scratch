/**
 * Service for toggling overlays where triggers may be distant in the DOM tree
 * @namespace overlayManager
 */

import Service from '@ember/service';
import { action } from '@ember-decorators/object';

export default class OverlaysService extends Service {
  overlays = {};

  /**
   * Register a component whose life cycle will be managed by the overlay-manager service
   * @param {Ember.Component} overlayComponent - The ember component which will be referenced overlay management
   * @param {string}          overlaySlug - Unique slug used to reference overlay
   */
  registerOverlay(overlayComponent, overlaySlug) {
    if (typeof this.get(`overlays.${overlaySlug}`) !== 'undefined') {
      throw new Error('Overlays must be registered with unique slug');
    }

    this.set(`overlays.${overlaySlug}`, overlayComponent);
  }

  unRegisterOverlay(overlaySlug) {
    this.set(`overlays.${overlaySlug}`, void 0);
  }

  /** @param {string} overlaySlug */
  @action
  toggleOverlay(overlaySlug, ...args) {
    return this.get(`overlays.${overlaySlug}`).toggle(...args);
  }
}
