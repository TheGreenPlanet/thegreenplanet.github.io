//EASY-STRUCT, BY Edvin Illes
//GOALS:
//1. Avoid loops and out of syncing
//2. Class implementation
///////////////////////////////////////
//TODOS:
//1. Getting the lines by spaces problem
//2. Implement 'identifier' function for coloring known datatypes


// Global scope (doc vars)
var paddingChars = 4, bit32 = true
var datatypeList = []


window.onload = () => 
{
    // update the datatypeList when switching between 32 and 64-bit
    initDatatypeList()
}

// Classes
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
    constructor (datatype, name, pos, line = 0, specifier = "")
    {
        this.datatype = new Conversion(datatype)
        this.name = new Conversion(name)
        this.pos = new Conversion(pos)
        this.line = line
        this.specifier = new Conversion(specifier)
    }

    stringForm()
    {
        return this.datatype.value + " " + this.name.value + " " + this.pos.value
    }
}

//let member = new Member(a, b, c)
//member.pos.ToInt()

// Convertions
function intToHexStr(int)
{
    return ('0000' + int.toString(16).toUpperCase()).slice(-4)
}

function hexToInt(hex)
{
        return parseInt(hex, 16)
}
/////////////////////////////////

// returns a big string format without \n
function getTextLines() //returns a big string format without \n
{
    var text = document.getElementById("easy-struct-input")
    return text.value.split("\n").filter(function (el) { return el != ""; })
}

function is32Bit()
{
    var elem = document.getElementById("button-bit-switch")
    return elem.innerHTML == "32-bit"
}

function toggle(elem, onText, offText)
{
    if (elem.innerHTML == onText)
        elem.innerHTML = offText
    else
        elem.innerHTML = onText
}

function getCustomSizeInput()
{
    var elem = document.getElementsByName("custom-size")[0]
    return elem.value
}

function getStructName()
{
    var elem = document.getElementsByName("struct-name")[0]
    return elem.value
}

function arraySizeMultiplier(member)
{
    name = member.name.value

    if (name.includes("[") || name.includes("]"))
    {
        if (name.includes("["))
        {
            if (name.includes("]"))
            {
                return parseInt(name.substring(name.indexOf("[")+1, name.indexOf("]")))
            }
            else
                alert("Typo: missing ']' on line " + member.line)
        }
        else
            alert("Typo: missing '[' on line " + member.line)
    }
    else return 1
}

class Datatype
{
    constructor(name, size)
    {
        this.name = name
        this.size = size
    }
}


// the dataTypeList will replace the "getDatatypeSize" function
// TODO: change the sizes based on what bit were on
function initDatatypeList()
{
    // exception
    datatypeList.push(new Datatype("zero", 0))
    
    // vectors
    datatypeList.push(new Datatype("Vector3", 12))
    datatypeList.push(new Datatype("Vector2", 8))
    datatypeList.push(new Datatype("Vec3", 12))
    datatypeList.push(new Datatype("Vec2", 8))

    // cpp datatypes
    datatypeList.push(new Datatype("bool", 4))
    datatypeList.push(new Datatype("int", 4))
    datatypeList.push(new Datatype("__int32", 4))
    datatypeList.push(new Datatype("__int64", 8))
    datatypeList.push(new Datatype("void", 4))
    datatypeList.push(new Datatype("char", 1))
    datatypeList.push(new Datatype("short", 2))
    datatypeList.push(new Datatype("double", 8))
    
    // Windows.h
    datatypeList.push(new Datatype("DWORD", 4))
    datatypeList.push(new Datatype("QWORD", 8))
    datatypeList.push(new Datatype("BYTE", 1))


}


function updateSyntaxHighlighting()
{
    // get the text from textarea
    var text = document.getElementById("easy-struct-input").value
    // loop through the "datatypeList" and compare the it to the textarea, if a match is found find the index and highlight it.
    index = text.indexOf("int")
    if (index != -1)
        text.substring(index, index+3)


}

function getDatatypeSize(member)  //Hard coded datatype sizes, (get from another site perhaps?)
{
    datatype = member.datatype.value

    if (datatype == "zero")
        return 0

    if (datatype.includes("*"))
        if (is32Bit())
            return 4
        else
            return 8

    switch (datatype) {
        // Vectors
        case "Vector3":
            return 12
            break
        case "Vector2":
            return 8
            break
        case "bool":
        // integers
        case "int":
        case "__int32":
        case "unsigned int":
        case "long":
        case "unsigned long":
        // floats
        case "float":
        case "unsigned float":
        // void
        case "void":
            return 4
            break
        case "char":
            return 1
            break
        default:
            alert("Unknown datatype: " + datatype + " on line " + member.line)
            return 0
            break
    }
}

