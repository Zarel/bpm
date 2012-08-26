/*******************************************************************************
**
** Copyright (C) 2012 Typhos
**
** This Source Code Form is subject to the terms of the Mozilla Public
** License, v. 2.0. If a copy of the MPL was not distributed with this
** file, You can obtain one at http://mozilla.org/MPL/2.0/.
**
*******************************************************************************/

"use strict";

function process(elements) {
    for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        // Distinction between element.href and element.getAttribute("href")- the
        // former is normalized somewhat to be a complete URL, which we don't want.
        var href = element.getAttribute("href");
        if(href && href[0] == '/') {
            // Don't normalize case...
            var parts = href.split("-");
            var emote = parts[0];
            if(emote_map[emote]) {
                var css_class = emote_map[emote][0];
                var is_nsfw = emote_map[emote][1];

                var nsfw_class = is_nsfw ? " bpmotes-nsfw " : " ";
                element.className += nsfw_class + css_class;

                // It'd be nice to set textContent="NSFW" in the correct cases,
                // but this script doesn't know whether or not the emote is
                // actually enabled. If it is, we don't want it, so for now it's
                // easier just to do the text in CSS (see bpmotes-sfw.css).
                //
                // As an alternative, we could consider adding e.g.
                //    <span class="bpmotes-sfw-only">NSFW</span>
                // And make that class invisible by default. I don't think the
                // complexity is worth it for now, though.
            } else if(!element.textContent && /^\/[\w\-:!]+$/.test(emote) && !element.clientWidth &&
                      window.getComputedStyle(element, ":after").backgroundImage == "none" &&
                      window.getComputedStyle(element, ":before").backgroundImage == "none") {
                // Unknown emote? Good enough
                element.className += " " + "bpmotes-unknown";
                element.textContent = "Unknown emote " + emote;
            }
        }
    }
}

process(document.getElementsByTagName("a"))

var observer = new MutationSummary({
    callback: function(summaries) {
        process(summaries[0].added);
    },
    queries: [
        {element: "a"}
    ]});