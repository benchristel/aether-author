"use strict"

var STORKEY = "writers-block-fa09svoikw90"

$.fn.invisible = function() {
    return this.each(function() {
        $(this).css("visibility", "hidden");
    });
};
$.fn.visible = function() {
    return this.each(function() {
        $(this).css("visibility", "visible");
    });
}

$(document).ready(function() {
    var $input = $('#input'),
        $save = $('#save'),
        $wordCount = $('#wordCount'),
        saveButtonVisible = false

    $save.invisible()


    var updateWordCount = _.debounce(function() {
        //var s = String(Math.floor($input.val().length / 102.4) / 10)+" kb"
        //$wordCount.text(s)
    }, 2000)

    var saveToLocalStorage = function(key, text) {
        window.localStorage && (window.localStorage[key] = text)
    }

    var loadFromLocalStorage = function(key) {
        return window.localStorage && window.localStorage[key]
    }

    $input.val(loadFromLocalStorage(STORKEY) || '')

    var saveWorkingCopy = _.debounce(function() {
        saveToLocalStorage(STORKEY, $input.val())
    }, 2000)


    var inputLength = 0
    $input.keyup(function(evt) {
        console.log("keyup", evt)
        if (!saveButtonVisible && $input.val().length > 20) {
            $('#save').css('opacity',0)
            $('#save').visible().animate({opacity:1}, 200)
            saveButtonVisible = true
        }
        if (inputLength != $input.val().length) {
            updateWordCount()
            saveWorkingCopy()
            inputLength = $input.val().length
        }
    })

    $save.click(function(evt) {
        var textblob = new Blob([$input.val()], {type: "text/plain;charset=utf-8"})
        saveAs(textblob, "writing.txt")
        saveToLocalStorage(STORKEY, '')
    })

    $input.blur(function() { $input.focus() })
    $input.focus()
    updateWordCount()
})
