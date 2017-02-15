'use strict';

const { dirname } = require('path');

exports.getCurrDoc = () => {
    return document.currentScript.ownerDocument;
};

exports.getCurrDocDir = () => {
    return dirname(exports.currDoc().URL);
};
