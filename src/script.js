var _figures = {
    circle: {
        name: "circle",
        borderRadius: "50%"
    },
    square: {
        name: "square",
        borderRadius: "0px"
    }
};

var _animationLayout = document.getElementById('animation');
var _position = 1;

var _frameTemplate = document.getElementById('frameTemplate').innerHTML;

var _dragObject = null;

var _currentColor = "lightgray";

var _fps = 1;

var _previousColor = _currentColor;

var _predefineColor1 = _currentColor;
var _predefineColor2 = _currentColor;
var _predefineColor3 = _currentColor;

var _currentAction = paint;

var cell1 = { id: "grid-cell-1", color: _currentColor, figure: _figures.square };
var cell2 = { id: "grid-cell-2", color: _currentColor, figure: _figures.square };
var cell3 = { id: "grid-cell-3", color: _currentColor, figure: _figures.square };
var cell4 = { id: "grid-cell-4", color: _currentColor, figure: _figures.square };
var cell5 = { id: "grid-cell-5", color: _currentColor, figure: _figures.square };
var cell6 = { id: "grid-cell-6", color: _currentColor, figure: _figures.square };
var cell7 = { id: "grid-cell-7", color: _currentColor, figure: _figures.square };
var cell8 = { id: "grid-cell-8", color: _currentColor, figure: _figures.square };
var cell9 = { id: "grid-cell-9", color: _currentColor, figure: _figures.square };

var _elements = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9];

var defaultElements = JSON.parse(JSON.stringify(_elements));

var _frames = [{
    image: "",
    position: 1,
    id: "frame-" + uuidv4(),
    isSelected: true,
    data: _elements
}];

function render() {
    _elements.forEach(function (cell) {
        var element = document.getElementById(cell.id);
        element.style.borderRadius = cell.figure.borderRadius;
        element.style.backgroundColor = cell.color;
    });

    document.getElementById('currentColorBtnInd').style.backgroundColor = _currentColor;
    document.getElementById('prevColorBtnInd').style.backgroundColor = _previousColor;
    document.getElementById('colorBtn1Ind').style.backgroundColor = _predefineColor1;
    document.getElementById('colorBtn2Ind').style.backgroundColor = _predefineColor2;
    document.getElementById('colorBtn3Ind').style.backgroundColor = _predefineColor3;

    var frame = _frames.find(x => x.isSelected);

    if (frame) {
        frame.image = getImage();
    }

    saveInfo();
}

function paint(targetElement) {
    var element = _elements.find(x => x.id == targetElement.id);
    element.color = _currentColor;
};

function chooseColor(targetElement) {
    var element = _elements.find(x => x.id == targetElement.id);
    _previousColor = _currentColor;
    _currentColor = element.color;
};

function transform(targetElement) {
    var element = _elements.find(x => x.id == targetElement.id);
    if (element.figure == _figures.circle) {
        element.figure = _figures.square;
    }
    else {
        element.figure = _figures.circle;
    }
};

function renderFrames() {
    _frames.forEach((x) => {

        var element = document.getElementById(x.id);

        if (!element) {
            var element = document.createElement("li");
            element.innerHTML = _frameTemplate
                .replace("#id#", x.id)
                .replace("#background-image#", x.image)
                .replace("#position#", x.position);
            document.getElementById("frames").appendChild(element);

            element.addEventListener('click', function () { selectFrame(x.id) });
        } else {
            element.parentElement.innerHTML = _frameTemplate
                .replace("#id#", x.id)
                .replace("#background-image#", x.image)
                .replace("#position#", x.position);
        }

        var element = document.getElementById(x.id);

        if (x.isSelected) {
            element.setAttribute("class", "frame frame-selected");
        } else {
            element.setAttribute("class", "frame");
        }
    });
}

function move() { }

function saveInfo() {
    var savedInfo = {
        "_currentColor": _currentColor,
        "_previousColor": _previousColor,
        "_predefineColor1": _predefineColor1,
        "_predefineColor2": _predefineColor2,
        "_predefineColor3": _predefineColor3,
        "elements": _elements
    }

    localStorage.setItem('savedInfo', JSON.stringify(savedInfo));
}

