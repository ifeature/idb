/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */

/**
 * Credit: https://github.com/google/material-design-lite/issues/1491
 */
MaterialMenu.prototype.init = function () {
  if (this.element_) {
    // Create container for the menu.
    var container = document.createElement('div');
    container.classList.add(this.CssClasses_.CONTAINER);
    this.element_.parentElement.insertBefore(container, this.element_);
    this.element_.parentElement.removeChild(this.element_);
    container.appendChild(this.element_);
    this.container_ = container;
    // Create outline for the menu (shadow and background).
    var outline = document.createElement('div');
    outline.classList.add(this.CssClasses_.OUTLINE);
    this.outline_ = outline;
    container.insertBefore(outline, this.element_);
    // Find the "for" element and bind events to it.
    var forElId = this.element_.getAttribute('for');
    var forEl = null;
    if (forElId) {
      forEl = document.getElementById(forElId);

      // ***** START OF NEW CODE *****
      if (!forEl) {
        var buttonsFound = this.element_.parentElement.parentElement.getElementsByTagName("button");
        for (var btn = 0; btn < buttonsFound.length; btn++) {
          if (buttonsFound[btn].getAttribute("id") === forElId) {
            forEl = buttonsFound[btn];
          }
        }
      }
      // ***** END OF NEW CODE *****

      if (forEl) {
        this.forElement_ = forEl;
        forEl.addEventListener('click', this.handleForClick_.bind(this));
        forEl.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this));
      }
    }
    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
    this.boundItemKeydown = this.handleItemKeyboardEvent_.bind(this);
    this.boundItemClick = this.handleItemClick_.bind(this);
    for (var i = 0; i < items.length; i++) {
      // Add a listener to each menu item.
      items[i].addEventListener('click', this.boundItemClick);
      // Add a tab index to each menu item.
      items[i].tabIndex = '-1';
      // Add a keyboard listener to each menu item.
      items[i].addEventListener('keydown', this.boundItemKeydown);
    }
    // Add ripple classes to each item, if the user has enabled ripples.
    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
      for (i = 0; i < items.length; i++) {
        var item = items[i];
        var rippleContainer = document.createElement('span');
        rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
        var ripple = document.createElement('span');
        ripple.classList.add(this.CssClasses_.RIPPLE);
        rippleContainer.appendChild(ripple);
        item.appendChild(rippleContainer);
        item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
      }
    }
    // Copy alignment classes to the container, so the outline can use them.
    if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
      this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
    }
    if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
      this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
    }
    if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
      this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
    }
    if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
      this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
    }
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
      this.outline_.classList.add(this.CssClasses_.UNALIGNED);
    }
    container.classList.add(this.CssClasses_.IS_UPGRADED);
  }
};







