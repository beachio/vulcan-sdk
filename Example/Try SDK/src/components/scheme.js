const scheme = {
  ui: {
    openDrawer: {
      type: 'model',
      model: {
        url: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'URL',
          model: 'drawerURL',
          placeholder: 'URL',
          required: true
        }
      ]
    },
    openDialog: {
      type: 'model',
      model: {
        url: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'URL',
          model: 'dialogURL',
          placeholder: 'URL',
          required: true
        }
      ]
    }
  },
  viewport: {
    get: {
      type: 'callback'
    },
    set: {
      type: 'model',
      model: {
        x: 0,
        y: 0
      },
      fields: [
        {
          type: 'input',
          inputType: 'number',
          label: 'X',
          model: 'x',
          placeholder: 'Viewport Translate X',
          hint: 'Should be a number value',
          required: true
        },
        {
          type: 'input',
          inputType: 'number',
          label: 'Y',
          model: 'y',
          placeholder: 'Viewport Translate Y',
          hint: 'Number',
          required: true
        }
      ]
    },
    setWithAnimation: {
      type: 'model',
      model: {
        x: 0,
        y: 0
      },
      fields: [
        {
          type: 'input',
          inputType: 'number',
          label: 'X',
          model: 'x',
          placeholder: 'Viewport Translate X',
          hint: 'Should be a number value',
          required: true
        },
        {
          type: 'input',
          inputType: 'number',
          label: 'Y',
          model: 'y',
          placeholder: 'Viewport Translate Y',
          hint: 'Number',
          required: true
        }
      ]
    },
    zoomToObject: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    setZoomLevel: {
      type: 'model',
      model: {
        zoomLevel: 1
      },
      fields: [
        {
          type: 'input',
          inputType: 'number',
          label: 'Zoom Level',
          model: 'zoomLevel',
          max: 0.2,
          min: 5.0,
          step: 0.1,
          required: true,
          validator: ["number"]
        }
      ]
    },
    getZoomLevel: {
      type: 'callback'
    },
  },

  settings: {
    enableBackgroundImage: {
      type: 'model',
      model: {
        bgImageEnabled: false
      },
      fields: [
        {
          type: "switch",
          label: "Enable Background Image",
          model: "bgImageEnabled",
          textOn: "Enabled",
          textOff: "Disabled"
        }
      ]
    },
    setBackgroundImage: {
      type: 'model',
      model: {
        backgroundImage: ''
      },
      fields: [
        {
          type: "image",
          label: "Background Image",
          model: "backgroundImage",
          required: true
        }
      ]
    },
    getBackgroundImage: {
      type: 'callback'
    },
    updateGridOptions: {
      type: 'model',
      model: {
        gridSize: 'Small',
        gridColor: 'Gray',
        gridSnap: false
      },
      fields: [
        {
          type: 'select',
          label: 'Grid Size',
          model: 'gridSize',
          required: true,
          values: ["Small", "Medium", "Large"],
        },
        {
          type: "select",
          label: "Grid Color",
          model: "gridColor",
          values: ["Gray", "Black"],
          required: true,
        },
        {
          type: "switch",
          label: "Snap to Grid",
          model: "gridSnap",
          textOn: "Enabled",
          textOff: "Disabled"
        }
      ]
    },
    getPublicStatus: {
      type: 'callback'
    },
    getWidgetLink: {
      type: 'callback'
    },
    getWidgetEmbedSnippet: {
      type: 'callback'
    },
    moveToProject: {
      type: 'model',
      model: {
        projectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Project Id',
          model: 'projectId',
          required: true
        }
      ]
    },
  },
  objects: {
    create: {
      type: 'model',
      model: {
        type: ''
      },
      fields: [
        {
          type: 'select',
          label: 'Type',
          model: 'type',
          values: [
            { id: 'Base_RectObject', name: 'Rect' },
            { id: 'Base_TextObject', name: 'Text' },
            { id: 'Base_ArrowObject', name: 'Arrow' },
            { id: 'Base_CommentObject', name: 'Comment' },
            { id: 'Base_ImageObject', name: 'Image' },
          ],
          required: true
        }
      ]
    },
    update: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        },
        {
          type: 'input',
          inputType: 'text',
          label: 'Title',
          model: 'title'
        }
      ]
    },
    setSize: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        },
        {
          type: 'input',
          inputType: 'number',
          label: 'Width',
          model: 'width'
        },
        {
          type: 'input',
          inputType: 'number',
          label: 'Height',
          model: 'height'
        }
      ]
    },
    setPosition: {
      type: 'model',
      model: {
        objectId: '',
        x: '',
        y: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        },
        {
          type: 'input',
          inputType: 'number',
          label: 'X',
          model: 'x'
        },
        {
          type: 'input',
          inputType: 'number',
          label: 'Y',
          model: 'y'
        }
      ]
    },
    get: {
      type: 'callback',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    bringForward: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    bringToFront: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    sendBackward: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    sendToBack: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    lock: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    unlock: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    createSymbol: {
      type: 'model',
      model: {
        objectId: '',
        symbolName: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        },
        {
          type: 'input',
          inputType: 'text',
          label: 'Symbol Name',
          model: 'symbolName',
          required: true
        }
      ]
    },
    duplicate: {
      type: 'model',
      model: {
        objectId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        }
      ]
    },
    changeType: {
      type: 'model',
      model: {
        objectId: '',
        type: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        },
        {
          type: 'select',
          label: 'Type',
          model: 'type',
          values: [
            { id: 'Base_RectObject', name: 'Rect' },
            { id: 'Base_TextObject', name: 'Text' },
            { id: 'Base_ArrowObject', name: 'Arrow' },
            { id: 'Base_CommentObject', name: 'Comment' },
            { id: 'Base_ImageObject', name: 'Image' },
          ],
          required: true
        }
      ]
    },
    addToGroup: {
      type: 'model',
      model: {
        objectId: '',
        groupId: ''
      },
      fields: [
        {
          type: 'input',
          inputType: 'text',
          label: 'Object Id',
          model: 'objectId',
          required: true
        },
        {
          type: 'input',
          inputType: 'text',
          label: 'Group Id',
          model: 'groupId',
          required: true
        },
      ]
    },
  }
};

export default scheme;

