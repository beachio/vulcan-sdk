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

      // Listen to message from parent window
      eventer(messageEvent,function(e) {
        try {
          const eventType = e.data?.eventType; 
          if (eventType && Object.keys(eventBuses).includes(eventType)) {
            eventBuses[eventType].call();
          }

          const listenerType = e.data?.listenerType;
          if (listenerType && Object.keys(listenerMapping).includes(listenerType)) {
            if (listenerMapping[listenerType] && this.listeners[listenerMapping[listenerType]] instanceof Function)
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
    get: (chartId, callback) => {
      window.top.postMessage({chartId, action: 'viewport/get'}, '*');
      this.callBacks.viewport.get = callback;
    },
    set: (chartId, option) => {
      window.top.postMessage({...option, chartId, action: 'viewport/set'}, '*');
    },
    setWithAnimation: (chartId, option) => {
      window.top.postMessage({...option, chartId, action: 'viewport/setWithAnimation'}, '*');
    },
    zoomToObject: (chartId, objectId) => {
      window.top.postMessage({chartId, objectId, action: 'viewport/zoomToObject'}, '*');
    },
    getZoomLevel: (chartId) => {
      window.top.postMessage({chartId, action: 'viewport/getZoomLevel'}, '*');
      this.callBacks.viewport.getZoomLevel = callback;
    },
    setZoomLevel: (chartId, zoomLevel) => {
      window.top.postMessage({chartId, zoomLevel, action: 'viewport/setZoomLevel'}, '*');
    }
  };

  vulcanSDK.chart.settings = {
    enableBackgroundImage: (chartId) => {
      window.top.postMessage({chartId, action: 'settings/enableBackgroundImage'}, '*');
    },
    setBackgroundImage: (chartId, option) => {
      window.top.postMessage({...option, chartId, action: 'viewport/setBackgroundImage'}, '*');
    },
    getBackgroundImage: (chartId, callback) => {
      window.top.postMessage({chartId, action: 'viewport/getBackgroundImage'}, '*');
      this.callBacks.settings.getBackgroundImage = callback;
    },
    enableGrid: (chartId) => {
      window.top.postMessage({chartId, action: 'settings/enableGrid'}, '*');
    },
    disableGrid: (chartId) => {
      window.top.postMessage({chartId, action: 'settings/disableGrid'}, '*');
    },
    updateGridOptions: (chartId, option) => {
      window.top.postMessage({...option, chartId, action: 'settings/updateGridOptions'}, '*');
    },
    enableNavigationControl: (chartId) => {
      window.top.postMessage({chartId, action: 'settings/enableNavigationControl'}, '*');
    },
    disableNavigationControl: () => {
      window.top.postMessage({chartId, action: 'settings/disableNavigationControl'}, '*');
    },
    moveToProject: (chartId, projectId) => {
      window.top.postMessage({chartId, projectId, action: 'settings/moveToProject'}, '*');
    },
    enablePublicLink: (chartId) => {
      window.top.postMessage({chartId, action: 'settings/enablePublicLink'}, '*');
    },
    disablePublicLink: (chartId) => {
      window.top.postMessage({chartId, action: 'settings/disablePublicLink'}, '*');
    },
    getPublicStatus: (chartId, callback) => {
      window.top.postMessage({chartId, action: 'viewport/getPublicStatus'}, '*');
      this.callBacks.settings.getPublicStatus = callback;
    },
    getWidgetLink: (widgetId, callback) => {
      window.top.postMessage({widgetId, action: 'viewport/getWidgetLink'}, '*');
      this.callBacks.settings.getWidgetLink = callback;
    },
    getWidgetEmbedSnippet: (widgetId, callback) => {
      window.top.postMessage({widgetId, action: 'viewport/getWidgetEmbedSnippet'}, '*');
      this.callBacks.settings.getWidgetEmbedSnippet = callback;
    },
    enableWidgetComments: (chartId, objectId) => {
      window.top.postMessage({chartId, objectId, action: 'settings/enableWidgetComments'}, '*');
    },
    disableWidgetComments: (chartId, objectId) => {
      window.top.postMessage({chartId, objectId, action: 'settings/disableWidgetComments'}, '*');
    },
  };

  vulcanSDK.chart.objects = {
    create: (option) => {
      window.top.postMessage({...option, action: 'objects/create'}, '*');
    },
    get: (objectId, callback) => {
      window.top.postMessage({objectId, action: 'objects/get'}, '*');
      this.callBacks.objects.get = callback;
    },
    update: (objectId, option) => {
      window.top.postMessage({...option, objectId, action: 'objects/update'}, '*');
    },
    bringForward: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/bringForward'}, '*');
    },
    bringToFront: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/bringToFront'}, '*');
    },
    sendBackward: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/sendBackward'}, '*');
    },
    sendToBack: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/sendToBack'}, '*');
    },
    lock: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/lock'}, '*');
    },
    unlock: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/unlock'}, '*');
    },
    showEditor: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/showEditor'}, '*');
    },
    hideEditor: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/hideEditor'}, '*');
    },
    createSymbol: (option) => {
      window.top.postMessage({...option, action: 'objects/createSymbol'}, '*');
    },
    duplicate: (objectId) => {
      window.top.postMessage({objectId, action: 'objects/duplicate'}, '*');
    },
    changeType: (objectId, type) => {
      window.top.postMessage({objectId, type, action: 'objects/changeType'}, '*');
    },
    createGroup: (option) => {
      window.top.postMessage({...option, action: 'objects/createGroup'}, '*');
    },
    addToGroup: (groupId, objectId) => {
      window.top.postMessage({objectId, groupId, action: 'objects/addToGroup'}, '*');
    },
  };

  window.vulcanSDK = vulcanSDK;
})();