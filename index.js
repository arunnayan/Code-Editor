$ = require("jquery");
require("jstree");
// $ will take care for jstree also as jstree is built on top ///of jquery
const nodePath = require("path");
$(document).ready(function () {
  let currentPath = process.cwd();

  let data = [];
  let baseObject = {
    id: currentPath,
    parent: "#",
    text: getFolderNameFromPath(currentPath),
  };
  data.push(baseObject);
  $("#jstree").jstree({
    core: {
      data: data,
    },
  });
});

function getFolderNameFromPath(path) {
  return nodePath.basename(path);
}
