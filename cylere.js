/*
*The script begins by resizing the width of the Photoshop canvas to a constant DISTORTION
*Then, after defining variables based on the canvas size, it will progressively scroll from the center
*of the canvas to the top and bottom of the canvas simulatenously.
*/

//Use Pixels
app.preferences.rulerUnits = Units.PIXELS

//Constants
const DISTORTION = 2          //The stretch factor (the maximum distortion of the image at the poles)
const deg2rad = Math.PI / 180 //degrees to radians

//save width and height of image to variables w and h
var doc = app.activeDocument
var w = doc.width.toString()
var h = doc.height.toString()

//Resize canvas to DISTORTION width
doc.resizeCanvas(UnitValue(w * DISTORTION, "px"), UnitValue(h, "px"))

//Set up Variables and Constants
var equator = h / 2                             //define the equator as half the height
var lMer = (DISTORTION - 1) / 2 * w             //this is the location of the left edge of the original image on the new wider image
var rMer = (((DISTORTION - 1) / 2) + 1) * w     //this is the location of the right edge of the original image on the new wider image
var lc = (90 / equator)                         //latitude constant = latitudinal degrees/pixel
var perIncr                                     //percent increase
var nR                                          //new planet radius
var nHemi                                       //north hemisphere
var sHemi                                       //south hemisphere

//start loop from equator (lat 0) to poles (lat 90)
var i //latitude
for (i = 0; i < (equator) ; i++) {

    //define northern hemisphere row
    nHemi = Array(Array(lMer, equator - 1 - i), Array(rMer, equator - 1 - i), Array(rMer, equator - i), Array(lMer, equator - i))
    //define southern hemisphere row
    sHemi = Array(Array(lMer, equator + 1 + i), Array(rMer, equator + 1 + i), Array(rMer, equator + i), Array(lMer, equator + i))

    //select the row in the northern hemisphere
    doc.selection.select(nHemi)
    //add the row in the southern hemisphere to selection
    doc.selection.select(sHemi, SelectionType.EXTEND)

    /*find the new radius based on latitude, keeps the old radius at the equator and stretches toward the poles
    * to get the correct amount of stretching, each row of pixels has to be stretched by a specific amount,
    * The formula would be w * some scalar
    * w is the width
    * that scalar changes as you move away from the poles, starting at 1 at the equator and making it's way up to DISTORTION at the poles
    * DISTORTION is the maximum stretching the image will experience
    * D-(D-1)cos(lc * deg2rad * i) is the formula for the scalar that determines how much to stretch at each i
    */
    nR = w * (DISTORTION - ((DISTORTION - 1) * (Math.cos(lc * deg2rad * i))))

    //calculate the percentage increase in the radius
    perIncr = nR / w

    //resize the selection only if selection is not empty
    try {
        doc.selection.resize(100 * perIncr, 100, AnchorPosition.MIDDLECENTER)
    }
    catch (e) {
        // skip row if row is empty
    }

}

//finish script by deselecting
doc.selection.deselect()
alert("Finished")