const panelConfig = {
  tabTitle: "Start Page",
  settings: [
      {id:     "start-type",
       name:   "Select Start Type",
       action: {type:     "select",
                items:    ["page", "block"],
                onChange: (evt) => {  }}},
      {id:     "start-page",
        name:   "Startpage",
        action: {type:        "input",
                placeholder: "page name or block UID",
                description: "Input the page name or block UID you would like to start on. Make sure the correct type is set in the dropdown above",
                onChange:    (evt) => {  }}}
  ]
};


async function onload({extensionAPI}) {
  // set defaults if they dont' exist
  if (!extensionAPI.settings.get('start-type')) {
      await extensionAPI.settings.set('start-type', "page");
  }
  
  // get the last bit of the url
  // when at the default roam start page this will be the graph name
  // everywhere else it would be the page uid
  let location = window.location.href.split("/").filter(n => n).slice(-1)[0]


  if (roamAlphaAPI.graph.name==location) {
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
