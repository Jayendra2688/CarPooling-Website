
exports.checkIdAndEmail = function(str1,str2){

    if(str1.length!=10){
        return false;
    }
    let str2_1 = str2.slice(0,10);
    if(str1===str2_1){
        return true;
    }else{
        return false;
    }

}
exports.checkEmail = function(str){
    if(str.length<14){
        return false;
    }
    let checkstr= "ni.ca.atiii@"
    let i = 0;
    let j = str.length-1;
    while(i<=11){
        if(checkstr[i]!=str[j]){
           return false;
        }
        i++;
        j--;
    }

    return true;
} 
exports.checkPassword = function(str1,str2){
    if(str1.length>0 && str1==str2){
        return true;
    }else{
        return false;
    }
}