const panelConfig = {
  tabTitle: "Start Page",
  settings: [
      {id:     "start-type",
       name:   "Select Start Type",
       action: {type:     "select",
                items:    ["page", "block"],
                onChange: (evt) => { console.log("Select Changed!", evt); }}},
      {id:     "start-page",
        name:   "Startpage",
        action: {type:        "input",
                placeholder: "page name or block UID",
                description: "Input the page name or block UID you would like to start on. Make sure the correct type is set in the dropdown above",
                onChange:    (evt) => { console.log("Input Changed!", evt); }}}
  ]
};


async function onload({extensionAPI}) {
  // set defaults if they dont' exist
  if (!extensionAPI.settings.get('start-type')) {
      await extensionAPI.settings.set('start-type', "page");
  }

  let graphName = roamAlphaAPI.graph.name;
  if (roamAlphaAPI.graph.type == "hosted") {
    let rootLocation = "https://roamresearch.com/#/app/"+graphName;
  } else if (roamAlphaAPI.graph.type == "offline") {
    let rootLocation = "https://roamresearch.com/#/offline/"+graphName;
  }
  
  let location = window.location.href;

  if (rootLocation==location) {
    // check if we are actually at the default roam first page
    if (extensionAPI.settings.get('start-page')) {
      let startType = extensionAPI.settings.get('start-type');

      if (startType=="page") {

        window.roamAlphaAPI.ui.mainWindow.openPage(
          {page: {title: extensionAPI.settings.get('start-page')}})

      } else if (startType=="block") {

        // strip out paranthesis if user accidentally left them in
        let block = extensionAPI.settings.get('start-page')
        block = block.replaceAll('(', '').replaceAll(')', '');

        window.roamAlphaAPI.ui.mainWindow.openPage(
          {page: {uid: block}})
      } 
    }
  }

  extensionAPI.settings.panel.create(panelConfig);

  console.log("load startpage plugin");
}

function onunload() {
  console.log("unload startpage plugin");
}

export default {
onload,
onunload
};
