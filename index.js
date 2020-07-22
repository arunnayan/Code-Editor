$ = require("jquery");
require("jstree");
// $ will take care for jstree also as jstree is built on top ///of jquery
const nodePath = require("path");
const fs = require("fs");

//for terminal
var os = require("os");
var pty = require("node-pty");
var Terminal = require("xterm").Terminal;

$(document).ready(async function () {
  //terminal
  // Initialize node-pty with an appropriate shell

  //refer: https://github.com/microsoft/node-pty/blob/master/examples/electron/renderer.js
  const shell = process.env[os.platform() === "win32" ? "COMSPEC" : "SHELL"];
  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: process.env,
  });

  // Initialize xterm.js and attach it to the DOM
  const xterm = new Terminal();
  xterm.open(document.getElementById("terminal"));
  // Setup communication between xterm.js and node-pty
  xterm.onData((data) => ptyProcess.write(data));
  ptyProcess.on("data", function (data) {
    xterm.write(data);
  });
  //end terminal

  let editor = createEditor();
  console.log(editor);

  //start editor

  //end editor

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
    })
    .on("select_node.jstree", function (e, data) {
      console.log(data.node.id);

      openFile(data.node.id);
      updateFile(data.node.id);
    });

  function openFile(path) {
    console.log(path);
  }

  function updateFile(path) {
    console.log(path);
  }
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

function createEditor() {
  return new Promise(function (resolve, reject) {
    let monacoeditor = require("./node_modules/monaco-editor/min/vs/loader.js");
    console.log(monacoeditor);
    monacoeditor.require.config({
      paths: { vs: "./node_modules/monaco-editor/min/vs" },
    });

    monacoeditor.require(["vs/editor/editor.main"], function () {
      var editor = monaco.editor.create(document.getElementById("editor"), {
        value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
          "\n"
        ),
        language: "javascript",
      });
      resolve(editor);
    });
  });
}
