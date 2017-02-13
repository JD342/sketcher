'use strict';

const { dirname } = require('path');

exports.currDoc = () => {
    return document.currentScript.ownerDocument;
};

exports.currDocDir = () => {
    return dirname(exports.currDoc().URL);
};