function exportInfo() {
    var savedInfo = JSON.parse(localStorage.getItem('savedInfo'));

    if (savedInfo) {
        _currentColor = savedInfo._currentColor;
        _previousColor = savedInfo._previousColor;
        _predefineColor1 = savedInfo._predefineColor1;
        _predefineColor2 = savedInfo._predefineColor2;
        _predefineColor3 = savedInfo._predefineColor3;
        _elements = savedInfo.elements;

        _frames[0].data = _elements;
    }
}


function init() {
    document.getElementById('paintActionBtn').onclick = function () {
        document.body.style.cursor = "url('asserts/paint.cur'), auto";
        _currentAction = paint;
    };
    document.getElementById('chooseColorActionBtn').onclick = function () {
        document.body.style.cursor = "url('asserts/choose.cur'), auto";
        _currentAction = chooseColor;
    };
    document.getElementById('moveActionBtn').onclick = function () {
        document.body.style.cursor = "url('asserts/move.cur'), auto";
        _currentAction = move;
    };
    document.getElementById('transformActionBtn').onclick = function () {
        document.body.style.cursor = "url('asserts/transform.cur'), auto";
        _currentAction = transform;
    };

    new Picker({
        parent: document.getElementById('currentColorBtnInd'),
        popup: 'top',
        editorFormat: 'hex',
        onDone: function (color) {
            _currentColor = color.hex;
            render();
        },
    });

    new Picker({
        parent: document.getElementById('colorBtn1Ind'),
        popup: 'top',
        editorFormat: 'hex',
        onDone: function (color) {
            _predefineColor1 = color.hex;
            render();
        },
    });

    new Picker({
        parent: document.getElementById('colorBtn2Ind'),
        popup: 'top',
        editorFormat: 'hex',
        onDone: function (color) {
            _predefineColor2 = color.hex;
            render();
        },
    });

    new Picker({
        parent: document.getElementById('colorBtn3Ind'),
        popup: 'top',
        editorFormat: 'hex',
        onDone: function (color) {
            _predefineColor3 = color.hex;
            render();
        },
    });

    document.getElementById('prevColorBtn').onclick = function () {
        var temp = _currentColor;
        _currentColor = _previousColor;
        _previousColor = temp;
    };
    document.getElementById('colorBtn1').onclick = function () {
        _previousColor = _currentColor;
        _currentColor = _predefineColor1;
    };
    document.getElementById('colorBtn2').onclick = function () {
        _previousColor = _currentColor;
        _currentColor = _predefineColor2;
    };
    document.getElementById('colorBtn3').onclick = function () {
        _previousColor = _currentColor;
        _currentColor = _predefineColor3;
    };

    window.addEventListener("click", function (arg) {

        var target;

        if (arg && arg.target) {

            target = arg.target;

            if (target.id.includes("grid-cell")) {
                _currentAction(target);
            }
        }

        render();
    });

    function onMouseDown(event) {

        var temp = document.elementFromPoint(event.clientX, event.clientY);

        if (_currentAction == move && temp) {
            _dragObject = temp;
        }
    }

    function onMouseUp(event) {

        var dropObject = document.elementFromPoint(event.clientX, event.clientY);

        if (_currentAction == move && dropObject && _dragObject) {

            var dragElement = _elements.find(x => x.id == _dragObject.id);
            var dropElement = _elements.find(x => x.id == dropObject.id);

            var temp = { figure: dragElement.figure, color: dragElement.color }

            dragElement.figure = dropElement.figure;
            dragElement.color = dropElement.color;
            dropElement.figure = temp.figure;
            dropElement.color = temp.color;
            render();
        }
    }

    document.getElementById('palette').onmousedown = onMouseDown;
    document.getElementById('palette').onmouseup = onMouseUp;

    var fpsIndicator = document.getElementById('fps-value');
    fpsIndicator.innerText = "12 FPS";

    document.getElementById('fps').onchange = function (e) {
        _fps = Math.round(1 + 23 / 100 * e.target.value);
        fpsIndicator.innerText = _fps + " FPS";
    }

    renderFrames();
};

