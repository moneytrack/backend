"use strict"
/**
 * Created by Nikolai_Mavrenkov on 22/01/16.
 */

var child_process = require("child_process")

function runA(cmd, options) {
    options = options || {};
    var child = child_process.exec(cmd,options);
    child.stdout.on('data', function(data){
        process.stdout.write(data)
    })
    return child;
}

function runS(cmd, options) {
    options = options || {};
    var stdout = child_process.execSync(cmd,options);
    process.stdout.write(stdout.toString())
}

runA("mvn appengine:devserver");