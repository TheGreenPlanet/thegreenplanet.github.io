//EASY-STRUCT, BY Edvin Illes
//GOALS:
//1. Avoid loops and out of syncing
//2. Class implementation
///////////////////////////////////////
//TODOS:
//1. Getting the lines by spaces problem
//2. Implement 'identifier' function for coloring known datatypes


// -- Global scope (doc vars)
var extraChars = 4, customEnabled = false, customSize = "0xFF";

// -- Classes
class Conversion
{
    constructor (value)
    {
        this.value = value
    }

    ToInt() {
        return parseInt(this.value, 16)
    }

    ToHex(){
        return ('0000' + this.value.toString(16).toUpperCase()).slice(-4)
    }
}

class Member
{
    constructor (datatype, name, pos)
    {
        this.datatype = new Conversion(datatype)
        this.name = new Conversion(name)
        this.pos = new Conversion(pos)
    }
}

//let member = new Member(a, b, c)
//member.pos.ToInt()

// -- Convertions
function intToHexStr(int)
{
    return ('0000' + int.toString(16).toUpperCase()).slice(-4)
}

function hexToInt(hex)
{
        return parseInt(hex, 16)
}
/////////////////////////////////

// -- returns a big string format without \n
function getTextLines() //returns a big string format without \n
{
    var text = document.getElementById("easy-struct-input")
    return text.value.split("\n").filter(function (el) { return el != ""; })
}

function getDatatypeSize(datatype)  //Hard coded datatype sizes, (get from another site perhaps?)
{
    switch (datatype) {
        //Vectors
        case "Vector3":
            return 12
            break
        case "Vector2":
            return 8
            break
        //integers
        case "int":
        case "__int32":
        case "unsigned int":
        case "long":
        case "unsigned long":
        //floats
        case "float":
        case "unsigned float":
            return 4
            break
        case "char":
            return 1
            break
        default:
            return 0
            break
    }
}

// -- returns a sorted array with all elements
function sortMembers()   //returns a sorted array with all elements 
{
    var members = []
    for (var i = 0; i < getTextLines().length; i++) //iterate through the text lines and extract data
    {
            var str_elements = getTextLines()[i].split(" ", 3)
            if (str_elements.length == 3)   //make sure that there are 3 elements ( datatype :: name :: size )
            {
                let member = new Member(str_elements[0], str_elements[1], str_elements[2]) //push the str elements as an array, into the sorted Elements list ( { [ datatype, name, size ], ...} )
                members.push(member)
            }
            else
            {
                alert("Incorrect number of elements at line: " + parseInt(i + 1))
                break;
            }
    }
    return members.sort(function(a, b){return a.pos.ToInt() - b.pos.ToInt()})
}

function addPadding(currMem, nextMem)
{
    var icurrSize = getDatatypeSize(currMem.datatype.value), icurrPos = currMem.pos.ToInt(), inextPos = nextMem.pos.ToInt()

    var padd = inextPos - (icurrPos + icurrSize)
    if (padd != 0)
        return "    char _0x" + intToHexStr(icurrPos + icurrSize) + "[0x" + padd.toString(16).toUpperCase() + "];" + " //0x" + intToHexStr(icurrPos + icurrSize) + "\n"
    else
        return "" 
}

function solveAndFormat()
{
    var buildStr = ""
    var sorted = sortMembers()

    buildStr += "struct\n{\n"

    if (sorted[0].pos.ToInt() != 0)     // if the position of the first member isnt zero, we'll need some init padding
        buildStr += addPadding(new Member("zero", "first", "0x0000"), sorted[0])

    for (var i = 0; i < sorted.length; i++)
    {
        members = sorted[i]    //(performance) instead of calling sortMembers every iteration

        buildStr += "    " + members.datatype.value + " " + members.name.value + ";" + " //0x" + intToHexStr(members.pos.ToInt()) + "\n"//draw current member

        //draw and calc padding
        if (i+1 < sorted.length)
            buildStr += addPadding(members, sorted[i+1])
        else
        {
            if (!customEnabled)
                buildStr += "    //size: 0x" + intToHexStr(members.pos.ToInt() + getDatatypeSize(members.datatype.value)) + "\n"
            else
            {
                buildStr += addPadding(members, new Member("zero", "last", customSize))  // int to hex !
                buildStr += "    //size: " + customSize + "\n"
            }
                
        }
            
    }
    buildStr = structureComments(buildStr)
    buildStr += "};"
    document.getElementById("easy-struct-output").innerHTML = buildStr;
}

function longestStringForLoop(arr) {
    let word = "";
    for (let i = 0; i < arr.length; i++) {
      if (word.length < arr[i].length) {
        word = arr[i];
      }
    }
    return word;
  }

// -- invoked after "solveAndFormat()" to get longest length of a mem, replace "//0x" with right amount of spacing
function structureComments(builtStr)
{
    var longestChars = 0, structure = ""
    // why the fuck is 'struct' splited???
    lines = builtStr.split("    ")
    // lines.sort((a, b) => { return b.length - a.length })
    longestChars = longestStringForLoop(lines).length - 9 // " //0x0000" = 9 chars

    // good example of when the replace function comes to use. Instead of using messy vars
    lines.forEach((line) =>
    {
        var neededChars = longestChars - (line.length - 9)
        structure += "    " + line.replace("; //0x", ";" + " ".repeat(neededChars + extraChars) + "//0x")
    })
    // overwrite
    return structure
}

