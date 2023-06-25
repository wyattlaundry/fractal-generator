
//Generates fractal!
function teragonify(generator, transform, iterations) {

    if (iterations == 0)
        return generator;


    //Empty teragon array to insert results
    var teragon = [];

    //Loop through each path element of the current iteration
    for (let i = 0; i < generator.length; i++) {

        //Determine transform action based on parameter
        //transform = [180-rotation, mirror]
        transformedGenerator = teragonify(generator, transform, iterations - 1);

        //If 180-Rotate
        if (transform[i][0])
            transformedGenerator = creverse(transformedGenerator);

        //If Mirror
        if (transform[i][1])
            transformedGenerator = cmultList(unit(getFamily(transformedGenerator)), conjugateList(transformedGenerator))

        //Apply modified generator to each path element
        for (let j = 0; j < transformedGenerator.length; j++)
            teragon.push(cmult(generator[i], transformedGenerator[j]));

    }
    return teragon;

}

//Complex Multiplication
function cmult(z1, z2) {
    return [z1[0] * z2[0] - z1[1] * z2[1], z1[0] * z2[1] + z1[1] * z2[0]]
}


//Multiple a whole list of complex numbers by a complex number
function cmultList(z, zList) {

    var multipliedList = [];

    for (let i = 0; i < zList.length; i++)

        multipliedList.push(cmult(z, zList[i]))

    return multipliedList;



}

//Complex Conjugate
function conjugate(z) {
    return [z[0], -1 * z[1]];
}

//Complex Conjugate of list
function conjugateList(zList) {

    var conjugates = [];

    for (let i = 0; i < zList.length; i++)

        conjugates.push(conjugate(zList[i]));

    return conjugates;

}



//Calculates family value as complex number of generator
function getFamily(generator) {

    xSum = 0;
    ySum = 0;

    for (let i = 0; i < generator.length; i++) {

        xSum += generator[i][0]
        ySum += generator[i][1]
    }

    return [xSum, ySum];

}

//Makes unit version of a complex number
function unit(z) {

    var mag = (z[0] ** 2 + z[1] ** 2) ** 0.5;
    return [z[0] / mag, z[1] / mag];

}


//Reverses a list of complex numbers
function creverse(zList) {

    reversedList = []

    for (let i = zList.length - 1; i >= 0; i--)

        reversedList.push(zList[i])

    return reversedList;

}

function isoTransformation(generator) {

    isoGenerator = [];

    omega = [-1 / 2, 3 ** 0.5 / 2]; //Isomatric grid transformation

    for (let i = 0; i < generator.length; i++)

        isoGenerator.push([generator[i][0] + generator[i][1] * omega[0], generator[i][1] * omega[1]]);

    return isoGenerator;



}

//Draws line on a canvas
function drawLine(ctx, x1, y1, x2, y2, stroke = 'black', width = 3) {

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.stroke();

}

//Points for transform
function drawPoint(context, x, y, color, size) {

    if (color == null) 
      color = '#000';
    
    if (size == null) 
        size = 5;
    
    // to increase smoothing for numbers with decimal part
    var pointX = Math.round(x);
    var pointY = Math.round(y);

    context.beginPath();
    context.fillStyle = color;
    context.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
    context.fill();

}

//Points for transform
function drawTriangle(context, color, x1, y1, x2, y2, x3, y3) {

    if (color == null) 
      color = '#000';

    context.beginPath();
    context.fillStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.fill();

}


//Modifies fractal so that it sits in specific window visible
//Assumes square window
function getDrawableFractal(fractal, canvasId){

    //Get canvas size
    windowSize = $("#"+canvasId).width()
    windowSize = document.getElementById(canvasId).width

    //New Fractal array
    drawableFractal = []

    //Finds perfect scale so it fits on drawing canvas
    var family = getFamily(fractal)
    var familyMag = (family[0] ** 2 + family[1] ** 2) ** 0.5
    scale = windowSize*0.4 / familyMag; //<------ Changes scale within fractal

    //Does the scaling for each part of fractal
    for (let i = 0; i < fractal.length; i++) 
        drawableFractal.push([fractal[i][0]*scale,fractal[i][1]*scale]);
    
    return drawableFractal;

}

//Assumes fractal is scaled to fit in canvas
function drawFractal(fractal, canvasId, transform){

    //If transform matrix is passed, draw it too
    showTransforms = transform!=null

    //Get size of canvas
    windowSize = $("#"+canvasId).width()
    windowSize = document.getElementById(canvasId).width

    //2D Drawing Context and clear
    context = document.getElementById(canvasId).getContext('2d');
    context.clearRect(0, 0, windowSize, windowSize);
    
    //Family, but in this method it just means size of frical from start to end
    family = getFamily(fractal)
    offset = [windowSize/2-family[0]/2, windowSize/2-family[1]/2]

    current=[0,0]
    for (let i = 0; i < fractal.length; i++) {

        var x1 = offset[0] + current[0];
        var y1 = windowSize - (offset[1] + current[1]);

        var x2 = offset[0] + current[0] + fractal[i][0];
        var y2 = windowSize - (offset[1] + current[1] + fractal[i][1]);

        //Draw Line
        drawLine(context, x1, y1, x2, y2, 'tomato', 1);

        //Display transforms if enabled
        if(showTransforms){

            var arrowPercent = 0.2;
            var arrowHeight = 0.2;

            var orth = cmult(fractal[i], [0,1])
            orth[0] *= arrowHeight
            orth[1] *= arrowHeight

            indicatorX = x1 + orth[0]/2  + arrowPercent * fractal[i][0];
            indicatorY = y1 - orth[1]/2  - arrowPercent * fractal[i][1];

            connectorX = x1 + arrowPercent * fractal[i][0];
            connectorY = y1 - arrowPercent * fractal[i][1];

            arrowEndX = x1 
            arrowEndY = y1

            //If No 180 Rotate, indicator goes at end point
            if(!transform[i][0]) {
                //add length of line
                indicatorX += (1 - 2*arrowPercent) * fractal[i][0];
                indicatorY -= (1 - 2*arrowPercent) * fractal[i][1];

                connectorX += (1 - 2*arrowPercent) * fractal[i][0];
                connectorY -= (1 - 2*arrowPercent)  * fractal[i][1];

                arrowEndX = x2;
                arrowEndY = y2;
            }

            //If just 1 transform not both, flip across line
            if(transform[i][0]^transform[i][1]) {

                //add length of line
                indicatorX -= orth[0];
                indicatorY += orth[1];
            }

            drawTriangle(context, 'tomato', indicatorX, indicatorY, arrowEndX, arrowEndY, connectorX, connectorY);

        }

        current[0] += fractal[i][0]
        current[1] += fractal[i][1]
    
    }

}

