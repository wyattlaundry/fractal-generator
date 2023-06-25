/*

TO-DO:
More advanced "drawableFractal" function - not just start to end, sometimes gopes off screen
Color options for the vibez

math:
auto-generate generator optiosn based on family


*/

//Initial Fractal - Dragon of Eve
var generator = [[1,0],[0,1]];
var transform = [[0,0],[1,0]];
var iterations = 13;
var isGaussian = true;

//On Startup
$(function(){

    //Set generator table default in the future
    //HERE

    //Set default Iteration Field 
    $("#iterations-field").val(iterations);

    //Set Default slider iteration values
    $('#iteration-range').val(iterations);
    $('#iteration-range').prop("max", iterations);

    //Iteration label
    $("#iteration-label").html("N="+iterations);
    
    //Set ISOMETRIC checkbox here
    $("#isometric-checkbox").prop( "checked", !isGaussian);

    updateGeneratorPreview(generator);
    drawApplicationFractal();
  
});

//Add Path Button to Generator
$('#path-add').click(function(){ 
    const newTr = `
        <tr>
            <td contenteditable="true">0,1</td>
            <td contenteditable="true">0,0</td>
            <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteRow(this)">-</button></td>
        </tr>
        `;
    $('#generator-content').append(newTr);
});

//Draw fractal based on selected generator
$('#draw-fractal').click(function(){ 
    drawApplicationFractal();
});

//Updates preview window
function updateGeneratorPreview(){

    //Transform Generator to assighned coordinate grid
    if (!isGaussian)
        coordGenerator = isoTransformation(generator);
    else
        coordGenerator = generator;

    //Draw Generator
    drawableGen = getDrawableFractal(coordGenerator, 'generator-canvas');
    drawFractal(drawableGen, 'generator-canvas', transform);

}

//Fires on generator table edit
$('#generator-table').bind("DOMSubtreeModified", function() {

    //Extract data from table
    var data = [];
    $("table#generator-table tr").each(function() {
        var arrayOfThisRow = [];
        var tableData = $(this).find('td');
        if (tableData.length > 0) {
            tableData.each(function() { arrayOfThisRow.push($(this).text()); });
            data.push(arrayOfThisRow);
        }
    });

    //Put into standard format for fractal.js
    data = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
    for(i=0; i<data.length; i++){
        for(j=0; j<data[i].length; j++){
            temp=data[i][j].split(",");
            data[i][j]=[parseInt(temp[0]), parseInt(temp[1])]
        }
    }
    
    //Update global parameters of fractal
    generator = data[0];
    transform = data[1];

    //Update Window Preview of Generator Live
    updateGeneratorPreview();

    
});

//Row Delete Button
function deleteRow(o) {
    var p=o.parentNode.parentNode;
    p.parentNode.removeChild(p);
   }

//Redraw generator and fractal when isometric grid changed
$('#isometric-checkbox').change(function() {
    isGaussian = !this.checked;

    updateGeneratorPreview();
    drawApplicationFractal();
});

$("#iterations-field").change(function(){

    //Set slider current iteration
    $('#iteration-range').prop("max", $(this).val());


})

//Redraw fractal when iteration changes
$('#iteration-range').on("input",function() {

    //Set globaal iterations to this value
    iterations =$(this).val();

    drawApplicationFractal();
});

//Main function called to draw Fractal
function drawApplicationFractal(){

    //Transform Generator to assighned coordinate grid
    if (!isGaussian)
        coordGenerator = isoTransformation(generator);
    else
        coordGenerator = generator;

    var fractal = teragonify(coordGenerator, transform, iterations)

    //Design Choice - Rotates so always in same position as root
    var angle = unit(getFamily(coordGenerator));
    var rotation = [1, 0];
    for (let i = 0; i < iterations; i++)
        rotation = cmult(conjugate(angle), rotation);
    var fractal = cmultList(rotation, fractal);

    //Scales and Draws Fractal
    drawableFractal = getDrawableFractal(fractal, 'fractal-canvas');
    drawFractal(drawableFractal, 'fractal-canvas');

    //Update iteration label
    $("#iteration-label").html("N="+iterations);

}



/* FRACTAL ARCHIVE */

/*

//Dragon Curve
var generator = [[1,0],[0,1]];
var transform = [[0,0],[1,0]];
var isGaussian = true;

//Dragon of Eve
var generator = [[0,1],[1,-1],[1,0]];
var transform = [[0,0],[0,0],[1,0]];
var isGaussian = true;

//Relative of Dragon of Eve
var generator = [[0,1],[1,-1],[1,0]];
var transform = [[0,0],[1,0],[0,0]];
var isGaussian = true;

//5-Dragon
var generator = [[0,1],[1,0],[0,-1],[1,0],[0,1]];
var transform = [[0,0],[0,0],[0,0],[0,0],[0,0]];
var isGaussian = true;

//Koch Curve
var generator = [[1,0],[1,1],[0,-1],[1,0]];
var transform = [[0,0],[0,0],[0,0],[0,0]];
var isGaussian = false;

//Mandelbrot Koch Filler
var generator = [[1,1],[1,1],[1,0],[0,-1],[-2,-1],[1,0],[1,0]];
var transform = [[0,1],[1,1],[1,1],[1,1],[1,0],[0,1],[1,1]];
var isGaussian = false;

//Monkey Tree (Not working)
var generator = [[1,2],[1,2],[2,1],[1,-1],[-1,0],[-1,0],[-1,-1],[0,-1],[0,-1],[2,1],[2,1]];
var transform = [[0,1],[1,1],[0,0],[1,1],[1,1],[0,1],[1,0],[1,0],[0,0],[1,0],[0,0]];
var isGaussian = false;

//Minkowski
var generator = [[1, 0],[0, 1],[1, 0],[0, -1],[0, -1],[1, 0],[0, 1],[1, 0]];
var transform = [[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0],[0, 0]];
var isGaussian = true;

//Gosper
var generator = [[1, 0],[1, 1],[-1, 0],[0, 1],[1, 0],[1, 0],[0, -1]];
var transform = [[0, 0],[1, 0],[1, 0],[0, 0],[0, 0],[0, 0],[1, 0]];
var isGaussian = false;

//Triangle of Rosess
var generator =  [1, 2],[2, -1],[-2, -1],[2, 1],[2, -1]];
var transform = [[0, 1],[0, 1],[1, 0],[1, 0],[0, 1]];
var isGaussian = true;



ONES I FOUND

generator = [[0,1],[1,0],[1,-1]]
transform =  [[0,0],[0,0],[1,0]]

Gold-ish Dragon
generator = [[2,1],[1,-1]]
transform =  [[0,0],[1,0]]

generator = [[1,1],[1,1],[0,-1]]
transform =  [[0,0],[1,0],[0,0]]

*/

