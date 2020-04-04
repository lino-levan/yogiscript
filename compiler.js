const fs = require('fs');

if(process.argv.length<3){
  throw "No file name given."
}

if(process.argv[2]==="help"){
  console.log("Args:\nPre-compiled script\nName of compiled script");
  console.log("\nNot:Having errors? Make sure you have good indentation. Bad indentation can prevent the compiler from working properly.")
  process.exit();
}

if(process.argv[2]==="version" || process.argv[2]==="v" || process.argv[2]==="-v" || process.argv[2]==="--v"){
  console.log("Yogiscript Compiler v0.1");
  process.exit();
}
let fileName = process.argv[3] || process.argv[2].split(".")[0]+".js";

function compile(file){
  let final = "";

  for(let i = 0;i<file.length;i++){
      final+=file[i];
  }

  let splitLine = file.split("\n");
  let ignore = false;
  for(let i = 0;i<splitLine.length;i++){
    for(let j = 0;j<splitLine[i].length;j++){
      if(splitLine[i][j]==='"' || splitLine[i][j]==="'"){
        ignore=!ignore;
        debug("Ignore Status Changed to "+ignore);
      }
      if(splitLine[i].substring(j,j+4)==="yogi" && !ignore){
        debug("At Yogi");
        if(splitLine[i].includes("{") && !splitLine[i].includes("=")){
          if(splitLine[i].indexOf("(")>-1){
            if(splitLine[i].indexOf("(")>splitLine[i].indexOf("yogi")){
              splitLine[i]=splitLine[i].replace("yogi","function");
            }else{
              throw("Extra parenthesis found on line "+i);
            }
          }else{
            splitLine[i]=splitLine[i].replace("yogi","function")
            splitLine[i]=splitLine[i].replace("{","(){")
          }
        }else{
          if(splitLine[i].includes("=")){
            splitLine[i]=splitLine[i].replace("yogi","let")
          }
        }
      }
    }
  }
  debug(splitLine)
  final = splitLine.join("\n");

  fs.writeFileSync(fileName,final,(err)=>{
    if(err){
      console.log(err);
    }
  })
  console.log("Compiled file to "+fileName+":")


  debug("\nRunning "+fileName)
  try{
    eval(final)
  }
  catch(err){}
}

function debug(input){
  if(process.argv[4]==="debug"){
    console.log(input);
  }
}

compile(fs.readFileSync(process.argv[2], {encoding: 'utf-8'}))