function createFrame() {
    _frames.push({
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFlElEQVR4Xu3ZQW7CUBAEUTgQ9z8IB0qQiGShWO7a81h7NWLqd03fn8/nz83v9ng87mbx/iOYxbEQ/hR/s/CnOP4UZmFB/r2Z/hQW5CxIeUG8IGBxoRgWxIJYEAuyrxAiloglYl3siQWxIBbEguyn1Jn3Y0YchINwEA6ywSliiVgiloi1SSFiiVhn/xIviBfEC+IF8YKkCRwfkXSSTtJJ+saGiCViiVgi1iYFSSfpJP16T7ymHETu9pqm15Skk3SwIOkbFmIFSSfpYsUmBUkn6SSdpCdSvD7iIByEg3CQzQsOwkE4CAfZpOAgHISDcJBECg4iVoDF9aqQdJJO0kn6flBJuteUpJP0TQqSTtLlbpKeSEHSxQqwIOkJFhwELDgIBwGLNIHjI2deZ15nXmfejQ0RS8QSsUSsTQpnXmdelxtn3kQKZ16xAiyceRMsOAhYcBAOAhZpAs68TptgkVZFD6IHAQs9yIYFB+EgHESs2KTQg+hBnDb1IIkUehCxAiz0IAkWHAQsOAgHAYs0AT2I0yZYpFXRg+hBwEIPsmHBQTgIBxErNin0IHoQp009SCKFHkSsAAs9SIIFBwELDsJBwCJNQA/itAkWaVX0IHoQsNCDbFhwEA7CQcSKTQo9iB7EaVMPkkihBxErwEIPkmDBQcCCg3AQsEgT0IM4bYJFWpV7+spHJvClE1AUKgq9porCjT+STtJJuty9SaEoVBS6/SsKEykUhWIFWCgKEyw4CFhwEA4CFmkCikKnTbBIq6IH0YOAhR5kw4KDcBAOIlZsUuhB9CBOm3qQRAo9iFgBFnqQBAsOAhYchIOARZqAHsRpEyzSquhB9CBgoQfZsOAgHISDiBWbFHoQPYjTph4kkUIPIlaAhR4kwYKDgAUH4SBgkSagB3HaBIu0KnoQPQhY6EE2LDgIB+EgYsUmhR5ED+K0qQdJpNCDiBVgoQdJsOAgYMFBOAhYpAnoQZw2wSKtih5EDwIWepANCw7CQTiIWLFJoQfRgzht6kESKfQgYgVY6EESLDgIWHAQDgIWaQJ6EKdNsEirogfRg4CFHmTDgoNwEA4iVmxS6EH0IE6bepBECj2IWAEWepAECw4CFhyEg4BFmoAexGkTLNKq6EH0IGChB9mw4CAchIOIFZsUehA9iNOmHiSRQg8iVoCFHiTBgoOABQfhIGCRJqAHcdoEi7QqehA9CFjoQTYsOAgH4SBixSaFHkQP4rSpB0mk0IOIFWChB0mw4CBgwUE4CFikCehBnDbBIq2KHkQPAhZ6kA0LDsJBTh1k/3V8YQLfOwERS8QSsUSsTUARS8Ry5nW52aR4fQEWzrxiBVgkWHAQDgIWHGTDQqzgIBxErNik4CAfMxKxRCwRS8Ta4BSxRCwRS8TapBCxRKyzf4kXxAviBfGCeEHSBBSFxBQs0qq4YrligYUr1oYFB+EgHESs2KRwxXLFcsW63hOvKUmXu72m6TUl6SQdLEj6hoVYQdJJulixSUHSSTpJJ+mJFK+POAgH4SAcZPOCg3AQDsJBNik4CAfhIBwkkYKDiBVgcb0qJJ2kk3SSvh9Uku41JekkfZOCpJN0uZukJ1KQdLECLEh6ggUHAQsOwkHAIk3g+MiZ15nXmdeZd2NDxBKxRCwRa5PCmdeZ1+XGmTeRwplXrAALZ94ECw4CFhyEg4BFmoAzr9MmWKRV0YPoQcBCD7JhwUE4CAcRKzYp9CB6EKdNPUgihR5ErAALPUiCBQcBCw7CQcAiTUAP4rQJFmlV9CB6ELDQg2xYcBAOwkHEik0KPYgexGlTD5JIoQcRK8BCD5JgwUHAgoNwELBIE9CDOG2CRVoVPYgeBCz0IBsWHISDcBCxYpNCD6IHcdrUgyRS6EHECrDQgyRYcBCw4CAcBCzSBPQgTptgkVblFyEL4BFb+XnJAAAAAElFTkSuQmCC",
        position: _frames.length + 1,
        id: "frame-" + uuidv4(),
        isSelected: false,
        data: JSON.parse(JSON.stringify(defaultElements))
    });
    renderFrames();
}