(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        // Check to see if there's an updated version of service-worker.js with
        // new files to cache:
        // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-update-method
        if (typeof registration.update === 'function') {
          registration.update();
        }

        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function() {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function() {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                // Ignore
              }
            };
          }
        };
      }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here

  let db;
  let openRequest;
  const dbName = 'addressBook.db';
  const dbVersion = 1;
  const storeName = 'users';

  function indexedDBOk() {
    return 'indexedDB' in window;
  }

  function checkValidity(fields) {
    return fields.every(function(field) {
      return field.value && !field.validity.typeMismatch;
    });
  }

  function showError(errorName, errorMessage) {
    errorName = errorName || 'Unknown error';
    errorMessage = errorMessage || '';

    const tpl = document.getElementById('error-template');
    const dialog = tpl.content.firstElementChild.cloneNode(true);
    dialog.innerHTML = dialog.innerHTML
      .replace(/{{errorName}}/ig, errorName)
      .replace(/{{errorMessage}}/ig, errorMessage);

    document.body.appendChild(dialog);

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    dialog.showModal();

    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
      dialog.remove();
    });
  }

  class Snackbar {
    constructor() {
      if (!Snackbar.element) {
        this.element = Snackbar.create();
        Snackbar.element = this.element;
      } else {
        this.element = Snackbar.element;
      }
    }
    static create() {
      const tpl = document.getElementById('snackbar-template');
      const snackbar = tpl.content.cloneNode(true);

      document.body.appendChild(snackbar);
      return snackbar;
    }
    show(message) {
      const snackbarContainer = document.getElementById('demo-toast-example');

      const data = {message: message};

      // Bottleneck
      setTimeout(function() {
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }, 2000);

      return this;
    }
  }
  /**
   * Action-list issue :C
   */
  function updateTable() {
    let tbody = document.getElementById('users').tBodies[0];
    while (tbody.hasChildNodes()) {
      tbody.firstElementChild.remove();
    }

    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const requestAmount = objectStore.count();
    const request = objectStore.openCursor(null, 'next');

    request.addEventListener('success', function(event) {
      const cursor = event.target.result;

      if (cursor) {
        addRecord(cursor.key, cursor.value);
        cursor.continue();
      }
    });

    requestAmount.addEventListener('success', function(event) {
      const result = event.target.result;
      document.getElementById('totalAmout').innerHTML = result;
    });

    function addRecord(key, value) {
      let tpl = document.getElementById('record-template');
      let tableRow = tpl.content.firstElementChild.cloneNode(true);

      tableRow.innerHTML = tableRow.innerHTML
        .replace(/{{id}}/ig, key)
        .replace(/{{userName}}/ig, value.userName)
        .replace(/{{userCountry}}/ig, value.userCountry)
        .replace(/{{userEmail}}/ig, value.userEmail);

      const menuButton = tableRow.querySelector('.show-actions-button');
      const menu = tableRow.querySelector('.actions-menu');
      componentHandler.upgradeElement(menuButton, "MaterialButton");
      componentHandler.upgradeElement(menu, "MaterialMenu");

      tbody.appendChild(tableRow);

      var deleteUserBtn = tableRow.querySelector('.delete-user-button');
      deleteUserBtn.addEventListener('click', function() {
        deleteUser(key);
      });

      var editUserBtn = tableRow.querySelector('.edit-user-button');

      const user = {
        userName: value.userName,
        userCountry: value.userCountry,
        userEmail: value.userEmail,
        id: key
      };
      editUserBtn.addEventListener('click', function() {
        showDialog('Edit user', true, user);
      });
    }

  }

  function addUser(user) {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(user);

    request.addEventListener('error', function(event) {
      const error = event.target.error;
      showError(error.name, error.message);
    });

    request.addEventListener('success', function(event) {
      const result = event.target.result;
    });

    transaction.addEventListener('complete', function(event) {
      showSnackBar('User was added');
      updateTable();
    });
  }

  function deleteUser(id) {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    request.addEventListener('error', function(event) {
      const error = event.target.error;
      showError(error.name, error.message);
    });

    request.addEventListener('success', function(event) {
      const result = event.target.result;
    });

    transaction.addEventListener('complete', function(event) {
      showSnackBar('User was deleted');
      updateTable();
    });
  }

  function editUser(user) {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.put(user);

    request.addEventListener('error', function(event) {
      const error = event.target.error;
      showError(error.name, error.message);
    });

    request.addEventListener('success', function(event) {
      const result = event.target.result;
    });

    transaction.addEventListener('complete', function(event) {
      showSnackBar('User was edited');
      updateTable();
    });
  }

  function showDialog(dialogTitle, userEdit, userObj) {
    let user = {};

    var dialog = document.querySelector('dialog');
    var title = dialog.querySelector('.mdl-dialog__title');
    var userName = dialog.querySelector('#userName');
    var userCountry = dialog.querySelector('#userCountry');
    var userEmail = dialog.querySelector('#userEmail');

    if (userEdit) {
      userName.value = userObj.userName;
      userCountry.value = userObj.userCountry;
      userEmail.value = userObj.userEmail;
    }

    while (title.hasChildNodes()) {
      title.firstChild.remove();
    }

    title.appendChild(document.createTextNode(dialogTitle));

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    dialog.showModal();

    dialog.querySelector('.close').addEventListener('click', function() {
      if (dialog.hasAttribute('open')) {
        dialog.close();
      }
    });

    dialog.querySelector('.agree').addEventListener('click', function () {
      if (checkValidity([userName, userCountry, userEmail])) {
        user.userName = userName.value;
        user.userCountry = userCountry.value;
        user.userEmail = userEmail.value;
        
        if (userEdit) {
          console.log('Editing');
          user.id = userObj.id;
          editUser(user);
        } else {
          console.log('Adding');
          addUser(user);
        }

        userName.value = '';
        userCountry.value = '';
        userEmail.value = '';
      }
      if (dialog.hasAttribute('open')) {
        dialog.close();
      }
    });

  }

  function showSnackBar(message) {
    new Snackbar().show(message);
  }

  document.addEventListener('DOMContentLoaded', main);

  function main() {
    if (!indexedDBOk()) return;

    /**
     * For developing purposes only!
     */
    function deleteDB() {
      const DBDeleteRequest = indexedDB.deleteDatabase(dbName);

      DBDeleteRequest.onerror = function(event) {
        showSnackBar(`Error: ${event.errorCode}`);
      };

      DBDeleteRequest.onsuccess = function(event) {
        showSnackBar('DB was deleted successfully');
      };
    }

    // deleteDB();

    openRequest = indexedDB.open(dbName, dbVersion);

    openRequest.addEventListener('blocked', function(event) {
      const error = event.target.error;

      showSnackBar('Connection request was blocked');
    });

    openRequest.addEventListener('error', function(event) {
      const error = event.target.error;
      showError(error.name, error.message);
    });

    openRequest.addEventListener('upgradeneeded', function(event) {
      const thisDB = event.target.result;

      // For developing purposes only!
      // thisDB.deleteObjectStore(storeName);

      if (!thisDB.objectStoreNames.contains(storeName)) {
        const objectStore = thisDB.createObjectStore(storeName, {keyPath: 'id', autoIncrement: true});
        objectStore.createIndex('idxEmail', 'userEmail', {unique: true});
        objectStore.createIndex('idxCountry', 'userCountry', {unique: false});
      }

      showSnackBar('DB was initialized / created');
    });

    openRequest.addEventListener('success', function(event) {
      db = event.target.result;

      showSnackBar('DB was loaded successfully');
      updateTable();
    });

    const addUserButton = document.getElementById('add');
    addUserButton.addEventListener('click', function() {
      showDialog('Add new user', false);
    });

  }

})();