// returns a Member
function getData(l, line)
{
    datatypeIndex  = 0
    nameIndex      = 0
    posIndex       = 0
    specifierIndex =0

    datatype      = ""
    name          = ""
    pos           = ""
    specifier     = ""

    // datatype
    for (i = 0; i < datatypeList.length; i++)
    {
        datatypeIndex = line.search(datatypeList[i].name)
        if (datatypeIndex != -1)
        {
            datatype = datatypeList[i].name
            break;
        }
    }
    if (!datatype)
        alert("Incorrect datatype format: " + parseInt(l + 1))

    // position
    posIndex = line.lastIndexOf("0x")

    if (posIndex == -1)
        alert("Incorrect position format: " + parseInt(l + 1))

    // get substring between posIndex and "\n"
    pos = line.substring(posIndex, line.length)
    // trim whitespaces
    pos = pos.trim()

    // name
    datatypeEndIndex = datatypeIndex + datatype.length
    
    name = line.substring(datatypeEndIndex, posIndex)
    // trim whitespaces
    name = name.trim()

    // specifier / extra
    if (datatypeIndex > 0)
    {
        specifier = line.substring(0, datatypeIndex)
        specifier = specifier.trim()
    }

    return new Member(datatype, name, pos, l+1, specifier)
}

// returns a sorted array with all elements
function sortMembers()   // returns a sorted array with all elements 
{
    var members = []
    for (var i = 0; i < getTextLines().length; i++) // iterate through the text lines and extract data
    {
        line = getTextLines()[i]
            // datatype     get the datatype by searching for its index
            // name         will always be a space between the datatype index, aswell as between pos
            // pos          will always be the last 0x
            let member = getData(i, line)
            //let member = new Member(datatype, name, pos, i+1) //push the str elements as an array, into the sorted Elements list ( { [ datatype, name, size ], ...} )
            members.push(member)
            // }
            // else
            // {
            //     alert("Incorrect format: " + parseInt(i + 1))
            //     break;
            // }
    }
    return members.sort(function(a, b){return a.pos.ToInt() - b.pos.ToInt()})
}

function addPadding(currMem, nextMem)
{
    var icurrSize = getDatatypeSize(currMem), icurrPos = currMem.pos.ToInt(), inextPos = nextMem.pos.ToInt()

    arrayMultiplier = arraySizeMultiplier(currMem)

    icurrEndPos = icurrPos + icurrSize * arrayMultiplier

    padd = inextPos - icurrEndPos

    if (padd < 0)
        alert("Error! [" + currMem.stringForm() + "] is overlapping [" + nextMem.stringForm() + "] at lines " + currMem.line + " - " + nextMem.line + "\nSolution 1: " + nextMem.stringForm() + ", possible position is 0x" + icurrEndPos.toString(16).toUpperCase() + "\nSolution 2: " + currMem.stringForm() + ", reduce array size")

    if (padd != 0)
        return "    char _0x" + intToHexStr(icurrEndPos) + "[0x" + padd.toString(16).toUpperCase() + "];" + " //0x" + intToHexStr(icurrEndPos) + "\n"
    else
        return "" 
}

function solveAndFormat()
{
    var buildStr = ""
    var sorted = sortMembers()

    buildStr += "\nstruct " + getStructName() + "\n{\n"

    if (sorted[0].pos.ToInt() != 0)     // if the position of the first member isnt zero, we'll need some dummy padding
        buildStr += addPadding(new Member("zero", "first", "0x0000"), sorted[0])

    for (var i = 0; i < sorted.length; i++)
    {
        member = sorted[i]    //(performance) instead of calling sortmember every iteration

        buildStr += "    " + member.specifier.value + " " + member.datatype.value + " " + member.name.value + ";" + " //0x" + intToHexStr(member.pos.ToInt()) + "\n"//draw current member

        //draw and calc padding
        if (i+1 < sorted.length)
            buildStr += addPadding(member, sorted[i+1])
        else
        {
            if (getCustomSizeInput() === "")
            {
                arrayMultiplier = arraySizeMultiplier(member)
                buildStr += "    //size: 0x" + intToHexStr(member.pos.ToInt() + getDatatypeSize(member) * arrayMultiplier) + "\n"
            }
            else
            {
                buildStr += addPadding(member, new Member("zero", "last", getCustomSizeInput()))  // int to hex !
                buildStr += "    //size: " + getCustomSizeInput() + "\n"
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

// invoked after "solveAndFormat()" to get longest length of a mem, replace "//0x" with right amount of spacing
function structureComments(builtStr)
{
    var longestChars = 0, structure = ""

    lines = builtStr.split("    ")
    //lines.shift()   // remove 'struct'

    longestChars = longestStringForLoop(lines).length - 9 // " //0x0000" = 9 chars

    // good example of when the replace function comes to use. Instead of using messy vars
    for (var l = 0; l < lines.length; l++)
    {
        line = lines[l]

        var neededChars = longestChars - (line.length - 9)
        structure += "    " + line.replace("; //0x", ";" + " ".repeat(neededChars + paddingChars) + "//0x")
    }
    // overwrite
    return structure
}