function deleteFrame(e) {

    if (_frames.length == 1) {
        _frames[0].data = JSON.parse(JSON.stringify(defaultElements));
        _frames[0].isSelected = true;
        render();
        renderFrames();
        return;
    }

    var elementData = _frames.find(x => x.id == e.parentElement.attributes["id"].value);

    _frames.filter(x => x.position > elementData.position).forEach((x) => {
        x.position--;
    })

    _frames = _frames.filter(x => x.id !== elementData.id);

    e.parentElement.remove();

    renderFrames();
}

function copyFrame(e) {

    var element = _frames.find(x => x.id == e.parentElement.attributes["id"].value);

    _frames.filter(x => x.position > element.position).forEach((x) => {
        x.position++;
    })

    _frames.push({
        image: element.image,
        position: element.position + 1,
        id: "frame-" + uuidv4(),
        isSelected: false,
        data: JSON.parse(JSON.stringify(element.data))
    });

    _frames.sort((a, b) => a.position - b.position);

    document.getElementById("frames").innerHTML = "";

    renderFrames();
}

function selectFrame(frameId) {
    var selectedFrame = _frames.find(x => x.id == frameId);
    _frames.filter(x => x.id !== frameId).forEach((x) => x.isSelected = false);

    if (selectedFrame) {
        selectedFrame.isSelected = true;
        _elements = selectedFrame.data;
    } else {
        _frames[0].isSelected = true;
        _elements = _frames[0].data;
    }

    renderFrames();
    render();
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function getImage() {
    var frame = _frames.find(x => x.isSelected);
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.height = 200;

    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml">' +
        '<style>' +
        '.canvas-grid {width: 100%;height: 100%;display: grid;justify-content: center;grid-template-rows: repeat(3, 66px);grid-template-columns: repeat(3, 66px);grid-gap: 1px;}' +
        '.canvas-grid-item {background-color: gray;}' +
        '</style>' +
        document.getElementById("palette-wrapper").innerHTML +
        '</div></foreignObject></svg>'

    const tempImg = document.createElement('img')
    tempImg.addEventListener('load', onTempImageLoad)
    tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(data);

    let targetImg = document.createElement('img')

    function onTempImageLoad(e) {
        ctx.drawImage(e.target, 0, 0);
        frame.image = canvas.toDataURL();
        renderFrames();
    }

    return targetImg.src;
}

function runAnimation() {
    var frame = _frames.find(x => x.position == _position);
    var delay = 1000 / _fps;

    if (frame) {
        setTimeout(function () {
            _animationLayout.setAttribute("style", "background-image: url(" + frame.image + ")");
            _position = _position < _frames.length ? _position + 1 : 1;
            runAnimation();
        }, delay);
    } else {
        _position = 1;
    }
}

init();
exportInfo();
render();
runAnimation();
