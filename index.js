$ = require("jquery");
require("jstree");
// $ will take care for jstree also as jstree is built on top ///of jquery
const nodePath = require("path");

const fs = require("fs");

$(document).ready(async function () {
  let currentPath = process.cwd();

  let data = [];
  let baseObject = {
    id: currentPath,
    parent: "#",
    text: getFolderNameFromPath(currentPath),
  };
  let rootChildren = getCurrentDirectories(currentPath);

  data = data.concat(rootChildren);

  data.push(baseObject);

  $("#jstree")
    .jstree({
      core: {
        // so that create works
        check_callback: true,
        data: data,
      },
    })
    .on("open_node.jstree", function (e, data) {
      //console.log(data.node.children);
      data.node.children.forEach(function (child) {
        let childDirectories = getCurrentDirectories(child);

        for (let i = 0; i < childDirectories.length; i++) {
          let granchildren = childDirectories[i];
          $("#jstree").jstree().create_node(child, granchildren, "last");
        }
      });
    });
});

function getCurrentDirectories(path) {
  if (fs.lstatSync(path).isFile()) {
    return [];
  }

  let files = fs.readdirSync(path);
  // console.log(files);

  let rv = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    rv.push({
      id: nodePath.join(path, file),
      parent: path,
      text: file,
    });
  }

  return rv;
}

function getFolderNameFromPath(path) {
  return nodePath.basename(path);
}
