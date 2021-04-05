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
        'SELECTION_UPDATED': 'selectionUpdated',
        'OBJECTS_CREATED': 'objectsCreated',
        'OBJECTS_DELETED': 'objectsDeleted',
        'ALL_OBJECTS_LOADED': 'allObjectsLoaded'
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

      // IMPORTANT
      // Listen to message from parent window
      // - eventType: onClick, etc
      // - listenerType: SELECTION_UPDATED, OBJECTS_CREATED, OBJECTS_UPDATED
      // - callbackType: viewport/get, settings/getWidgetLink, etc 
      eventer(messageEvent,function(e) {
        try {
          console.log("localhost:8087", e);
          // - eventType: onClick, etc
          const eventType = e.data?.eventType; 
          if (eventType && Object.keys(eventBuses).includes(eventType)) {
            eventBuses[eventType].call();
          }

          // - listenerType: SELECTION_UPDATED, OBJECTS_CREATED, OBJECTS_UPDATED
          const listenerType = e.data?.listenerType;
          if (listenerType && Object.keys(listenerMapping).includes(listenerType)) {
            if (listenerMapping[listenerType] && vulcanSDK.listeners[listenerMapping[listenerType]] instanceof Function)
              vulcanSDK.listeners[listenerType].call(null, e.data);
          }

          // - callbackType: viewport/get, settings/getWidgetLink, etc 
          const callbackType = e.data?.callbackType;
          if (callbackType) {
            const callbackTypeCategory = callbackType.split('/')[0];
            const callbackTypeEvent = callbackType.split('/')[1];
            if (callbackTypeCategory && callbackTypeEvent && vulcanSDK.callBacks[callbackTypeCategory][callbackTypeEvent] instanceof Function)
              vulcanSDK.callBacks[callbackTypeCategory][callbackTypeEvent].call(null, e.data.options);
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
    
    chart: {}
  }

  vulcanSDK.chart.ui = {
    openDrawer: (url, option) => {
      window.top.postMessage({...option, url, action: 'ui/openDrawer'}, '*');
    },
    closeDrawer: () => {
      window.top.postMessage({action: 'ui/closeDrawer'}, '*');
    },
    openTreeView: (option) => {
      window.top.postMessage({...option, action: 'ui/openTreeView'}, '*');
    },
    closeTreeView: () => {
      window.top.postMessage({action: 'ui/closeTreeView'}, '*');
    },
    openFilterView: (option) => {
      window.top.postMessage({...option, action: 'ui/openFilterView'}, '*');
    },
    closeFilterView: () => {
      window.top.postMessage({action: 'ui/closeFilterView'}, '*');
    },
    openDialog: (option) => {
      window.top.postMessage({...option, action: 'ui/openDialog'}, '*');
    },
    closeDialog: () => {
      window.top.postMessage({action: 'ui/closeDialog'}, '*');
    },
  };

  vulcanSDK.chart.viewport = {
    get: (callback) => {
      window.top.postMessage({action: 'viewport/get'}, '*');
      vulcanSDK.callBacks.viewport.get = callback;
    },
    // option = { x, y } : Setting viewport translate
    set: (option) => {
      window.top.postMessage({...option, action: 'viewport/set'}, '*');
    },
    setWithAnimation: (option) => {
      window.top.postMessage({...option, action: 'viewport/setWithAnimation'}, '*');
    },
    zoomToObject: (option) => {
      window.top.postMessage({...option, action: 'viewport/zoomToObject'}, '*');
    },
    getZoomLevel: (callback) => {
      window.top.postMessage({action: 'viewport/getZoomLevel'}, '*');
      vulcanSDK.callBacks.viewport.getZoomLevel = callback;
    },
    setZoomLevel: (option) => {
      window.top.postMessage({...option, action: 'viewport/setZoomLevel'}, '*');
    }
  };

  vulcanSDK.chart.settings = {
    enableBackgroundImage: (option) => {
      window.top.postMessage({...option, action: 'settings/enableBackgroundImage'}, '*');
    },
    setBackgroundImage: (option) => {
      window.top.postMessage({...option, action: 'settings/setBackgroundImage'}, '*');
    },
    getBackgroundImage: (option, callback) => {
      window.top.postMessage({...option, action: 'settings/getBackgroundImage'}, '*');
      vulcanSDK.callBacks.settings.getBackgroundImage = callback;
    },
    enableGrid: (option) => {
      window.top.postMessage({...option, action: 'settings/enableGrid'}, '*');
    },
    disableGrid: (option) => {
      window.top.postMessage({...option, action: 'settings/disableGrid'}, '*');
    },
    // option = {gridSize, gridColor, gridSnap}
    updateGridOptions: (option) => {
      window.top.postMessage({...option, action: 'settings/updateGridOptions'}, '*');
    },
    enableNavigationControl: () => {
      window.top.postMessage({action: 'settings/enableNavigationControl'}, '*');
    },
    disableNavigationControl: () => {
      window.top.postMessage({action: 'settings/disableNavigationControl'}, '*');
    },
    // option = { projectId }
    moveToProject: (option) => {
      window.top.postMessage({...option, action: 'settings/moveToProject'}, '*');
    },
    enablePublicLink: () => {
      window.top.postMessage({action: 'settings/enablePublicLink'}, '*');
    },
    disablePublicLink: () => {
      window.top.postMessage({action: 'settings/disablePublicLink'}, '*');
    },
    getPublicStatus: (option, callback) => {
      window.top.postMessage({...option, action: 'settings/getPublicStatus'}, '*');
      vulcanSDK.callBacks.settings.getPublicStatus = callback;
    },
    getWidgetLink: (option, callback) => {
      window.top.postMessage({...option, action: 'settings/getWidgetLink'}, '*');
      vulcanSDK.callBacks.settings.getWidgetLink = callback;
    },
    getWidgetEmbedSnippet: (option, callback) => {
      window.top.postMessage({...option, action: 'settings/getWidgetEmbedSnippet'}, '*');
      vulcanSDK.callBacks.settings.getWidgetEmbedSnippet = callback;
    },
    enableWidgetComments: (option) => {
      window.top.postMessage({...option, action: 'settings/enableWidgetComments'}, '*');
    },
    disableWidgetComments: (option) => {
      window.top.postMessage({...option, action: 'settings/disableWidgetComments'}, '*');
    },
  };

  vulcanSDK.chart.objects = {
    create: (option) => {
      window.top.postMessage({...option, action: 'objects/create'}, '*');
    },
    get: (option, callback) => {
      window.top.postMessage({...option, action: 'objects/get'}, '*');
      vulcanSDK.callBacks.objects.get = callback;
    },
    update: (option) => {
      window.top.postMessage({...option, action: 'objects/update'}, '*');
    },
    // option = { objectId }
    bringForward: (option) => {
      window.top.postMessage({...option, action: 'objects/bringForward'}, '*');
    },
    // option = { objectId }
    bringToFront: (option) => {
      window.top.postMessage({...option, action: 'objects/bringToFront'}, '*');
    },
    // option = { objectId }
    sendBackward: (option) => {
      window.top.postMessage({...option, action: 'objects/sendBackward'}, '*');
    },
    // option = { objectId }
    sendToBack: (option) => {
      window.top.postMessage({...option, action: 'objects/sendToBack'}, '*');
    },
    // option = { objectId }
    lock: (option) => {
      window.top.postMessage({...option, action: 'objects/lock'}, '*');
    },
    // option = { objectId }
    unlock: (option) => {
      window.top.postMessage({...option, action: 'objects/unlock'}, '*');
    },
    // option = { objectId }
    showEditor: (option) => {
      window.top.postMessage({...option, action: 'objects/showEditor'}, '*');
    },
    // option = { objectId }
    hideEditor: (option) => {
      window.top.postMessage({...option, action: 'objects/hideEditor'}, '*');
    },
    // option = { objectId, symbolName }
    createSymbol: (option) => {
      window.top.postMessage({...option, action: 'objects/createSymbol'}, '*');
    },
    // option = { objectId }
    duplicate: (option) => {
      window.top.postMessage({...option, action: 'objects/duplicate'}, '*');
    },
    // option = { objectId, type }
    changeType: (option) => {
      window.top.postMessage({...option, action: 'objects/changeType'}, '*');
    },
    createGroup: (option) => {
      window.top.postMessage({...option, action: 'objects/createGroup'}, '*');
    },
    // option = { objectId, groupId }
    addToGroup: (option) => {
      window.top.postMessage({...option, action: 'objects/addToGroup'}, '*');
    },
  };

  window.vulcanSDK = vulcanSDK;
})();