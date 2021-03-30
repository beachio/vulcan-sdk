'use strict';

(function (){
  'use strict';

  const vulcanSDK = {
    callBacks: {
      viewport: {
        get: null,
        getZoomLevel: null
      },
      settings: {
        getBackgroundImage: null,
        getPublicStatus: null,
        getWidgetLink: null,
        getWidgetEmbedSnippet: null,
      },
      objects: {
        get: null
      }
    },

    listeners: {
      selectionUpdated: null,
      objectsCreated: null,
      objectsDeleted: null,
      allObjectsLoaded: null
    },

    onReady: (fn) => {
      if (document.readyState != 'loading') {
        fn();
      } else if (window.addEventListener) {
        // window.addEventListener('load', fn);
        window.addEventListener('DOMContentLoaded', fn);
      } else {
        window.attachEvent('onreadystatechange', function() {
          if (document.readyState != 'loading')
            fn();
        });
      }
    },


    initialize: (options) => {
      const { extensionPoints } = options;
      const recognizedEvents = ['onClick'];
      const listenerMapping = {
        'SELECTION_UPDATED': selectionUpdated,
        'OBJECTS_CREATED': objectsCreated,
        'OBJECTS_DELETED': objectsDeleted,
        'ALL_OBJECTS_LOADED': allObjectsLoaded
      };
      const eventBuses = {};
      Object.keys(extensionPoints).forEach(point => {
        const infos = extensionPoints[point];
        if (infos) {
          infos.forEach(info => {
            // Special handling for event callbacks
            // Register to event buses and filter out event callbacks
            recognizedEvents.forEach(eventType => {
              if (info.hasOwnProperty(eventType)) {
                eventBuses[eventType] = info[eventType];
                delete info[eventType];
              }
            });
    
            window.top.postMessage({...info, point, action: 'initPlugin'}, '*');
          })
        }

      });


      /* Register Event handlers */
      var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

      // Listen to message from parent window
      eventer(messageEvent,function(e) {
        try {
          const eventType = e.data?.eventType; 
          if (eventType && Object.keys(eventBuses).includes(eventType)) {
            eventBuses[eventType].call();
          }

          const listenerType = e.data?.listenerType;
          if (listenerType && Object.keys(listenerMapping).includes(listenerType)) {
            this.listeners[listenerType].call(e.data);
          }

          const callbackType = e.data?.callbackType;
          if (callbackType) {
            const callbackTypeCategory = callbackType.split('/')[0];
            const callbackTypeEvent = callbackType.split('/')[1];
            if (callbackTypeCategory && callbackTypeEvent && this.callBacks[callbackTypeCategory][callbackTypeEvent] instanceof Function)
              this.callBacks[callbackTypeCategory][callbackTypeEvent].call();
          }
        } catch(error) {
          console.log("Error on iframe message event", error)
        }
      });
    },
    // End of Initialize method

    addListener(eventName, callback) {
      window.top.postMessage({ eventName, callback, action: 'addListener' }, '*');
    },
    
    chart: {
      createObject(option) {
        window.top.postMessage({...option, action: 'createObject'}, '*');
      },
      
    }
  }

  vulcanSDK.chart.ui = {
    openDrawer: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/openDrawer'}, '*');
    },
    closeDrawer: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/closeDrawer'}, '*');
    },
    openTreeView: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/openTreeView'}, '*');
    },
    closeTreeView: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/closeTreeView'}, '*');
    },
    openFilterView: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/openFilterView'}, '*');
    },
    closeFilterView: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/closeFilterView'}, '*');
    },
    openDialog: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/openDialog'}, '*');
    },
    closeDialog: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/closeDialog'}, '*');
    },
  };

  vulcanSDK.chart.viewport = {
    get: (url, option, callback) => {
      window.top.postMessage({...option, url, action: 'viewport/get'}, '*');
      this.callBacks.viewport.get = callback;
    },
    set: (url, option) => {
      window.top.postMessage({...option, url, action: 'viewport/set'}, '*');
    },
    setWithAnimation: (url, option) => {
      window.top.postMessage({...option, url, action: 'viewport/setWithAnimation'}, '*');
    },
    zoomToObject: (url, option) => {
      window.top.postMessage({...option, url, action: 'viewport/zoomToObject'}, '*');
    },
    getZoomLevel: (url) => {
      window.top.postMessage({...option, url, action: 'viewport/getZoomLevel'}, '*');
      this.callBacks.viewport.getZoomLevel = callback;
    },
    setZoomLevel: (url, option) => {
      window.top.postMessage({...option, url, action: 'viewport/setZoomLevel'}, '*');
    }
  };

  vulcanSDK.chart.settings = {
    enableBackgroundImage: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/enableBackgroundImage'}, '*');
    },
    setBackgroundImage: (url, option) => {
      window.top.postMessage({...option, url, action: 'viewport/setBackgroundImage'}, '*');
    },
    getBackgroundImage: (url, option, callback) => {
      window.top.postMessage({...option, url, action: 'viewport/getBackgroundImage'}, '*');
      this.callBacks.settings.getBackgroundImage = callback;
    },
    enableGrid: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/enableGrid'}, '*');
    },
    disableGrid: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/disableGrid'}, '*');
    },
    updateGridOptions: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/updateGridOptions'}, '*');
    },
    enableNavigationControl: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/enableNavigationControl'}, '*');
    },
    disableNavigationControl: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/disableNavigationControl'}, '*');
    },
    moveToProject: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/moveToProject'}, '*');
    },
    enablePublicLink: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/enablePublicLink'}, '*');
    },
    disablePublicLink: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/disablePublicLink'}, '*');
    },
    getPublicStatus: (url, option, callback) => {
      window.top.postMessage({...option, url, action: 'viewport/getPublicStatus'}, '*');
      this.callBacks.settings.getPublicStatus = callback;
    },
    getWidgetLink: (url, option, callback) => {
      window.top.postMessage({...option, url, action: 'viewport/getWidgetLink'}, '*');
      this.callBacks.settings.getWidgetLink = callback;
    },
    getWidgetEmbedSnippet: (url, option, callback) => {
      window.top.postMessage({...option, url, action: 'viewport/getWidgetEmbedSnippet'}, '*');
      this.callBacks.settings.getWidgetEmbedSnippet = callback;
    },
    enableWidgetComments: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/enableWidgetComments'}, '*');
    },
    disableWidgetComments: (url, option) => {
      window.top.postMessage({...option, url, action: 'settings/disableWidgetComments'}, '*');
    },
  };

  vulcanSDK.chart.objects = {
    create: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/create'}, '*');
    },
    get: (url, option, callback) => {
      window.top.postMessage({...option, url, action: 'objects/get'}, '*');
      this.callBacks.objects.get = callback;
    },
    update: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/update'}, '*');
    },
    bringForward: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/bringForward'}, '*');
    },
    bringToFront: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/bringToFront'}, '*');
    },
    sendBackward: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/sendBackward'}, '*');
    },
    sendToBack: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/sendToBack'}, '*');
    },
    lock: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/lock'}, '*');
    },
    unlock: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/unlock'}, '*');
    },
    showEditor: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/showEditor'}, '*');
    },
    hideEditor: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/hideEditor'}, '*');
    },
    createSymbol: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/createSymbol'}, '*');
    },
    duplicate: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/duplicate'}, '*');
    },
    changeType: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/changeType'}, '*');
    },
    createGroup: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/createGroup'}, '*');
    },
    addToGroup: (url, option) => {
      window.top.postMessage({...option, url, action: 'objects/addToGroup'}, '*');
    },
  };

  window.vulcanSDK = vulcanSDK;
})();