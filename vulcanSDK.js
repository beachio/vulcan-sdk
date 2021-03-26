'use strict';

(function (){
  'use strict';

  const vulcanSDK = {
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
      const eventBuses = {};
      Object.keys(extensionPoints).forEach(point => {
        const info = extensionPoints[point];

        // Special handling for event callbacks
        // Register to event buses and filter out event callbacks
        recognizedEvents.forEach(eventType => {
          if (info.hasOwnProperty(eventType)) {
            eventBuses[eventType] = info[eventType];
            delete info[eventType];
          }
        });

        window.top.postMessage({...info, point, action: 'initPlugin'}, '*');
      });


      /* Register Event handlers */
      var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

      // Listen to message from child window
      eventer(messageEvent,function(e) {
        try {
          const eventType = e.data; 
          if (Object.keys(eventBuses).includes(eventType)) {
            eventBuses[eventType].call();
          }
        } catch(error) {
          console.log("Error on iframe message event", error)
        }
      });
    },
    // End of Initialize

    chart: {
      createObject(option) {
        window.top.postMessage({...option, action: 'createObject'}, '*');
      },
      openDrawer(url, option) {
        window.top.postMessage({...option, url, action: 'openDrawer'}, '*');
      }
    }
  }

  window.vulcanSDK = vulcanSDK;
})();