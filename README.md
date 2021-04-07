# Unsplash

Official Javascript wrapper for the [Vulcan](https://vulcanapp.com/) SDK.

## Documentation

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [Methods](#methods)

## Installation

At the moment, you have to go with manual installation yet. Just download vulcanSDK.js and include in your HTML, you are ready to go.

## Dependencies

Yay, no Dependencies yet. True that it's an infantary stage, but still, Yay!

## Usage

### Extension Points

To use Vulcan SDK, you don't have to initialize SDK instance, but you do to register the extension points.

```js
vulcanSDK.initialize({
  extensionPoints: {
    leftBar: [{
      title: 'MY PLUGIN TITLE',
      icon: iconSticky,
      iconType: 'svg',
      slug: 'my-plugin-title',
      onClick: () => {
        ...
      }
    }]
  }
});
```
#### Possible Extension Points
`leftbar`, `bottomNavBar`, `topRightBar`, `chartTabBarTabItem`, `chartTabBarButtonItem`, `propertyEditor` and `imagePickerTab`.


#### Possible Icon Type
Supports `svg` and `material-icons` at the moment.


### Making a request

#### Send a command

We have mainly three namespaces at the time of writing `ui`, `viewport`, and `chart`.

Sending command is straightforward, note that some methods may need additional options to be sent along.
```ts
vulcanSDK.chart.ui.openTreeView();
vulcanSDK.chart.objects.create(
  {
    type: "Rect",
    width: "300",
    height: "100",
    text: "This is custom object created from Forge hosted plugin",
    backgroundColor: '#aeaeae'
  }
);
```

#### Callback

Getters use callback to get the information back from vulcan.

```ts
vulcanSDK.chart.viewport.get(function(value) {});
vulcanSDK.chart.objects.get('OBJECT_ID', function(value) {});
```

#### Listener

You can add listeners with `addListener` method.

```ts
vulcanSDK.addListener('SELECTION_UPDATED');
```


## Example

`samples` folder contains rather straightforward samples with static HTML. 
`Example` folder allows you to experiment the SDK in full mode. As a Vue application itself, to run the Example application
  - `yarn` or `npm install`
  - `yarn serve` or `npm serve` to run the server on http://localhost:8087
  - To fully test it you should embed it, like what you can see in `samples/openDrawer.html`. Please change the url to http://localhost:8087 in the example html file.


## Methods

We will pick up just several methods worthy to mention here. To fully understand what SDK provides, we highly recommend you to check Example.

### chart.ui.openDrawer(url, callback)

**Arguments**

| Argument            | Type       | Optional/Required | Default    |
| ------------------- | ---------- | ----------------- | ---------- |
| **`url`**           | _string_   | Required          |            |
| **`option`**        | _object_   | Optional          |            |

**Example**

```js
vulcanSDK.chart.ui.openDrawer('https://www.vulcanapp.com', { 
  title: 'My Plugin', 
  width: 375, 
  height: 490 
});
```

### chart.settings.moveToProject(option)

**Arguments / option**
`options` is an object with `projectId` as a one attribute.

| Argument          | Type     | Opt/Required | Default |
| ----------------- | -------- | ------------ | ------- |
| **`projectId`**   | _string_ | Required     |         |

### chart.settings.updateGridOptions(option)

**Arguments / option**
`options` is an object with following attributes

| Argument          | Type      | Opt/Required | Default |
| ----------------- | --------  | ------------ | ------- |
| **`gridSize`**    | _string_  | Required     |         |
| **`gridColor`**   | _string_  | Required     |         |
| **`gridSnap`**    | _boolean_ | Required    |         |

`gridSize` to be one of `large`, `medium`, `small`, `gridColor` to be one of `grey` or `black` at the time of writing.

### chart.objects.create(option)

**Arguments / option**
`options` is an object with `type` as required field and you can specify the other attributes available to that type of object. 
| Argument      | Type     | Opt/Required | Default |
| ------------- | -------- | ------------ | ------- |
| **`type`**    | _string_ | Required     |         |


**Example**

```js
vulcanSDK.chart.objects.create(
  {
    type: "Rect",
    width: "300",
    height: "100",
    text: "This is custom object created from Forge hosted plugin",
    backgroundColor: '#aeaeae'
  }
);
```
